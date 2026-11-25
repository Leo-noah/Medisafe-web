(() => {
  "use strict";

  const API_BASE =
  "https://divisions-obviously-february-portions.trycloudflare.com";

  const TOKEN_KEY = "medisafe-push-device-token-v1";

  const connectButton = document.getElementById("mp-connect");
  const testButton = document.getElementById("mp-test");
  const disconnectButton = document.getElementById("mp-disconnect");
  const status = document.getElementById("mp-status");

  if (!connectButton || !testButton || !disconnectButton || !status) {
    return;
  }

  let connected = false;
  let busy = false;
  let deviceToken = "";

  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle("is-error", error);
  }

  function render() {
    connectButton.disabled = busy;
    testButton.disabled = busy || !connected;
    disconnectButton.disabled = busy || !connected;
  }

  function getToken() {
    let token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      const bytes = crypto.getRandomValues(new Uint8Array(32));

      token = Array.from(bytes, byte =>
        byte.toString(16).padStart(2, "0")
      ).join("");

      localStorage.setItem(TOKEN_KEY, token);
    }

    return token;
  }

  function publicKeyBytes(value) {
    const padding = "=".repeat((4 - value.length % 4) % 4);

    const decoded = atob(
      (value + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    );

    return Uint8Array.from(decoded, character =>
      character.charCodeAt(0)
    );
  }

  async function request(path, method = "GET", body) {
    const headers = {};

    if (deviceToken) {
      headers.Authorization = `Bearer ${deviceToken}`;
    }

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
      `${API_BASE.replace(/\/$/, "")}${path}`,
      {
        method,
        headers,
        body: body === undefined
          ? undefined
          : JSON.stringify(body),
        signal: AbortSignal.timeout(60000)
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        typeof payload.detail === "string"
          ? payload.detail
          : `Server error ${response.status}`
      );
    }

    return payload;
  }

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

      if (API_BASE.includes("YOUR-REMINDER-BACKEND")) {
        throw new Error(
          "medicine-push.js ထဲမှာ backend URL အမှန် ဖြည့်ပါ။"
        );
      }

      // Request permission directly from this button click.
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Notification ကို အရင် Allow လုပ်ပါ။");
      }

      message("Server နှင့် ချိတ်ဆက်နေပါသည်…");

      deviceToken = getToken();

      await navigator.serviceWorker.register(
        new URL("./sw.js", document.baseURI)
      );

      const registration = await navigator.serviceWorker.ready;
      const config = await request("/config");

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKeyBytes(config.publicKey)
        });
      } else {
        // Avoid silently replacing a subscription created with other keys.
        const existingKey = subscription.options.applicationServerKey;
        const expectedKey = publicKeyBytes(config.publicKey);

        if (existingKey) {
          const existingBytes = new Uint8Array(existingKey);

          const matches =
            existingBytes.length === expectedKey.length &&
            existingBytes.every(
              (byte, index) => byte === expectedKey[index]
            );

          if (!matches) {
            throw new Error(
              "ဒီ browser subscription က VAPID key အခြားတစ်ခုနှင့် ချိတ်ထားသည်။ မူလ backend keys ကို ပြန်သုံးပါ။"
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

      message(
        "ဖုန်းကို server နှင့် ချိတ်ပြီးပါပြီ။ Server test ကို နှိပ်နိုင်ပါပြီ။"
      );
    } catch (error) {
      connected = false;
      message(error.message, true);
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
        language: document.documentElement.lang.startsWith("my")
          ? "my"
          : "en"
      });

      message(
        "Server က test ကို လက်ခံထားပါပြီ။ Website tab ပိတ်ပြီး 15 စက္ကန့်ခန့် စောင့်ပါ။"
      );
    } catch (error) {
      message(error.message, true);
    } finally {
      busy = false;
      render();
    }
  });

  disconnectButton.addEventListener("click", async () => {
    if (busy) return;

    busy = true;
    render();

    try {
      await request("/subscription", "DELETE");
      connected = false;

      const registration =
        await navigator.serviceWorker.getRegistration();

      const subscription =
        await registration?.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      message("Server push ချိတ်ဆက်မှု ဖြုတ်ပြီးပါပြီ။");
    } catch (error) {
      message(error.message, true);
    } finally {
      busy = false;
      render();
    }
  });

  render();
})();