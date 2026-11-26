# MediSafe

Bilingual medicine information and personal medicine schedules in English and Myanmar.

- Google sign-in with Firebase Authentication; profile menu and logout confirmation.
- Medicine records stored in this browser, grouped by scheduled time with individual and group taken controls.
- Server push reminders at the scheduled time, one minute later and two minutes later, up to three rounds. Synced taken records stop the remaining reminders for that dose.
- Notifications include the remaining medicine names and recorded amounts. Long groups show a short preview and a remaining count. Personal notes are not sent to the reminder server.

## Run

Serve `frontend/` with a static web server, or deploy it to Vercel with `frontend` as the root directory, no build command, and `.` as the output directory. Firebase authorized domains must include the domain being used. Login sessions on localhost and the deployed domain are separate.

In `reminder-backend/`, create a Python virtual environment and install `requirements.txt`. Copy `.env.example` to `.env`, configure matching VAPID keys and `FRONTEND_ORIGIN`, then run:

```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --workers 1
```

Expose that backend over HTTPS and set `API_BASE` in `frontend/medicine-push.js` to its public URL. Configure `FRONTEND_ORIGIN` to the exact frontend origin. Keep the backend, tunnel and internet running for scheduled pushes.

The Firebase web configuration in the frontend is public client configuration. Never commit private VAPID keys, `.env`, or the local database.

## Current limits

Google sign-in does not yet provide account-specific medicine storage or cross-device record synchronization. Medicine records remain browser-local; another account using that browser can still see them. Logging out does not delete records or disable saved reminder subscriptions. The reminder server stores device subscriptions, names, recorded amounts, schedules and taken status.

Push acceptance does not guarantee immediate display. Browser, operating system and connectivity settings affect delivery. A backend running on a laptop stops scheduling new notifications when that laptop is shut down.

Medicine catalogue information and audio are drafts, not professionally reviewed clinical guidance. Recorded amounts come from the user's existing instructions; the app does not prescribe doses.

## Checks

With Node installed and the backend requirements available, run from the repository root:

```powershell
node tests/test_login.cjs
node tests/test_header_account.cjs
node tests/test_grouped_list.cjs
node tests/test_reminder_frontend.cjs
python -m unittest discover -s tests -p test_reminders.py
```

Auth and push delivery are mocked in these tests. Backend tests use synthetic keys and a temporary database, not the live subscriptions or schedules.
