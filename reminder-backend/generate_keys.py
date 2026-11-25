import base64
from pathlib import Path

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec


folder = Path(__file__).resolve().parent
destination = folder / ".env"

if destination.exists():
    raise SystemExit(
        ".env already exists. Do not regenerate existing VAPID keys."
    )

private_key = ec.generate_private_key(ec.SECP256R1())

private_der = private_key.private_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
)

public_bytes = private_key.public_key().public_bytes(
    encoding=serialization.Encoding.X962,
    format=serialization.PublicFormat.UncompressedPoint,
)

private_value = base64.b64encode(private_der).decode("ascii")

public_value = (
    base64.urlsafe_b64encode(public_bytes)
    .decode("ascii")
    .rstrip("=")
)

destination.write_text(
    "\n".join([
        f"VAPID_PRIVATE_KEY={private_value}",
        f"VAPID_PUBLIC_KEY={public_value}",
        "VAPID_SUBJECT=mailto:YOUR_EMAIL@gmail.com",
        "FRONTEND_ORIGIN=https://medisafe-web-six.vercel.app",
        "DATABASE_PATH=push.db",
        "",
    ]),
    encoding="utf-8",
)

print("Created:", destination)
print("Replace YOUR_EMAIL@gmail.com with your real email.")
print("Keep .env private. Do not upload it to GitHub.")