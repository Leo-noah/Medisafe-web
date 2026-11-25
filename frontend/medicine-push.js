(() => {
  "use strict";

  const API_BASE =
    "https://obliged-surname-oxford.ngrok-free.dev";

  const TOKEN_KEY = "medisafe-push-device-token-v1";
  const MEDICINES_KEY = "medisafe-personal-medicines-v1";

  const connectButton = document.getElementById("mp-connect");
  const testButton = document.getElementById("mp-test");
  const disconnectButton = document.getElementById("mp-disconnect");
  const status = document.getElementById("mp-status");

  if (
    !connectButton ||
    !testButton ||
    !disconnectButton ||
    !status
  ) {
    return;
  }

  let connected = false;
  let busy = false;
  let deviceToken = "";
  let syncQueue = Promise.resolve();

  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle("is-error", error);
  }

  function render() {
    connectButton.disabled = busy;
    testButton.disabled = busy || !connected;
    disconnectButton.disabled = busy || !connected;
  }

  function errorText(error) {
    return error instanceof Error
      ? error.message
      : String(error);
  }

  function getToken() {
    let token = localStorage.getItem(TOKEN_KEY);

    if (token === null) {
      const bytes = crypto.getRandomValues(
        new Uint8Array(32)
      );

      token = Array.from(
        bytes,
        byte => byte.toString(16).padStart(2, "0")
      ).join("");

      localStorage.setItem(TOKEN_KEY, token);
    }

    if (!/^[a-f0-9]{64}$/.test(token)) {
      throw new Error(
        "သိမ်းထားသော device token ကို ဖတ်မရပါ။"
      );
    }

    return token;
  }

  function publicKeyBytes(value) {
    if (typeof value !== "string" || !value) {
      throw new Error("Server public key မရပါ။");
    }

    const padding = "=".repeat(
      (4 - value.length % 4) % 4
    );

    const decoded = atob(
      (value + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    );

    return Uint8Array.from(
      decoded,
      character => character.charCodeAt(0)
    );
  }

  async function request(path, method = "GET", body) {
    const headers = {
      "ngrok-skip-browser-warning": "1"
    };

    if (deviceToken) {
      headers.Authorization = `Bearer ${deviceToken}`;
    }

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
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
          body:
            body === undefined
              ? undefined
              : JSON.stringify(body),
          signal: controller.signal
        }
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        let detail = `Server error ${response.status}`;

        if (typeof payload?.detail === "string") {
          detail = payload.detail;
        } else if (Array.isArray(payload?.detail)) {
          detail = payload.detail
            .map(item => {
              const location = Array.isArray(item.loc)
                ? item.loc.join(".")
                : "";

              return `${location}: ${item.msg || "Invalid data"}`;
            })
            .join("; ");
        }

        throw new Error(detail);
      }

      if (!payload || typeof payload !== "object") {
        throw new Error(
          "Server မှ JSON response မရပါ။ Backend URL ကို စစ်ပါ။"
        );
      }

      return payload;
    } finally {
      clearTimeout(timeout);
    }
  }

  function buildReminderPayload() {
    const raw = localStorage.getItem(MEDICINES_KEY);

    const saved = raw
      ? JSON.parse(raw)
      : { medicines: [], logs: [] };

    if (
      typeof validStoredData !== "function" ||
      !validStoredData(saved)
    ) {
      throw new Error(
        "သိမ်းထားသော ဆေးစာရင်းကို ဖတ်မရပါ။ Server စာရင်းကို မပြောင်းထားပါ။"
      );
    }

    return {
      language:
        document.documentElement.lang.startsWith("my")
          ? "my"
          : "en",

      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone,

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

  function syncReminders() {
    if (!connected) {
      return Promise.reject(
        new Error("ဖုန်းကို server နှင့် အရင်ချိတ်ပါ။")
      );
    }

    let payload;

    try {
      payload = buildReminderPayload();
    } catch (error) {
      return Promise.reject(error);
    }

    // Preserve the order of schedule changes.
    const operation = syncQueue
      .catch(() => {})
      .then(() => {
        if (!connected) {
          throw new Error(
            "Server ချိတ်ဆက်မှု ဖြုတ်ထားပါသည်။"
          );
        }

        return request("/reminders", "PUT", payload);
      });

    syncQueue = operation;
    return operation;
  }

  async function updateServerReminders() {
    if (!connected) {
      message(
        "ဤ browser တွင် သိမ်းထားပါသည်။ " +
        "အချိန်များကို server ဆီပို့ရန် ဖုန်းကို ချိတ်မည် နှိပ်ပါ။"
      );
      return;
    }

    message(
      "ဆေးသောက်ချိန်များကို server ဆီ ပို့နေပါသည်…"
    );

    try {
      await syncReminders();

      if (connected) {
        message(
          "ဆေးသောက်ချိန်များကို server တွင် သိမ်းပြီးပါပြီ။"
        );
      }
    } catch (error) {
      if (connected) {
        message(
          "Server သို့ မပို့နိုင်ပါ။ မူလ server အချိန်များ " +
          "ကျန်နေနိုင်သည်။ ဖုန်းကို ချိတ်မည် ထပ်နှိပ်ပါ။ " +
          errorText(error),
          true
        );
      }
    }
  }

  // Register these listeners once, outside the click handler.
  window.addEventListener(
    "medisafe:medicines-updated",
    updateServerReminders
  );

  window.addEventListener("storage", event => {
    if (
      event.key === MEDICINES_KEY ||
      event.key === null
    ) {
      updateServerReminders();
    }
  });

  window.addEventListener("online", () => {
    if (connected) {
      updateServerReminders();
    }
  });

  new MutationObserver(() => {
    if (connected) {
      updateServerReminders();
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  connectButton.addEventListener("click", async () => {
    if (busy) return;

    busy = true;
    render();

    try {
      if (
        !window.isSecureContext ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        throw new Error(
          "Android Chrome တွင် HTTPS website ဖြင့် စမ်းပါ။"
        );
      }

      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error(
          "Notification ကို အရင် Allow လုပ်ပါ။"
        );
      }

      message("Server နှင့် ချိတ်ဆက်နေပါသည်…");

      deviceToken = getToken();

      await navigator.serviceWorker.register(
        new URL("./sw.js", document.baseURI)
      );

      const registration =
        await navigator.serviceWorker.ready;

      const config = await request("/config");
      const expectedKey = publicKeyBytes(config.publicKey);

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: expectedKey
          });
      } else {
        const existingKey =
          subscription.options.applicationServerKey;

        if (existingKey) {
          const existingBytes =
            new Uint8Array(existingKey);

          const matches =
            existingBytes.length === expectedKey.length &&
            existingBytes.every(
              (byte, index) => byte === expectedKey[index]
            );

          if (!matches) {
            throw new Error(
              "ဤ browser subscription နှင့် backend VAPID keys " +
              "မကိုက်ညီပါ။ မူလ backend keys ကို ပြန်သုံးပါ။"
            );
          }
        }
      }

      await request(
        "/subscription",
        "POST",
        subscription.toJSON()
      );

      connected = true;

      // Keep the device connected if only schedule sync fails,
      // so disconnect and server test remain available.
      await updateServerReminders();
    } catch (error) {
      connected = false;
      message(errorText(error), true);
    } finally {
      busy = false;
      render();
    }
  });

  testButton.addEventListener("click", async () => {
    if (!connected || busy) return;

    busy = true;
    render();

    try {
      await request("/test", "POST", {
        language:
          document.documentElement.lang.startsWith("my")
            ? "my"
            : "en"
      });

      message(
        "Server က test ကို လက်ခံထားပါပြီ။ " +
        "ဖုန်း Home ကိုနှိပ်ပြီး ၂၀–၃၀ စက္ကန့် စောင့်ပါ။"
      );
    } catch (error) {
      message(errorText(error), true);
    } finally {
      busy = false;
      render();
    }
  });

  disconnectButton.addEventListener("click", async () => {
    if (!connected || busy) return;

    busy = true;
    connected = false;
    render();

    let removedFromServer = false;

    try {
      // Let any in-flight schedule update finish before deleting.
      await syncQueue.catch(() => {});

      await request("/subscription", "DELETE");
      removedFromServer = true;

      const registration =
        await navigator.serviceWorker.getRegistration(
          new URL("./sw.js", document.baseURI).href
        );

      const subscription = registration
        ? await registration.pushManager.getSubscription()
        : null;

      if (subscription) {
        await subscription.unsubscribe();
      }

      message(
        "Server reminder ချိတ်ဆက်မှု ဖြုတ်ပြီးပါပြီ။"
      );
    } catch (error) {
      connected = !removedFromServer;

      message(
        removedFromServer
          ? "Server reminder ကို ဖြုတ်ပြီးပါပြီ။ " +
            "Browser subscription ဖြုတ်ရာတွင် ပြဿနာရှိသည်။ " +
            errorText(error)
          : "Server မှ reminder ကို မဖြုတ်နိုင်သေးပါ။ " +
            "ထပ်စမ်းပါ။ " +
            errorText(error),
        true
      );
    } finally {
      busy = false;
      render();
    }
  });

  render();

  message(
    "ဤ browser ၏ ဆေးသောက်ချိန်များကို server တွင် " +
    "သိမ်းရန် ဖုန်းကို ချိတ်မည် နှိပ်ပါ။ " +
    "ဆေးနာမည်၊ ပမာဏနှင့် ကိုယ်ပိုင်မှတ်စုများ မပို့ပါ။"
  );
})();