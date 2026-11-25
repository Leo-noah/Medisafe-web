(() => {
  "use strict";

  const allowButton = document.getElementById("mn-allow");
  const testButton = document.getElementById("mn-test");
  const status = document.getElementById("mn-status");

  if (!allowButton || !testButton || !status) return;

  const TEXT = {
    en: {
      title: "Medicine notifications",
      description:
        "Allow notifications, then send a test to this device. Automatic medicine reminders are not connected yet.",

      allow: "Allow notifications",
      allowed: "Permission allowed",
      test: "Test notification",

      preparing: "Preparing notifications…",
      ready:
        "Notification permission is allowed. Press Test notification.",

      ask:
        "Press Allow notifications to request permission.",

      denied:
        "Notifications are blocked. Open Chrome → Site settings → Notifications and allow this website.",

      unsupported:
        "This browser does not support the required notification features. Try an updated Chrome browser on Android.",

      insecure:
        "Open the HTTPS Vercel website to use notifications.",

      failed:
        "Notifications could not be prepared. Check your connection and the sw.js file.",

      sent:
        "Test notification requested. Check your phone's notification panel.",

      sendFailed:
        "The test could not be displayed. Check Chrome and Android notification settings.",

      testTitle: "MediSafe · Test notification",
      testBody:
        "Notifications are working on this device. Automatic medicine reminders are not connected yet."
    },

    my: {
      title: "ဆေးသောက်ချိန် အသိပေးချက်",
      description:
        "အသိပေးချက်ကို ခွင့်ပြုပြီး ဤဖုန်းတွင် စမ်းသပ်နိုင်ပါသည်။ အလိုအလျောက် ဆေးသောက်ချိန်သတိပေးမှု မချိတ်ရသေးပါ။",

      allow: "အသိပေးချက် ခွင့်ပြုမည်",
      allowed: "ခွင့်ပြုထားပြီး",
      test: "အသိပေးချက် စမ်းမည်",

      preparing: "အသိပေးချက်အတွက် ပြင်ဆင်နေပါသည်…",
      ready:
        "အသိပေးချက် ခွင့်ပြုထားပါသည်။ စမ်းသပ်ခလုတ်ကို နှိပ်ပါ။",

      ask:
        "အသိပေးချက် ခွင့်ပြုရန် ခလုတ်ကို နှိပ်ပါ။",

      denied:
        "အသိပေးချက် ပိတ်ထားပါသည်။ Chrome → Site settings → Notifications တွင် ဤ website ကို ခွင့်ပြုပါ။",

      unsupported:
        "ဤ browser တွင် လိုအပ်သော အသိပေးချက်စနစ် မရနိုင်ပါ။ Android ရှိ နောက်ဆုံးဗားရှင်း Chrome ဖြင့် စမ်းပါ။",

      insecure:
        "အသိပေးချက်သုံးရန် HTTPS ပါသော Vercel website ကို ဖွင့်ပါ။",

      failed:
        "အသိပေးချက်စနစ် ပြင်ဆင်မရပါ။ အင်တာနက်နှင့် sw.js ဖိုင်ကို စစ်ပါ။",

      sent:
        "စမ်းသပ်အသိပေးချက် ပြရန် တောင်းဆိုပြီးပါပြီ။ ဖုန်း၏ notification panel ကို ကြည့်ပါ။",

      sendFailed:
        "စမ်းသပ်အသိပေးချက် ပြမရပါ။ Chrome နှင့် Android notification settings ကို စစ်ပါ။",

      testTitle: "MediSafe · စမ်းသပ်အသိပေးချက်",
      testBody:
        "ဤဖုန်းတွင် အသိပေးချက် အလုပ်လုပ်ပါသည်။ အလိုအလျောက် ဆေးသောက်ချိန်သတိပေးမှု မချိတ်ရသေးပါ။"
    }
  };

  let registration = null;
  let busy = false;
  let messageKey = "";
  let isError = false;

  function language() {
    return document.documentElement.lang.startsWith("my")
      ? "my"
      : "en";
  }

  function supported() {
    return (
      "serviceWorker" in navigator &&
      "Notification" in window &&
      "showNotification" in ServiceWorkerRegistration.prototype
    );
  }

  function showMessage(key, error = false) {
    messageKey = key;
    isError = error;
    render();
  }

  function render() {
    const text = TEXT[language()];

    document.getElementById("mn-title").textContent =
      text.title;

    document.getElementById("mn-description").textContent =
      text.description;

    const permitted =
      supported() && Notification.permission === "granted";

    allowButton.textContent = permitted
      ? text.allowed
      : text.allow;

    testButton.textContent = text.test;

    allowButton.disabled =
      busy ||
      permitted ||
      !supported() ||
      !window.isSecureContext ||
      !registration;

    testButton.disabled =
      busy || !permitted || !registration;

    status.textContent = text[messageKey] || "";
    status.classList.toggle("is-error", isError);
  }

  function refreshPermission() {
    if (!supported() || !registration) return;

    if (Notification.permission === "granted") {
      showMessage("ready");
    } else if (Notification.permission === "denied") {
      showMessage("denied", true);
    } else {
      showMessage("ask");
    }
  }

  async function initialise() {
    if (!window.isSecureContext) {
      showMessage("insecure", true);
      return;
    }

    if (!supported()) {
      showMessage("unsupported", true);
      return;
    }

    busy = true;
    showMessage("preparing");

    try {
      const workerURL = new URL("./sw.js", document.baseURI);

      const worker = await navigator.serviceWorker.register(
        workerURL.href
      );

      // Wait for the registered worker to become active.
      if (!worker.active) {
        const installing = worker.installing || worker.waiting;

        if (!installing) {
          throw new Error("No active service worker");
        }

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Service worker activation timed out"));
          }, 20000);

          function cleanup() {
            clearTimeout(timeout);
            installing.removeEventListener("statechange", check);
          }

          function check() {
            if (installing.state === "activated") {
              cleanup();
              resolve();
            } else if (installing.state === "redundant") {
              cleanup();
              reject(new Error("Service worker installation failed"));
            }
          }

          installing.addEventListener("statechange", check);
          check();
        });
      }

      registration = worker;
      refreshPermission();
    } catch (error) {
      console.error("Notification setup failed:", error);
      showMessage("failed", true);
    } finally {
      busy = false;
      render();
    }
  }

  allowButton.addEventListener("click", async () => {
    if (!registration || busy) return;

    busy = true;
    render();

    try {
      // Permission must be requested after a user action.
      await Notification.requestPermission();
      refreshPermission();
    } catch (error) {
      console.error("Notification permission failed:", error);
      showMessage("failed", true);
    } finally {
      busy = false;
      render();
    }
  });

  testButton.addEventListener("click", async () => {
    if (
      busy ||
      !registration ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    busy = true;
    render();

    const text = TEXT[language()];

    try {
      await registration.showNotification(text.testTitle, {
        body: text.testBody,
        tag: "medisafe-notification-test",
        renotify: true,
        lang: language(),
        dir: "ltr"
      });

      showMessage("sent");
    } catch (error) {
      console.error("Test notification failed:", error);
      showMessage("sendFailed", true);
    } finally {
      busy = false;
      render();
    }
  });

  new MutationObserver(render).observe(
    document.documentElement,
    {
      attributes: true,
      attributeFilter: ["lang"]
    }
  );

  window.addEventListener("focus", refreshPermission);

  initialise();
})();