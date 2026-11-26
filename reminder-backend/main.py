import asyncio
import base64
import hashlib
import json
import logging
import os
import re
import sqlite3
import threading
import time

from contextlib import asynccontextmanager, contextmanager, suppress
from datetime import date as CalendarDate, datetime, timedelta
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
from pywebpush import WebPushException, webpush


# --------------------------------------------------
# Configuration
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "").strip()
PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY", "").strip()
SUBJECT = os.getenv("VAPID_SUBJECT", "").strip()
ORIGIN = os.getenv("FRONTEND_ORIGIN", "").strip().rstrip("/")

if not PRIVATE_KEY or not PUBLIC_KEY:
    raise RuntimeError(
        "Missing VAPID keys. Run generate_keys.py first."
    )

if (
    not SUBJECT.startswith("mailto:")
    or "@" not in SUBJECT
    or "YOUR_EMAIL" in SUBJECT
):
    raise RuntimeError(
        "Set your real email in VAPID_SUBJECT."
    )

origin_url = urlsplit(ORIGIN)

if (
    origin_url.scheme not in ("http", "https")
    or not origin_url.netloc
    or origin_url.path
    or origin_url.query
    or origin_url.fragment
):
    raise RuntimeError(
        "FRONTEND_ORIGIN must be an origin, without a page path."
    )

database_path = Path(
    os.getenv("DATABASE_PATH", "push.db")
)

DATABASE = (
    database_path
    if database_path.is_absolute()
    else BASE_DIR / database_path
)

DATABASE.parent.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger("medisafe-reminders")

# Use one server worker. This lock serializes schedule updates
# with the scheduler's delivery checks.
REMINDER_LOCK = threading.RLock()

REMINDER_COUNT = 3
REMINDER_INTERVAL = 60


def decode_url_key(value: str) -> bytes:
    return base64.b64decode(
        value + "=" * (-len(value) % 4),
        altchars=b"-_",
        validate=True,
    )


# Check that the existing VAPID keys match.
try:
    private_object = serialization.load_der_private_key(
        base64.b64decode(PRIVATE_KEY, validate=True),
        password=None,
    )

    if (
        not isinstance(
            private_object,
            ec.EllipticCurvePrivateKey,
        )
        or not isinstance(
            private_object.curve,
            ec.SECP256R1,
        )
    ):
        raise ValueError("Expected a P-256 private key.")

    expected_public = private_object.public_key().public_bytes(
        serialization.Encoding.X962,
        serialization.PublicFormat.UncompressedPoint,
    )

    if expected_public != decode_url_key(PUBLIC_KEY):
        raise ValueError("Public/private keys do not match.")

except Exception as error:
    raise RuntimeError(
        "Invalid VAPID configuration. "
        "Use the matching generated keys."
    ) from error


# --------------------------------------------------
# Database
# --------------------------------------------------

@contextmanager
def database():
    connection = sqlite3.connect(
        DATABASE,
        timeout=15,
    )
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    try:
        with connection:
            yield connection
    finally:
        connection.close()


with database() as connection:
    connection.executescript("""
        CREATE TABLE IF NOT EXISTS devices (
            token_hash TEXT PRIMARY KEY,
            endpoint TEXT NOT NULL UNIQUE,
            subscription TEXT NOT NULL,
            last_test REAL NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS schedules (
            token_hash TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            FOREIGN KEY (token_hash)
                REFERENCES devices(token_hash)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS push_jobs (
            token_hash TEXT NOT NULL,
            job_key TEXT NOT NULL,
            kind TEXT NOT NULL,
            payload TEXT NOT NULL,
            due_at REAL NOT NULL,
            expires_at REAL NOT NULL,
            next_try REAL NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            sent INTEGER NOT NULL DEFAULT 0,

            PRIMARY KEY (token_hash, job_key),

            FOREIGN KEY (token_hash)
                REFERENCES devices(token_hash)
                ON DELETE CASCADE
        );
    """)

    # Add the new column without deleting existing data.
    columns = {
        row["name"]
        for row in connection.execute(
            "PRAGMA table_info(push_jobs)"
        )
    }

    if "reminder_targets" not in columns:
        connection.execute(
            "ALTER TABLE push_jobs "
            "ADD COLUMN reminder_targets TEXT"
        )


# --------------------------------------------------
# Models
# --------------------------------------------------

class PushKeys(BaseModel):
    p256dh: str = Field(
        min_length=20,
        max_length=200,
    )
    auth: str = Field(
        min_length=10,
        max_length=100,
    )


class Subscription(BaseModel):
    endpoint: str = Field(
        min_length=20,
        max_length=2048,
    )
    keys: PushKeys


class TestRequest(BaseModel):
    language: Literal["en", "my"] = "my"


class MedicineReminder(BaseModel):
    name: str = Field(default="", max_length=300)
    nameEn: str = Field(default="", max_length=300)
    nameMy: str = Field(default="", max_length=300)
    dose: str = Field(default="", max_length=300)

    id: str = Field(
        min_length=1,
        max_length=100,
        pattern=r"^[A-Za-z0-9_-]+$",
    )

    startDate: CalendarDate
    endDate: CalendarDate | None = None

    times: list[str] = Field(
        min_length=1,
        max_length=24,
    )

    @model_validator(mode="after")
    def validate_dates_and_times(self):
        if self.endDate and self.endDate < self.startDate:
            raise ValueError(
                "End date must be on or after start date."
            )

        if len(set(self.times)) != len(self.times):
            raise ValueError(
                "Duplicate scheduled times."
            )

        for value in self.times:
            if not re.fullmatch(
                r"(?:[01]\d|2[0-3]):[0-5]\d",
                value,
            ):
                raise ValueError(
                    "Times must use HH:MM format."
                )

        return self


class TakenRecord(BaseModel):
    medicineId: str = Field(
        min_length=1,
        max_length=100,
    )
    date: CalendarDate
    time: str = Field(
        pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$"
    )


class ReminderSettings(BaseModel):
    language: Literal["en", "my"] = "my"

    timezone: str = Field(
        min_length=1,
        max_length=100,
    )

    medicines: list[MedicineReminder] = Field(
        max_length=200
    )

    logs: list[TakenRecord] = Field(
        max_length=4000
    )

    @model_validator(mode="after")
    def validate_settings(self):
        try:
            ZoneInfo(self.timezone)
        except (
            ZoneInfoNotFoundError,
            ValueError,
        ):
            raise ValueError("Invalid timezone.")

        ids = [
            medicine.id
            for medicine in self.medicines
        ]

        if len(ids) != len(set(ids)):
            raise ValueError(
                "Duplicate medicine IDs."
            )

        return self


# --------------------------------------------------
# Authentication and subscription validation
# --------------------------------------------------

def device_hash(authorization: str) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            401,
            "Device token required.",
        )

    token = authorization[len("Bearer "):]

    if not re.fullmatch(r"[a-f0-9]{64}", token):
        raise HTTPException(
            401,
            "Invalid device token.",
        )

    return hashlib.sha256(
        token.encode()
    ).hexdigest()


def validate_subscription(subscription: Subscription):
    try:
        url = urlsplit(subscription.endpoint)

        valid_endpoint = (
            url.scheme == "https"
            and url.hostname == "fcm.googleapis.com"
            and url.port in (None, 443)
            and not url.username
            and not url.password
            and not url.fragment
            and url.path.startswith("/")
        )

        if not valid_endpoint:
            raise ValueError(
                "Unsupported endpoint."
            )

        public = decode_url_key(
            subscription.keys.p256dh
        )
        auth = decode_url_key(
            subscription.keys.auth
        )

        ec.EllipticCurvePublicKey.from_encoded_point(
            ec.SECP256R1(),
            public,
        )

        if len(auth) != 16:
            raise ValueError(
                "Invalid auth key."
            )

    except Exception:
        raise HTTPException(
            400,
            "Invalid subscription. "
            "This version supports Chrome FCM subscriptions.",
        )


# --------------------------------------------------
# Notification content
# --------------------------------------------------

def notification_payload(
    language: str,
    test: bool,
    tag: str,
):
    if language == "my":
        if test:
            title = "MediSafe · Server Push စမ်းသပ်မှု"
            body = (
                "Server မှ ပို့သောအသိပေးချက် "
                "ဤ device ဆီ ရောက်လာပါပြီ။"
            )
        else:
            title = "MediSafe · ဆေးသောက်ချိန်"
            body = (
                "သင့်ဆေးသောက်ချိန် ရောက်ပါပြီ။ "
                "ကိုယ်ပိုင်ဆေးစာရင်းတွင် "
                "အစီအစဉ်ကို ကြည့်ပါ။"
            )

    else:
        title = (
            "MediSafe · Server push test"
            if test
            else "MediSafe · Medicine reminder"
        )

        body = (
            "This notification was sent by the server."
            if test
            else (
                "It is time for your scheduled medicine. "
                "Open My Medicine to review your schedule."
            )
        )

    return {
        "title": title,
        "body": body,
        "language": language,
        "tag": tag,
    }


# --------------------------------------------------
# Reminder scheduling
# --------------------------------------------------

def current_time():
    return time.time()


def pending_targets(settings, targets):
    """
    Check original doses against the latest schedule
    and the latest taken records.
    """
    medicines = {
        medicine["id"]: medicine
        for medicine in settings["medicines"]
    }

    taken = {
        (
            log["medicineId"],
            log["date"],
            log["time"],
        )
        for log in settings["logs"]
    }

    remaining = []

    for target in targets:
        medicine = medicines.get(
            target["medicineId"]
        )

        day = target["date"]
        scheduled = target["time"]

        if (
            medicine
            and medicine["startDate"] <= day
            and (
                not medicine["endDate"]
                or day <= medicine["endDate"]
            )
            and scheduled in medicine["times"]
            and (
                medicine["id"],
                day,
                scheduled,
            ) not in taken
        ):
            remaining.append(target)

    return remaining


def enqueue_due_reminders():
    now = current_time()

    with database() as connection:
        rows = connection.execute("""
            SELECT token_hash, payload
            FROM schedules
        """).fetchall()

    for row in rows:
        try:
            settings = json.loads(
                row["payload"]
            )

            zone = ZoneInfo(
                settings["timezone"]
            )

            local_now = datetime.fromtimestamp(
                now,
                zone,
            )

            # Include yesterday so repeats for a 23:59 dose
            # can continue after midnight.
            candidate_dates = (
                local_now.date() - timedelta(days=1),
                local_now.date(),
            )

            for day_date in candidate_dates:
                day = day_date.isoformat()
                slots = {}

                for medicine in settings["medicines"]:
                    if (
                        medicine["startDate"] > day
                        or (
                            medicine["endDate"]
                            and medicine["endDate"] < day
                        )
                    ):
                        continue

                    for scheduled in medicine["times"]:
                        slots.setdefault(
                            scheduled,
                            [],
                        ).append({
                            "medicineId": medicine["id"],
                            "date": day,
                            "time": scheduled,
                        })

                for scheduled, targets in slots.items():
                    base = datetime.fromisoformat(
                        f"{day}T{scheduled}:00"
                    ).replace(
                        tzinfo=zone
                    ).timestamp()

                    window_end = (
                        base
                        + REMINDER_COUNT
                        * REMINDER_INTERVAL
                    )

                    if not (
                        base <= now < window_end
                    ):
                        continue

                    targets = pending_targets(
                        settings,
                        targets,
                    )

                    if not targets:
                        continue

                    for repeat in range(REMINDER_COUNT):
                        due = (
                            base
                            + repeat
                            * REMINDER_INTERVAL
                        )

                        expires = (
                            due
                            + REMINDER_INTERVAL
                        )

                        # Do not replay missed rounds in a burst.
                        if now >= expires:
                            continue

                        key = (
                            f"reminder:v2:{day}:"
                            f"{scheduled}:{repeat}"
                        )

                        payload = notification_payload(
                            settings["language"],
                            False,
                            key,
                        )

                        payload["reminderNumber"] = (
                            repeat + 1
                        )
                        payload["reminderTotal"] = (
                            REMINDER_COUNT
                        )

                        with database() as connection:
                            # Avoid repeating an initial reminder
                            # accepted by the previous version.
                            legacy = connection.execute("""
                                SELECT sent
                                FROM push_jobs
                                WHERE token_hash = ?
                                  AND job_key = ?
                            """, (
                                row["token_hash"],
                                f"reminder:{day}:{scheduled}",
                            )).fetchone()

                            if (
                                repeat == 0
                                and legacy
                                and legacy["sent"] == 1
                            ):
                                continue

                            connection.execute("""
                                INSERT OR IGNORE INTO push_jobs (
                                    token_hash,
                                    job_key,
                                    kind,
                                    payload,
                                    due_at,
                                    expires_at,
                                    next_try,
                                    reminder_targets
                                )
                                SELECT
                                    ?, ?, 'reminder',
                                    ?, ?, ?, ?, ?
                                WHERE EXISTS (
                                    SELECT 1
                                    FROM devices
                                    WHERE token_hash = ?
                                )
                            """, (
                                row["token_hash"],
                                key,
                                json.dumps(
                                    payload,
                                    ensure_ascii=False,
                                ),
                                due,
                                expires,
                                due,
                                json.dumps(targets),
                                row["token_hash"],
                            ))

        except Exception as error:
            logger.warning(
                "Schedule check failed: %s",
                type(error).__name__,
            )


def prepare_reminder(job):
    """
    Re-check the latest taken state immediately before
    submitting a reminder to the push service.
    """
    with database() as connection:
        row = connection.execute("""
            SELECT payload
            FROM schedules
            WHERE token_hash = ?
        """, (
            job["token_hash"],
        )).fetchone()

        settings = (
            json.loads(row["payload"])
            if row
            else None
        )

        targets = json.loads(
            job["reminder_targets"] or "[]"
        )

        remaining = pending_targets(settings, targets) if settings else []

        if not remaining:
            # sent=2 means cancelled, not delivered.
            connection.execute("""
                UPDATE push_jobs
                SET sent = 2
                WHERE token_hash = ?
                  AND job_key = ?
                  AND sent = 0
            """, (
                job["token_hash"],
                job["job_key"],
            ))

            return None

    old_payload = json.loads(
        job["payload"]
    )

    payload = notification_payload(
        settings["language"],
        False,
        job["job_key"],
    )

    number = old_payload.get(
        "reminderNumber",
        1,
    )

    payload["reminderNumber"] = number
    payload["reminderTotal"] = REMINDER_COUNT

    my = settings["language"] == "my"
    medicines = {medicine["id"]: medicine for medicine in settings["medicines"]}

    def one_line(value, limit):
        text = " ".join(str(value or "").split())
        return text if len(text) <= limit else text[:limit - 1] + "…"

    lines = []
    seen = set()
    for target in remaining:
        medicine_id = target["medicineId"]
        if medicine_id in seen:
            continue
        seen.add(medicine_id)
        medicine = medicines[medicine_id]
        name = (
            medicine.get("nameMy" if my else "nameEn")
            or medicine.get("name")
            or ("သောက်ရမည့်ဆေး" if my else "Your scheduled medicine")
        )
        name = one_line(name, 48)
        dose = one_line(medicine.get("dose"), 24)
        lines.append(f"{name} — {dose}" if dose else name)

    scheduled = remaining[0]["time"]
    payload["title"] = (
        "MediSafe · ဆေးသောက်ချိန်ရောက်ပါပြီ"
        if my else "MediSafe · Time for your medicine"
    )
    footer = (
        f"ဆေးသောက်ချိန် — {scheduled}\n"
        f"သတိပေးချက် {number}/{REMINDER_COUNT} · သောက်ပြီးပါက မှတ်ပါ။"
        if my else
        f"Scheduled time — {scheduled}\n"
        f"Reminder {number}/{REMINDER_COUNT} · Mark taken after taking."
    )

    # Leave room for the footer and the service worker's 400-unit limit.
    shown = min(3, len(lines))
    while True:
        extra = len(lines) - shown
        more = (
            f"နောက်ထပ် {extra} မျိုး — ဆေးစာရင်းကို ဖွင့်ကြည့်ပါ။"
            if my else f"+{extra} more — open My Medicine."
        )
        parts = lines[:shown] + ([more] if extra else []) + [footer]
        body = "\n".join(parts)
        if len(body.encode("utf-16-le", errors="replace")) // 2 <= 380 or shown == 0:
            break
        shown -= 1
    payload["body"] = body

    return json.dumps(
        payload,
        ensure_ascii=False,
    )


def deliver_pending_jobs():
    now = current_time()

    with database() as connection:
        jobs = connection.execute("""
            SELECT
                push_jobs.*,
                devices.subscription
            FROM push_jobs
            JOIN devices USING (token_hash)
            WHERE sent = 0
              AND attempts < 3
              AND due_at <= ?
              AND next_try <= ?
              AND expires_at > ?
            ORDER BY due_at
            LIMIT 50
        """, (
            now,
            now,
            now,
        )).fetchall()

    for job in jobs:
        data = job["payload"]

        if job["kind"] == "reminder":
            data = prepare_reminder(job)

            if data is None:
                continue

        with database() as connection:
            reservation = connection.execute("""
                UPDATE push_jobs
                SET attempts = attempts + 1,
                    next_try = ?
                WHERE token_hash = ?
                  AND job_key = ?
                  AND sent = 0
                  AND attempts < 3
                  AND next_try <= ?
                  AND expires_at > ?
            """, (
                current_time() + 20,
                job["token_hash"],
                job["job_key"],
                current_time(),
                current_time(),
            ))

            if reservation.rowcount != 1:
                continue

        try:
            remaining_seconds = int(
                job["expires_at"]
                - current_time()
            )

            if remaining_seconds <= 0:
                continue

            webpush(
                subscription_info=json.loads(
                    job["subscription"]
                ),
                data=data,
                vapid_private_key=PRIVATE_KEY,
                vapid_claims={
                    "sub": SUBJECT,
                },
                ttl=max(
                    1,
                    min(60, remaining_seconds),
                ),
                headers={
                    "Urgency": "high",
                },
                timeout=10,
            )

            with database() as connection:
                connection.execute("""
                    UPDATE push_jobs
                    SET sent = 1
                    WHERE token_hash = ?
                      AND job_key = ?
                """, (
                    job["token_hash"],
                    job["job_key"],
                ))

            # Accepted by the push service is not proof that
            # the user has seen the notification.
            logger.info(
                "Push accepted by the push service."
            )

        except WebPushException as error:
            code = (
                error.response.status_code
                if error.response is not None
                else None
            )

            if code in (404, 410):
                with database() as connection:
                    connection.execute("""
                        DELETE FROM devices
                        WHERE token_hash = ?
                    """, (
                        job["token_hash"],
                    ))

            logger.warning(
                "Push failed; HTTP status=%s",
                code,
            )

        except Exception as error:
            logger.warning(
                "Push failed: %s",
                type(error).__name__,
            )


def scheduler_tick():
    with REMINDER_LOCK:
        _scheduler_tick()


def _scheduler_tick():
    enqueue_due_reminders()
    deliver_pending_jobs()

    with database() as connection:
        connection.execute("""
            DELETE FROM push_jobs
            WHERE expires_at < ?
        """, (
            current_time() - 7 * 86400,
        ))


async def scheduler_loop():
    while True:
        try:
            await asyncio.to_thread(
                scheduler_tick
            )

        except Exception as error:
            logger.warning(
                "Scheduler error: %s",
                type(error).__name__,
            )

        await asyncio.sleep(10)


@asynccontextmanager
async def lifespan(app):
    task = asyncio.create_task(
        scheduler_loop()
    )

    try:
        yield
    finally:
        task.cancel()

        with suppress(asyncio.CancelledError):
            await task


# --------------------------------------------------
# Application
# --------------------------------------------------

app = FastAPI(
    title="MediSafe Reminder Backend",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN],
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "ngrok-skip-browser-warning",
    ],
)


# --------------------------------------------------
# Health and public configuration
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "medisafe-reminders",
    }


@app.get("/config")
def config():
    return {
        "publicKey": PUBLIC_KEY,
    }


# --------------------------------------------------
# Register a browser/device subscription
# --------------------------------------------------

@app.post("/subscription")
def subscribe(
    subscription: Subscription,
    authorization: str = Header(default=""),
):
    owner = device_hash(authorization)
    validate_subscription(subscription)

    with database() as connection:
        existing = connection.execute("""
            SELECT token_hash
            FROM devices
            WHERE endpoint = ?
        """, (
            subscription.endpoint,
        )).fetchone()

        if (
            existing
            and existing["token_hash"] != owner
        ):
            raise HTTPException(
                409,
                "This browser subscription is registered "
                "to another device token.",
            )

        connection.execute("""
            INSERT INTO devices (
                token_hash,
                endpoint,
                subscription
            )
            VALUES (?, ?, ?)
            ON CONFLICT(token_hash) DO UPDATE SET
                endpoint = excluded.endpoint,
                subscription = excluded.subscription
        """, (
            owner,
            subscription.endpoint,
            json.dumps(
                subscription.model_dump()
            ),
        ))

    return {
        "ok": True,
    }


# --------------------------------------------------
# Save medicine schedules and taken records
# --------------------------------------------------

@app.put("/reminders")
def save_reminders(
    settings: ReminderSettings,
    authorization: str = Header(default=""),
):
    owner = device_hash(authorization)

    with REMINDER_LOCK, database() as connection:
        existing = connection.execute("""
            SELECT 1
            FROM devices
            WHERE token_hash = ?
        """, (
            owner,
        )).fetchone()

        if not existing:
            raise HTTPException(
                404,
                "Connect this device first.",
            )

        connection.execute("""
            INSERT INTO schedules (
                token_hash,
                payload
            )
            VALUES (?, ?)
            ON CONFLICT(token_hash) DO UPDATE SET
                payload = excluded.payload
        """, (
            owner,
            settings.model_dump_json(),
        ))

        # Preserve job identities. Repeated Save clicks must
        # not restart the same reminder series.
        #
        # Pending jobs are checked against this latest payload
        # immediately before delivery. Taken, deleted, and
        # rescheduled doses are excluded.

    return {
        "ok": True,
    }


# --------------------------------------------------
# Separate 15-second server test
# --------------------------------------------------

@app.post("/test")
def test_push(
    request: TestRequest,
    authorization: str = Header(default=""),
):
    owner = device_hash(authorization)
    now = time.time()

    with database() as connection:
        existing = connection.execute("""
            SELECT 1
            FROM devices
            WHERE token_hash = ?
        """, (
            owner,
        )).fetchone()

        if not existing:
            raise HTTPException(
                404,
                "Connect this device first.",
            )

        reservation = connection.execute("""
            UPDATE devices
            SET last_test = ?
            WHERE token_hash = ?
              AND last_test <= ?
        """, (
            now,
            owner,
            now - 30,
        ))

        if reservation.rowcount != 1:
            raise HTTPException(
                429,
                "Wait 30 seconds before another test.",
            )

        job_key = (
            f"test:{time.time_ns()}"
        )

        payload = notification_payload(
            request.language,
            test=True,
            tag="medisafe-server-test",
        )

        connection.execute("""
            INSERT INTO push_jobs (
                token_hash,
                job_key,
                kind,
                payload,
                due_at,
                expires_at,
                next_try
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            owner,
            job_key,
            "test",
            json.dumps(
                payload,
                ensure_ascii=False,
            ),
            now + 15,
            now + 135,
            now + 15,
        ))

    return {
        "queued": True,
        "delaySeconds": 15,
    }


# --------------------------------------------------
# Disable reminders for this browser/device
# --------------------------------------------------

@app.delete("/subscription")
def disconnect(
    authorization: str = Header(default=""),
):
    owner = device_hash(authorization)

    with REMINDER_LOCK, database() as connection:
        # Foreign keys remove the device's schedules
        # and pending jobs as well.
        connection.execute("""
            DELETE FROM devices
            WHERE token_hash = ?
        """, (
            owner,
        ))

    return {
        "ok": True,
    }
