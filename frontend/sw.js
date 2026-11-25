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