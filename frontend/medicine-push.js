(() => {
  "use strict";

  const API_BASE =
    "https://obliged-surname-oxford.ngrok-free.dev";

  const TOKEN_KEY = "medisafe-push-device-token-v1";
  const ENABLED_KEY = "medisafe-reminders-enabled-v1";
  const MEDICINES_KEY = "medisafe-personal-medicines-v1";

  const form = document.getElementById("medicine-form");
  const status = document.getElementById("mp-form-status");

  if (!form || !status) return;

  const TEXT = {
    en: {
      saving: "Saving reminder times…",

      saved:
        "Medicine records and reminder times saved.",

      empty:
        "Medicine list updated. No reminders are scheduled.",

      permission:
        "Medicine saved. Choose Allow in the browser notification request to receive reminders.",

      denied:
        "Medicine saved. Notifications are blocked. Allow notifications for this website in Chrome site settings, then save again.",

      failed:
        "Medicine records are saved in this browser, but reminder updates could not be sent. Previous reminder times may still apply. Reconnect and save again.",

      invalid:
        "Saved medicine records could not be read. The reminder schedule was not replaced.",

      unsupported:
        "Medicine saved. This browser cannot receive push reminders. Use the HTTPS website in a supported browser.",

      key:
        "The browser subscription and server notification keys do not match.",

      token:
        "The saved device token is invalid.",

      server:
        "The reminder server did not return a valid response."
    },

    my: {
      saving:
        "သတိပေးချက်အချိန်များ သိမ်းနေပါသည်…",

      saved:
        "ဆေးစာရင်းနှင့် သတိပေးချက်အချိန်များ သိမ်းပြီးပါပြီ။",

      empty:
        "ဆေးစာရင်း ပြင်ပြီးပါပြီ။ သတိပေးရန် အချိန်မရှိတော့ပါ။",

      permission:
        "ဆေးစာရင်း သိမ်းပြီးပါပြီ။ သတိပေးချက်ရရန် browser မေးလာပါက Allow ကို ရွေးပါ။",

      denied:
        "ဆေးစာရင်း သိမ်းပြီးပါပြီ။ အသိပေးချက် ပိတ်ထားပါသည်။ Chrome site settings တွင် ဤ website ကို Allow လုပ်ပြီး ပြန်သိမ်းပါ။",

      failed:
        "ဆေးစာရင်းကို ဤ browser တွင် သိမ်းပြီးပါပြီ။ သတိပေးချက်အချိန်များကို မပို့နိုင်သေးသဖြင့် အချိန်အဟောင်းအတိုင်း ဆက်ပို့နိုင်သည်။ အင်တာနက်ပြန်ရပါက ပြန်သိမ်းပါ။",

      invalid:
        "သိမ်းထားသော ဆေးစာရင်းကို ဖတ်မရပါ။ သတိပေးချက်အချိန်များကို မပြောင်းထားပါ။",

      unsupported:
        "ဆေးစာရင်း သိမ်းပြီးပါပြီ။ ဤ browser တွင် push သတိပေးချက် မရနိုင်ပါ။ ပံ့ပိုးသော browser ဖြင့် HTTPS website ကို သုံးပါ။",

      key:
        "Browser subscription နှင့် server notification keys မကိုက်ညီပါ။",

      token:
        "သိမ်းထားသော device token မမှန်ပါ။",

      server:
        "သတိပေးချက် server မှ မှန်ကန်သော response မရပါ။"
    }
  };

  let connected = false;
  let deviceToken = "";
  let formSubmitting = false;

  let queue = Promise.resolve();

  let statusKey = "";
  let statusError = false;

  function text() {
    return TEXT[
      document.documentElement.lang.startsWith("my")
        ? "my"
        : "en"
    ];
  }

  function renderStatus() {
    status.textContent = statusKey
      ? text()[statusKey]
      : "";

    status.classList.toggle(
      "is-error",
      statusError
    );
  }

  function message(key, error = false) {
    statusKey = key;
    statusError = error;
    renderStatus();
  }

  function supported() {
    return (
      window.isSecureContext &&
      "Notification" in window &&
      "PushManager" in window &&
      "serviceWorker" in navigator
    );
  }

  function buildPayload() {
    const raw = localStorage.getItem(
      MEDICINES_KEY
    );

    const saved = raw
      ? JSON.parse(raw)
      : {
          medicines: [],
          logs: []
        };

    if (
      typeof validStoredData !== "function" ||
      !validStoredData(saved)
    ) {
      throw new Error(text().invalid);
    }

    return {
      language:
        document.documentElement.lang.startsWith("my")
          ? "my"
          : "en",

      timezone:
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone,

      medicines: saved.medicines.map(medicine => ({
        id: medicine.id,
        startDate: medicine.startDate,
        endDate: medicine.endDate || null,
        times: [...new Set(medicine.times)]
      })),

      logs: saved.logs.slice(-4000).map(log => ({
        medicineId: log.medicineId,
        date: log.date,
        time: log.time
      }))
    };
  }

  function getToken() {
    let value = localStorage.getItem(
      TOKEN_KEY
    );

    if (value === null) {
      const bytes = crypto.getRandomValues(
        new Uint8Array(32)
      );

      value = Array.from(
        bytes,
        byte =>
          byte.toString(16).padStart(2, "0")
      ).join("");

      localStorage.setItem(
        TOKEN_KEY,
        value
      );
    }

    if (!/^[a-f0-9]{64}$/.test(value)) {
      throw new Error(text().token);
    }

    return value;
  }

  function publicKeyBytes(value) {
    if (
      typeof value !== "string" ||
      !value
    ) {
      throw new Error(text().server);
    }

    const padded =
      value +
      "=".repeat(
        (4 - value.length % 4) % 4
      );

    const decoded = atob(
      padded
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    );

    return Uint8Array.from(
      decoded,
      character =>
        character.charCodeAt(0)
    );
  }

  async function request(
    path,
    method = "GET",
    body
  ) {
    const headers = {
      "ngrok-skip-browser-warning": "1"
    };

    if (deviceToken) {
      headers.Authorization =
        `Bearer ${deviceToken}`;
    }

    if (body !== undefined) {
      headers["Content-Type"] =
        "application/json";
    }

    const controller =
      new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      60000
    );

    try {
      const response = await fetch(
        `${API_BASE.replace(/\/$/, "")}${path}`,
        {
          method,
          headers,
          signal: controller.signal,

          body:
            body === undefined
              ? undefined
              : JSON.stringify(body)
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const detail = payload?.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : `Server error ${response.status}`
        );
      }

      if (
        !payload ||
        typeof payload !== "object"
      ) {
        throw new Error(text().server);
      }

      return payload;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function ensureConnection() {
    if (connected) return;

    deviceToken = getToken();

    await navigator.serviceWorker.register(
      new URL("./sw.js", document.baseURI)
    );

    const registration =
      await navigator.serviceWorker.ready;

    const config = await request(
      "/config"
    );

    const expectedKey = publicKeyBytes(
      config.publicKey
    );

    let subscription =
      await registration.pushManager
        .getSubscription();

    if (!subscription) {
      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: expectedKey
        });
    } else if (
      subscription.options.applicationServerKey
    ) {
      const existing = new Uint8Array(
        subscription.options.applicationServerKey
      );

      const matches =
        existing.length === expectedKey.length &&
        existing.every(
          (byte, index) =>
            byte === expectedKey[index]
        );

      if (!matches) {
        throw new Error(text().key);
      }
    }

    await request(
      "/subscription",
      "POST",
      subscription.toJSON()
    );

    connected = true;
  }

  function syncReminders(
    permissionRequest = null
  ) {
    const operation = queue
      .catch(() => {})
      .then(async () => {
        try {
          if (permissionRequest) {
            await permissionRequest;
          }

          if (!supported()) {
            message("unsupported", true);
            return;
          }

          if (
            Notification.permission === "denied"
          ) {
            message("denied", true);
            return;
          }

          if (
            Notification.permission !== "granted"
          ) {
            message("permission");
            return;
          }

          const payload = buildPayload();

          message("saving");

          await ensureConnection();

          await request(
            "/reminders",
            "PUT",
            payload
          );

          message(
            payload.medicines.length
              ? "saved"
              : "empty"
          );
        } catch (error) {
          connected = false;

          console.error(
            "Medicine reminder sync failed:",
            error
          );

          message("failed", true);
        }
      });

    queue = operation;
    return operation;
  }

  /*
   * Capture phase runs before the existing synchronous
   * medicine-form submit handler.
   */
  form.addEventListener(
    "submit",
    () => {
      formSubmitting = true;

      queueMicrotask(() => {
        formSubmitting = false;
      });
    },
    true
  );

  /*
   * Existing persist() emits this after a successful save.
   * Save medicine, Save changes, delete, and Mark taken
   * all use the same synchronization path.
   */
  window.addEventListener(
    "medisafe:medicines-updated",
    () => {
      let permissionRequest = null;

      try {
        localStorage.setItem(
          ENABLED_KEY,
          "true"
        );

        /*
         * Request permission directly in the Save gesture.
         * Never request permission during page refresh.
         */
        if (
          formSubmitting &&
          supported() &&
          Notification.permission === "default"
        ) {
          permissionRequest =
            Notification.requestPermission()
              .catch(error => {
                console.error(
                  "Notification permission request failed:",
                  error
                );
              });
        }
      } catch (error) {
        console.error(
          "Reminder setup failed:",
          error
        );

        message("failed", true);
        return;
      }

      syncReminders(permissionRequest);
    }
  );

  function restoreReminders() {
    if (!supported()) return;

    try {
      const payload = buildPayload();

      const wasEnabled =
        localStorage.getItem(
          ENABLED_KEY
        ) === "true";

      if (
        !wasEnabled &&
        payload.medicines.length === 0
      ) {
        return;
      }

      if (
        Notification.permission !== "granted"
      ) {
        return;
      }

      localStorage.setItem(
        ENABLED_KEY,
        "true"
      );

      syncReminders();
    } catch (error) {
      console.error(
        "Reminder restore failed:",
        error
      );

      message("invalid", true);
    }
  }

  window.addEventListener(
    "online",
    restoreReminders
  );

  window.addEventListener(
    "storage",
    event => {
      if (
        event.key === MEDICINES_KEY
      ) {
        restoreReminders();
      }
    }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) {
        restoreReminders();
      }
    }
  );

  new MutationObserver(() => {
    renderStatus();
    restoreReminders();
  }).observe(
    document.documentElement,
    {
      attributes: true,
      attributeFilter: ["lang"]
    }
  );

  restoreReminders();
})();