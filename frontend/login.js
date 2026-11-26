(() => {
  "use strict";

  // Replace these values with your Firebase WEB APP configuration.
  // Never put a service-account private key in frontend code.
  const firebaseConfig = {
    apiKey: "AIzaSyClfq1ihThvpzGFquNB91-23W-nLPoxe3M",
    authDomain: "medisafe-58366.firebaseapp.com",
    projectId: "medisafe-58366",
    storageBucket: "medisafe-58366.firebasestorage.app",
    messagingSenderId: "1073227216867",
    appId: "1:1073227216867:web:413861d81a3bc26a00d2d6"
  };

  const SDK_VERSION = "13.4.0";

  const entry = document.getElementById("entry-screen");
  const account = document.getElementById("account-screen");

  const googleButton =
    document.getElementById("google-button");

  const googleLabel =
    document.getElementById("google-label");

  const signoutButton =
    document.getElementById("signout-button");

  const retryButton =
    document.getElementById("retry-button");

  const status = document.getElementById("status");

  const TEXT = {
    en: {
      pageTitle: "Sign in | MediSafe",
      eyebrow: "YOUR MEDICINE COMPANION",

      introTitle:
        "Understand your medicines. Make everyday care easier.",

      introDescription:
        "Medicine information, Burmese audio and your daily medicine routine in one place.",

      feature:
        "Available in English and Myanmar.",

      footer:
        "Made for everyday care.",

      welcomeLabel:
        "WELCOME TO MEDISAFE",

      welcome:
        "An easier way to sign in",

      entryDescription:
        "Choose your Google account to continue. No new MediSafe password to remember.",

      google:
        "Continue with Google",

      loading:
        "Preparing sign-in…",

      signingIn:
        "Opening Google…",

      remember:
        "Sign-in is remembered in this browser. Sign out after using a shared computer.",

      or:
        "or",

      continueGuest:
        "Browse medicines without signing in",

      signedInLabel:
        "YOU ARE SIGNED IN",

      accountTitle:
        "Welcome back",

      defaultName:
        "MediSafe user",

      continueMedicine:
        "Open My Medicine",

      signOut:
        "Sign out",

      retry:
        "Try again",

      signoutNote:
        "Signing out does not delete this browser's medicine records or stop existing reminders.",

      storageNote:
        "Medicine records are currently stored in this browser. Google sign-in alone does not sync them between devices yet.",

      signedOut:
        "You have signed out.",

      setup:
        "Google sign-in has not been configured yet. You can still browse medicines.",

      unavailable:
        "Sign-in could not load. Check your internet connection and try again.",

      closed:
        "Sign-in was cancelled. You can try again when ready.",

      popup:
        "Google could not open. Allow pop-ups for this website and try again. On a phone, open the link directly in Chrome.",

      domain:
        "This website address has not been enabled for sign-in. Please contact the site owner.",

      disabled:
        "Google sign-in is not enabled yet. Please contact the site owner.",

      network:
        "Connection lost. Check your internet and try again.",

      blocked:
        "This account cannot sign in. Contact the site owner.",

      storage:
        "This browser could not remember sign-in. Use a normal Chrome window with browser storage enabled.",

      failed:
        "Sign-in did not complete. Please try again.",

      signoutFailed:
        "Could not sign out. Check your connection and try again."
    },

    my: {
      pageTitle:
        "အကောင့်ဝင်ရန် | MediSafe",

      eyebrow:
        "နေ့စဉ် ဆေးဝါးစောင့်ရှောက်မှုအတွက်",

      introTitle:
        "ဆေးအကြောင်း သိရှိပြီး နေ့စဉ်ကို ပိုလွယ်ကူစေပါ။",

      introDescription:
        "ဆေးအချက်အလက်၊ မြန်မာအသံနှင့် သင့်ဆေးသောက်အစီအစဉ်ကို တစ်နေရာတည်းတွင် ကြည့်ပါ။",

      feature:
        "အင်္ဂလိပ်နှင့် မြန်မာ နှစ်ဘာသာဖြင့် သုံးနိုင်ပါသည်။",

      footer:
        "နေ့စဉ် စောင့်ရှောက်မှုအတွက်။",

      welcomeLabel:
        "MEDISAFE မှ ကြိုဆိုပါသည်",

      welcome:
        "အလွယ်တကူ အကောင့်ဝင်ပါ",

      entryDescription:
        "သင့် Google အကောင့်ကို ရွေးပြီး ဆက်သုံးပါ။ MediSafe အတွက် စကားဝှက်အသစ် မှတ်စရာမလိုပါ။",

      google:
        "Google ဖြင့် ဆက်မည်",

      loading:
        "ပြင်ဆင်နေပါသည်…",

      signingIn:
        "Google ကို ဖွင့်နေပါသည်…",

      remember:
        "ဤ browser တွင် အကောင့်ဝင်ထားမှုကို မှတ်ထားပေးမည်။ အများသုံးစက်တွင် သုံးပြီးပါက အကောင့်ထွက်ပါ။",

      or:
        "သို့မဟုတ်",

      continueGuest:
        "အကောင့်မဝင်ဘဲ ဆေးရှာမည်",

      signedInLabel:
        "အကောင့်ဝင်ထားပြီးပါပြီ",

      accountTitle:
        "ကြိုဆိုပါသည်",

      defaultName:
        "MediSafe အသုံးပြုသူ",

      continueMedicine:
        "ကျွန်ုပ်၏ ဆေးစာရင်းသို့",

      signOut:
        "အကောင့်ထွက်မည်",

      retry:
        "ထပ်စမ်းမည်",

      signoutNote:
        "အကောင့်ထွက်ခြင်းက ဤ browser ၏ ဆေးမှတ်တမ်းနှင့် ရှိပြီးသား သတိပေးချက်များကို မဖျက်ပါ။",

      storageNote:
        "လက်ရှိ ဆေးမှတ်တမ်းများကို ဤ browser တွင်သာ သိမ်းထားသည်။ Google အကောင့်ဝင်ခြင်းတစ်ခုတည်းဖြင့် စက်များကြား မကူးပေးသေးပါ။",

      signedOut:
        "အကောင့်ထွက်ပြီးပါပြီ။",

      setup:
        "Google အကောင့်ဝင်စနစ်ကို မပြင်ဆင်ရသေးပါ။ အကောင့်မဝင်ဘဲ ဆေးရှာနိုင်ပါသည်။",

      unavailable:
        "အကောင့်ဝင်စနစ် ဖွင့်မရပါ။ အင်တာနက်စစ်ပြီး ထပ်စမ်းပါ။",

      closed:
        "အကောင့်ဝင်ခြင်းကို ရပ်ထားပါသည်။ အဆင်သင့်ဖြစ်ပါက ပြန်နှိပ်နိုင်ပါသည်။",

      popup:
        "Google window ဖွင့်မရပါ။ ဤ website အတွက် pop-up ခွင့်ပြုပြီး ပြန်စမ်းပါ။ ဖုန်းတွင် Chrome မှ တိုက်ရိုက်ဖွင့်ပါ။",

      domain:
        "ဤ website လိပ်စာကို အကောင့်ဝင်ရန် ခွင့်မပြုရသေးပါ။ Website တာဝန်ရှိသူကို ဆက်သွယ်ပါ။",

      disabled:
        "Google အကောင့်ဝင်စနစ် မဖွင့်ရသေးပါ။ Website တာဝန်ရှိသူကို ဆက်သွယ်ပါ။",

      network:
        "ချိတ်ဆက်မှု ပြတ်သွားပါသည်။ အင်တာနက်စစ်ပြီး ပြန်စမ်းပါ။",

      blocked:
        "ဤအကောင့်ဖြင့် ဝင်မရပါ။ Website တာဝန်ရှိသူကို ဆက်သွယ်ပါ။",

      storage:
        "ဤ browser တွင် အကောင့်ဝင်ထားမှုကို မှတ်မထားနိုင်ပါ။ Browser storage ဖွင့်ထားသော ပုံမှန် Chrome window ဖြင့် သုံးပါ။",

      failed:
        "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။ ပြန်စမ်းပါ။",

      signoutFailed:
        "အကောင့်ထွက်မရပါ။ အင်တာနက်စစ်ပြီး ပြန်စမ်းပါ။"
    }
  };

  let language = "my";

  try {
    const saved =
      localStorage.getItem("medisafe-language");

    if (saved === "en" || saved === "my") {
      language = saved;
    }
  } catch {
    // Language switching can work without storage.
  }

  let sdk = null;
  let auth = null;
  let provider = null;
  let user = null;

  let ready = false;
  let busy = false;
  let initializing = false;

  let statusKey = "";
  let statusError = false;
  let canRetry = false;

  let unsubscribe = null;

  function render() {
    const t = TEXT[language];

    document.documentElement.lang = language;
    document.title = t.pageTitle;

    document
      .querySelectorAll("[data-i18n]")
      .forEach(element => {
        const value =
          t[element.dataset.i18n];

        if (value !== undefined) {
          element.textContent = value;
        }
      });

    document
      .querySelectorAll("[data-language]")
      .forEach(button => {
        button.setAttribute(
          "aria-pressed",
          String(
            button.dataset.language === language
          )
        );
      });

    entry.hidden = Boolean(user);
    account.hidden = !user;

    googleButton.disabled =
      !ready || busy;

    googleLabel.textContent = busy
      ? t.signingIn
      : initializing
        ? t.loading
        : t.google;

    signoutButton.disabled =
      busy || !ready;

    retryButton.hidden = !canRetry;

    status.textContent = statusKey
      ? t[statusKey]
      : "";

    status.className =
      `status-message ${
        statusError ? "error" : "info"
      }`;

    if (user) {
      const name =
        user.displayName || t.defaultName;

      document.getElementById(
        "account-name"
      ).textContent = name;

      document.getElementById(
        "account-email"
      ).textContent = user.email || "";

      document.getElementById(
        "account-avatar"
      ).textContent =
        Array.from(name.trim())[0] || "M";
    }

    if (auth) {
      auth.languageCode = language;
    }
  }

  function message(
    key = "",
    error = false
  ) {
    statusKey = key;
    statusError = error;
    render();
  }

  function errorKey(error) {
    switch (error?.code) {
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "closed";

      case "auth/popup-blocked":
      case "auth/operation-not-supported-in-this-environment":
        return "popup";

      case "auth/unauthorized-domain":
        return "domain";

      case "auth/operation-not-allowed":
        return "disabled";

      case "auth/network-request-failed":
        return "network";

      case "auth/user-disabled":
        return "blocked";

      case "auth/web-storage-unsupported":
        return "storage";

      case "auth/invalid-api-key":
      case "auth/configuration-not-found":
        return "setup";

      default:
        return "failed";
    }
  }

  async function loadSDK() {
    const base =
      `https://www.gstatic.com/firebasejs/${SDK_VERSION}`;

    const [
      appSDK,
      authSDK
    ] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`)
    ]);

    return {
      ...appSDK,
      ...authSDK
    };
  }

  async function initialize() {
    if (initializing) return;

    const missingConfig =
      Object.values(firebaseConfig).some(
        value =>
          !value ||
          value.includes("YOUR_")
      );

    if (missingConfig) {
      canRetry = false;
      message("setup", true);
      return;
    }

    initializing = true;
    ready = false;
    canRetry = false;

    message();

    let timeout;

    try {
      sdk = await Promise.race([
        loadSDK(),

        new Promise((_, reject) => {
          timeout = setTimeout(
            () => reject(
              new Error("SDK loading timed out")
            ),
            25000
          );
        })
      ]);

      clearTimeout(timeout);

      const app =
        sdk.getApps().length
          ? sdk.getApp()
          : sdk.initializeApp(
              firebaseConfig
            );

      auth = sdk.getAuth(app);

      auth.languageCode = language;

      await sdk.setPersistence(
        auth,
        sdk.browserLocalPersistence
      );

      provider =
        new sdk.GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account"
      });

      if (unsubscribe) {
        unsubscribe();
      }

      unsubscribe =
        sdk.onAuthStateChanged(
          auth,

          currentUser => {
            user = currentUser;
            ready = true;
            render();
          },

          error => {
            console.error(
              "Auth state error:",
              error.code
            );

            ready = false;
            canRetry = true;

            message(
              errorKey(error),
              true
            );
          }
        );
    } catch (error) {
      console.error(
        "Google sign-in setup failed:",
        error.code || "SDK load failed"
      );

      canRetry = true;

      const key = errorKey(error);

      message(
        key === "failed"
          ? "unavailable"
          : key,
        true
      );
    } finally {
      clearTimeout(timeout);

      initializing = false;
      render();
    }
  }

  googleButton.addEventListener(
    "click",
    async () => {
      if (!ready || busy) return;

      busy = true;
      canRetry = false;
      message();

      try {
        // Google handles credentials in its own window.
        await sdk.signInWithPopup(
          auth,
          provider
        );

        window.location.assign(
          "./my-medicines.html"
        );
      } catch (error) {
        console.error(
          "Google sign-in failed:",
          error.code
        );

        const key = errorKey(error);

        message(
          key,
          key !== "closed"
        );
      } finally {
        busy = false;
        render();
      }
    }
  );

  signoutButton.addEventListener(
    "click",
    async () => {
      if (!ready || busy) return;

      busy = true;
      message();

      try {
        await sdk.signOut(auth);

        user = null;
        message("signedOut");
      } catch (error) {
        console.error(
          "Sign-out failed:",
          error.code
        );

        message(
          "signoutFailed",
          true
        );
      } finally {
        busy = false;
        render();
      }
    }
  );

  retryButton.addEventListener(
    "click",
    initialize
  );

  document
    .querySelectorAll("[data-language]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          language =
            button.dataset.language === "en"
              ? "en"
              : "my";

          try {
            localStorage.setItem(
              "medisafe-language",
              language
            );
          } catch {
            // The language can still change.
          }

          render();
        }
      );
    });

  render();
  initialize();
})();
