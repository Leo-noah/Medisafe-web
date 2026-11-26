"use strict";

self.addEventListener("install", event => {
  event.waitUntil(
    self.skipWaiting()
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("push", event => {
  event.waitUntil(
    (async () => {
      let payload = {};

      try {
        const data = event.data?.json();

        if (
          data &&
          typeof data === "object" &&
          !Array.isArray(data)
        ) {
          payload = data;
        }
      } catch {
        // Show a generic notification if payload parsing fails.
      }

      const title =
        typeof payload.title === "string"
          ? payload.title.slice(0, 120)
          : "MediSafe";

      const body =
        typeof payload.body === "string"
          ? payload.body.slice(0, 400)
          : "Open My Medicine to review your schedule.";

      // Each push creates a fresh notification.
      await self.registration.showNotification(
        title,
        {
          body,
          lang:
            payload.language === "my"
              ? "my"
              : "en"
        }
      );
    })()
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const destination = new URL(
        "./my-medicines.html",
        self.registration.scope
      );

      const windows =
        await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true
        });

      const existing = windows.find(client => {
        const url = new URL(client.url);

        return (
          url.origin === destination.origin &&
          url.pathname === destination.pathname
        );
      });

      if (existing) {
        return existing.focus();
      }

      return self.clients.openWindow(
        destination.href
      );
    })()
  );
});