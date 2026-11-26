"""Isolated tests: synthetic keys, temporary SQLite, mocked push delivery."""
import base64
import importlib.util
import json
import os
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import patch
from zoneinfo import ZoneInfo

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec

TEMP = tempfile.TemporaryDirectory()
key = ec.generate_private_key(ec.SECP256R1())
os.environ.update({
    "VAPID_PRIVATE_KEY": base64.b64encode(key.private_bytes(
        serialization.Encoding.DER, serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption())).decode(),
    "VAPID_PUBLIC_KEY": base64.urlsafe_b64encode(key.public_key().public_bytes(
        serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)).decode().rstrip("="),
    "VAPID_SUBJECT": "mailto:test@example.com",
    "FRONTEND_ORIGIN": "https://example.com",
    "DATABASE_PATH": str(Path(TEMP.name) / "test.db"),
})
spec = importlib.util.spec_from_file_location("reminder_test_app", Path(__file__).resolve().parents[1] / "reminder-backend" / "main.py")
app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app)
AUTH = "Bearer " + "a" * 64
OWNER = app.device_hash(AUTH)
ZONE = ZoneInfo("Asia/Rangoon")


class ReminderTests(unittest.TestCase):
    def setUp(self):
        with app.database() as c:
            c.execute("DELETE FROM devices")
            c.execute("INSERT INTO devices(token_hash,endpoint,subscription) VALUES(?,?,?)",
                      (OWNER, "https://fcm.googleapis.com/test", "{}"))
        self.base = datetime(2026, 11, 26, 11, 0, tzinfo=ZONE).timestamp()
        self.now = self.base
        self.pushes = []
        self.clock = patch.object(app, "current_time", side_effect=lambda: self.now)
        self.push = patch.object(app, "webpush", side_effect=self.receive)
        self.clock.start()
        self.push.start()
        self.addCleanup(self.clock.stop)
        self.addCleanup(self.push.stop)
        self.medicine = {"id": "one", "startDate": "2026-11-26", "endDate": "2026-11-26", "times": ["11:00"]}
        self.save()

    def receive(self, **kwargs):
        self.pushes.append((self.now, json.loads(kwargs["data"])))
        self.assertEqual(kwargs["headers"]["Urgency"], "high")
        self.assertGreater(kwargs["ttl"], 0)
        self.assertLessEqual(kwargs["ttl"], 60)

    def save(self, medicines=None, logs=None):
        settings = app.ReminderSettings(
            language="en", timezone="Asia/Rangoon",
            medicines=[self.medicine] if medicines is None else medicines,
            logs=[] if logs is None else logs)
        app.save_reminders(settings, AUTH)

    def tick(self, seconds):
        self.now = self.base + seconds
        app.scheduler_tick()

    def taken(self, medicine_id="one", day="2026-11-26", scheduled="11:00"):
        return {"medicineId": medicine_id, "date": day, "time": scheduled}

    def test_exactly_three_one_minute_apart(self):
        for t in (0, 10, 59, 60, 70, 119, 120, 130, 180, 600): self.tick(t)
        self.assertEqual([t - self.base for t, _ in self.pushes], [0, 60, 120])
        self.assertEqual([p["reminderNumber"] for _, p in self.pushes], [1, 2, 3])

    def test_mark_taken_after_first_cancels_remaining(self):
        self.tick(0)
        self.save(logs=[self.taken()])
        for t in (60, 120, 180): self.tick(t)
        self.assertEqual(len(self.pushes), 1)

    def test_mark_taken_before_due_sends_nothing(self):
        self.save(logs=[self.taken()])
        for t in (0, 60, 120): self.tick(t)
        self.assertEqual(self.pushes, [])

    def test_delete_cancels_pending(self):
        self.tick(0)
        self.save(medicines=[])
        self.tick(60)
        self.tick(120)
        self.assertEqual(len(self.pushes), 1)

    def test_edit_cancels_old_slot_and_starts_new(self):
        self.tick(0)
        self.medicine["times"] = ["11:05"]
        self.save()
        for t in (60, 120, 300, 360, 420, 480): self.tick(t)
        self.assertEqual([t - self.base for t, _ in self.pushes], [0, 300, 360, 420])

    def test_repeated_save_does_not_restart_series(self):
        self.tick(0)
        self.save()
        self.tick(20)
        self.save()
        self.tick(60)
        self.save()
        self.tick(120)
        self.assertEqual(len(self.pushes), 3)

    def test_shared_time_continues_for_other_untaken_medicine(self):
        two = dict(self.medicine, id="two")
        self.save(medicines=[self.medicine, two])
        self.tick(0)
        self.save(medicines=[self.medicine, two], logs=[self.taken()])
        self.tick(60)
        self.save(medicines=[self.medicine, two], logs=[self.taken(), self.taken("two")])
        self.tick(120)
        self.assertEqual(len(self.pushes), 2)

    def test_different_time_log_does_not_cancel(self):
        self.tick(0)
        self.save(logs=[self.taken(scheduled="10:00")])
        self.tick(60)
        self.tick(120)
        self.assertEqual(len(self.pushes), 3)

    def test_repeats_cross_midnight_on_final_day(self):
        self.base = datetime(2026, 11, 26, 23, 59, tzinfo=ZONE).timestamp()
        self.medicine["times"] = ["23:59"]
        self.save()
        for t in (0, 60, 120, 180): self.tick(t)
        self.assertEqual(len(self.pushes), 3)

    def test_restart_does_not_burst_missed_minutes(self):
        self.tick(0)
        self.tick(125)
        self.assertEqual([p["reminderNumber"] for _, p in self.pushes], [1, 3])

    def test_disable_removes_schedule_and_jobs(self):
        self.tick(0)
        app.disconnect(AUTH)
        self.tick(60)
        with app.database() as c:
            self.assertEqual(c.execute("SELECT COUNT(*) FROM schedules").fetchone()[0], 0)
            self.assertEqual(c.execute("SELECT COUNT(*) FROM push_jobs").fetchone()[0], 0)
        self.assertEqual(len(self.pushes), 1)

    def test_push_retries_cancel_if_marked_taken(self):
        self.push.stop()
        with patch.object(app, "webpush", side_effect=TimeoutError): self.tick(0)
        self.push.start()
        self.save(logs=[self.taken()])
        self.tick(20)
        self.tick(60)
        self.assertEqual(self.pushes, [])

    def test_legacy_delivery_is_not_repeated(self):
        with app.database() as c:
            c.execute("""INSERT INTO push_jobs
                (token_hash,job_key,kind,payload,due_at,expires_at,next_try,sent)
                VALUES(?,?,'reminder','{}',?,?,?,1)""",
                (OWNER, "reminder:2026-11-26:11:00", self.base, self.base+600, self.base))
        for t in (0, 60, 120): self.tick(t)
        self.assertEqual([p["reminderNumber"] for _, p in self.pushes], [2, 3])


    def test_names_doses_latest_changes_and_taken_filter(self):
        self.medicine.update(name="original", nameEn="Paracetamol", nameMy="ပါရာစီတမော", dose="500 mg")
        other = dict(self.medicine, id="two", nameEn="Ibuprofen", dose="200 mg")
        self.save(medicines=[self.medicine, other])
        self.tick(0)
        body = self.pushes[-1][1]["body"]
        self.assertIn("Paracetamol — 500 mg", body)
        self.assertIn("Ibuprofen — 200 mg", body)
        self.assertIn("11:00", body)
        other["dose"] = "400 mg"
        self.save(medicines=[self.medicine, other], logs=[self.taken()])
        self.tick(60)
        body = self.pushes[-1][1]["body"]
        self.assertNotIn("Paracetamol", body)
        self.assertIn("Ibuprofen — 400 mg", body)

    def test_myanmar_notification_names(self):
        self.medicine.update(name="Paracetamol", nameEn="Paracetamol", nameMy="ပါရာစီတမော", dose="500 mg")
        settings = app.ReminderSettings(language="my", timezone="Asia/Rangoon", medicines=[self.medicine], logs=[])
        app.save_reminders(settings, AUTH)
        self.tick(0)
        self.assertIn("ပါရာစီတမော — 500 mg", self.pushes[0][1]["body"])

    def test_many_long_names_stay_bounded(self):
        medicines = [dict(self.medicine,id=f"m{i}",name="😀"*300,dose="500 mg"*40) for i in range(200)]
        self.save(medicines=medicines)
        self.tick(0)
        payload = self.pushes[0][1]
        self.assertLessEqual(len(payload["body"].encode("utf-16-le"))//2,380)
        self.assertLess(len(json.dumps(payload,ensure_ascii=False).encode()),3000)
        self.assertIn("more",payload["body"])
        self.assertIn("11:00",payload["body"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
