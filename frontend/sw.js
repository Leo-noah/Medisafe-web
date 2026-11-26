"use strict";

/*
  A notification click opens My Medicine.

  No caching or scheduled alarms are configured in this file yet.
*/

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const destination = new URL(
    "./my-medicines.html",
    self.registration.scope
  );

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
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

      return self.clients.openWindow(destination.href);
    })()
  );
});
self.addEventListener("push", event => {
  event.waitUntil(
    (async () => {
      let payload = {};

      try {
       const data = event.data?.json();

payload =
  data && typeof data === "object" && !Array.isArray(data)
    ? data
    : {};
      } catch {
        // Display a generic message if the payload cannot be read.
      }

      const title =
        typeof payload.title === "string"
          ? payload.title.slice(0, 120)
          : "MediSafe";

      const body =
        typeof payload.body === "string"
          ? payload.body.slice(0, 400)
          : "You have a new notification.";

      await self.registration.showNotification(title, {
        body,
        lang: payload.language === "my" ? "my" : "en"
      });
    })()
  );
});