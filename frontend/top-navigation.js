(() => {
  "use strict";

  if (window.medisafeNavigationStarted) return;
  window.medisafeNavigationStarted = true;

  const CACHE_KEY = "medisafe-header-profile-v1";

  const firebaseConfig = {
    apiKey: "AIzaSyClfq1ihThvpzGFquNB91-23W-nLPoxe3M",
    authDomain: "medisafe-58366.firebaseapp.com",
    projectId: "medisafe-58366",
    appId: "1:1073227216867:web:413861d81a3bc26a00d2d6"
  };

  const labels = {
    "find-medicine.html": {
      en: "Find Medicine",
      my: "ဆေးရှာရန်"
    },
    "my-medicines.html": {
      en: "My Medicine",
      my: "ကိုယ်ပိုင်ဆေးစာရင်း"
    },
    "news.html": {
      en: "News",
      my: "သတင်းများ"
    },
    "online-shop.html": {
      en: "Online Shop",
      my: "အွန်လိုင်းဆေးဆိုင်များ"
    },
    "login.html": {
      en: "Sign in",
      my: "အကောင့်ဝင်ရန်"
    }
  };

  let currentProfile = readCache();
  let confirmed = false;
  let signingOut = false;
  let headerStarted = false;
  let accountUI = null;
  let firebasePromise = null;
  let headerObserver = null;

  function readCache() {
    try {
      const profile = JSON.parse(
        sessionStorage.getItem(CACHE_KEY) || "null"
      );

      if (
        profile &&
        typeof profile.displayName === "string" &&
        typeof profile.email === "string" &&
        typeof profile.photoURL === "string"
      ) {
        return profile;
      }
    } catch {
      // Continue without the display cache.
    }

    return null;
  }

  function writeCache(profile) {
    try {
      if (!profile) {
        sessionStorage.removeItem(CACHE_KEY);
        return;
      }

      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          displayName: profile.displayName || "",
          email: profile.email || "",
          photoURL: profile.photoURL || ""
        })
      );
    } catch {
      // Firebase authentication does not depend on this cache.
    }
  }

  function language() {
    return document.documentElement.lang.startsWith("my")
      ? "my"
      : "en";
  }

  function filename(href) {
    try {
      return new URL(href, document.baseURI)
        .pathname.split("/")
        .pop()
        .toLowerCase();
    } catch {
      return "";
    }
  }

  function profileFromUser(user) {
    if (!user) return null;

    return {
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || ""
    };
  }

  function withTimeout(operation, milliseconds = 15000) {
    let timer;

    return Promise.race([
      operation,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error("Account request timed out."));
        }, milliseconds);
      })
    ]).finally(() => {
      clearTimeout(timer);
    });
  }

  function getFirebase() {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import(
          "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js"
        ),
        import(
          "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js"
        )
      ])
        .then(([appSDK, authSDK]) => {
          const app = appSDK.getApps().some(
            existing => existing.name === "[DEFAULT]"
          )
            ? appSDK.getApp()
            : appSDK.initializeApp(firebaseConfig);

          return {
            auth: authSDK.getAuth(app),
            authSDK
          };
        })
        .catch(error => {
          firebasePromise = null;
          throw error;
        });
    }

    return firebasePromise;
  }

  function updateNavigation(selectedLanguage = language()) {
    const selected = selectedLanguage === "my" ? "my" : "en";
    const currentFile = filename(window.location.href);

    document.querySelectorAll(".top-nav-link").forEach(link => {
      const active = filename(link.href) === currentFile;

      link.classList.toggle("is-active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document
      .querySelectorAll(".site-header a[href]")
      .forEach(link => {
        if (link.classList.contains("brand")) return;

        const translation = labels[filename(link.href)];
        if (!translation) return;

        let text = link.querySelector("[data-nav-label]");

        if (!text) {
          text = Array.from(link.querySelectorAll("span")).find(
            span =>
              !span.closest("svg") &&
              !span.closest('[aria-hidden="true"]') &&
              !span.querySelector("svg") &&
              span.textContent.trim()
          );

          if (!text) {
            Array.from(link.childNodes).forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = "";
              }
            });

            text = document.createElement("span");
            link.append(text);
          }

          text.setAttribute("data-nav-label", "");
        }

        text.textContent = translation[selected];
        link.setAttribute("aria-label", translation[selected]);
      });

    accountUI?.translate(selected);
  }

  function createAccountHeader(signIn) {
    const wrapper = document.createElement("div");
    wrapper.className = "header-account-wrap";
    wrapper.hidden = true;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "header-account";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "header-account-panel");

    const avatar = document.createElement("span");
    avatar.className = "header-account-avatar";
    avatar.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "header-account-name";

    const arrow = document.createElement("span");
    arrow.textContent = "▾";
    arrow.setAttribute("aria-hidden", "true");

    button.append(avatar, name, arrow);

    const panel = document.createElement("div");
    panel.id = "header-account-panel";
    panel.className = "header-account-panel";
    panel.hidden = true;

    const detail = document.createElement("strong");
    detail.className = "header-account-detail";

    const email = document.createElement("span");
    email.className = "header-account-email";

    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "header-account-logout";

    const status = document.createElement("p");
    status.className = "header-account-status";
    status.setAttribute("role", "status");
    status.hidden = true;

    panel.append(detail, email, logout, status);
    wrapper.append(button, panel);
    signIn.after(wrapper);

    let displayedPhoto = null;
    let accountError = false;

    function close(focusButton = false) {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");

      if (focusButton) button.focus();
    }

    function translate(selected = language()) {
      const my = selected === "my";

      logout.textContent = signingOut
        ? (my ? "ထွက်နေပါသည်…" : "Signing out…")
        : (my ? "အကောင့်ထွက်မည်" : "Log out");

      if (currentProfile) {
        const displayName =
          currentProfile.displayName ||
          currentProfile.email ||
          (my ? "ကျွန်ုပ်၏အကောင့်" : "My account");

        name.textContent = displayName;
        detail.textContent = displayName;
        button.title = displayName;

        button.setAttribute(
          "aria-label",
          `${my ? "အကောင့်" : "Account"}: ${displayName}`
        );
      } else if (accountError) {
        name.textContent = my ? "အကောင့်" : "Account";
        button.setAttribute("aria-label", name.textContent);
      }
    }

    function render(profile) {
      currentProfile = profile;
      accountError = false;
      status.hidden = true;
      logout.hidden = false;
      logout.disabled = signingOut;

      if (!profile) {
        close();
        wrapper.hidden = true;

        signIn.style.display = "";
        signIn.classList.toggle("auth-guest-ready", confirmed);
        signIn.style.visibility = confirmed ? "visible" : "hidden";

        translate();
        return;
      }

      signIn.style.display = "none";
      wrapper.hidden = false;

      email.textContent = profile.email || "";
      email.hidden = !profile.email;

      const displayName =
        profile.displayName || profile.email || "M";

      const photoKey =
        `${profile.photoURL || ""}|${displayName}`;

      // Do not reload the same image when Firebase confirms the cache.
      if (displayedPhoto !== photoKey) {
        displayedPhoto = photoKey;

        const initial = document.createElement("span");
        initial.textContent =
          Array.from(displayName.trim())[0]?.toUpperCase() || "M";

        avatar.replaceChildren(initial);

        if (profile.photoURL) {
          try {
            const url = new URL(profile.photoURL);

            if (url.protocol === "https:") {
              const image = document.createElement("img");
              image.alt = "";
              image.width = 36;
              image.height = 36;
              image.referrerPolicy = "no-referrer";
              image.hidden = true;

              image.addEventListener("load", () => {
                image.hidden = false;
                initial.hidden = true;
              });

              image.addEventListener("error", () => {
                image.remove();
                initial.hidden = false;
              });

              image.src = url.href;
              avatar.append(image);

              if (image.complete && image.naturalWidth > 0) {
                image.hidden = false;
                initial.hidden = true;
              }
            }
          } catch {
            // Keep the initial if the picture cannot load.
          }
        }
      }

      translate();
    }

    function showError(error) {
      accountError = true;
      logout.disabled = signingOut;

      if (!currentProfile) {
        signIn.style.display = "none";
        wrapper.hidden = false;

        avatar.textContent = "!";
        detail.textContent = "";
        email.hidden = true;
      }

      translate();

      status.textContent = language() === "my"
        ? "အကောင့်အခြေအနေ စစ်မရပါ။ အင်တာနက်စစ်ပြီး refresh လုပ်ပါ။"
        : "Could not verify your session. Check your connection and refresh.";

      status.hidden = false;

      console.error(
        "Account check failed:",
        error.code || error.message
      );
    }

    button.addEventListener("click", () => {
      const opening = panel.hidden;

      panel.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
    });

    document.addEventListener("click", event => {
      if (!wrapper.contains(event.target)) close();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden) {
        close(true);
      }
    });

    function askLogoutConfirmation(message) {
  return new Promise(resolve => {
    const my = language() === "my";

    const dialog = document.createElement("dialog");

    dialog.style.cssText = `
      width: min(440px, calc(100vw - 32px));
      box-sizing: border-box;
      padding: 24px;
      border: 1px solid #cfe4d9;
      border-radius: 18px;
      background: white;
      color: #20372f;
      box-shadow: 0 20px 70px #0004;
      font-family: inherit;
    `;

    const title = document.createElement("h2");
    title.id = "medisafe-logout-title";
    title.textContent = my
      ? "အကောင့်ထွက်မည်လား။"
      : "Log out of MediSafe?";

    title.style.cssText = `
      margin: 0 0 16px;
      font-size: 22px;
      line-height: 1.7;
    `;

    dialog.setAttribute(
      "aria-labelledby",
      "medisafe-logout-title"
    );

    const description = document.createElement("p");
    description.textContent = message;
    description.style.cssText = `
      margin: 0;
      white-space: pre-line;
      line-height: 1.9;
      font-size: 14px;
    `;

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    `;

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = my ? "မထွက်တော့ပါ" : "Stay signed in";

    const approve = document.createElement("button");
    approve.type = "button";
    approve.textContent = my ? "အကောင့်ထွက်မည်" : "Log out";

    const buttonStyle = `
      min-height: 48px;
      padding: 10px 18px;
      border-radius: 10px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    `;

    cancel.style.cssText = buttonStyle + `
      border: 1px solid #cfe4d9;
      background: #f0f7f3;
      color: #104b3c;
    `;

    approve.style.cssText = buttonStyle + `
      border: 1px solid #a32e2e;
      background: #a32e2e;
      color: white;
    `;

    let finished = false;

    function finish(accepted) {
      if (finished) return;
      finished = true;

      if (dialog.open) dialog.close();
      dialog.remove();

      resolve(accepted);
    }

    cancel.addEventListener("click", () => finish(false));
    approve.addEventListener("click", () => finish(true));

    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      finish(false);
    });

    dialog.addEventListener("close", () => finish(false));

    actions.append(cancel, approve);
    dialog.append(title, description, actions);
    document.body.append(dialog);

    dialog.showModal();
    cancel.focus();
  });
}

    logout.addEventListener("click", async () => {
      if (signingOut) return;

      close();

const accepted = await askLogoutConfirmation(
  language() === "my"
    ? [
        "ဆေးစာရင်းကို မဖျက်ပါ။ ဒီ browser ထဲမှာ ဆက်ရှိနေပါမည်။",
        "",
        "ဆေးစာရင်းကို အကောင့်အလိုက် မခွဲထားသေးသဖြင့် ဒီ browser ကို သုံးသူက မြင်နိုင်၊ ပြင်နိုင်ပါသည်။",
        "",
        "အကောင့်ထွက်ခြင်းက server တွင် သိမ်းထားသော reminder များကို မပိတ်ပါ။"
      ].join("\n")
    : [
        "Your medicine list will remain in this browser.",
        "",
        "Records are not separated by account yet. Other people using this browser can view or change them.",
        "",
        "Logging out does not stop reminders saved on the server."
      ].join("\n")
);

if (!accepted) {
  button.focus();
  return;
}

      signingOut = true;
      logout.disabled = true;
      translate();

      status.hidden = false;
      status.textContent = language() === "my"
        ? "အကောင့်ထွက်နေပါသည်…"
        : "Signing out…";

      try {
        const { auth, authSDK } = await withTimeout(
          getFirebase()
        );

        await withTimeout(auth.authStateReady());
        await withTimeout(authSDK.signOut(auth));

        confirmed = true;
        writeCache(null);
        render(null);
        signIn.focus();
      } catch (error) {
        status.hidden = false;
        status.textContent = language() === "my"
          ? "အကောင့်ထွက်မရသေးပါ။ အင်တာနက်စစ်ပြီး ထပ်နှိပ်ပါ။"
          : "Could not sign out. Check your connection and try again.";

        console.error("Sign out failed:", error);
      } finally {
        signingOut = false;
        logout.disabled = false;
        translate();
      }
    });

    return { render, translate, showError };
  }

  async function initializeFirebase() {
    try {
      const { auth, authSDK } = await getFirebase();

      authSDK.onAuthStateChanged(
        auth,
        firebaseUser => {
          confirmed = true;

          const profile = profileFromUser(firebaseUser);

          writeCache(profile);
          accountUI.render(profile);
        },
        error => accountUI.showError(error)
      );
    } catch (error) {
      accountUI.showError(error);
    }
  }

  function startHeaderIfReady() {
    if (headerStarted) return;

    const signIn = document.querySelector(
      ".site-header .header-signin"
    );

    if (!signIn) return;

    headerStarted = true;
    headerObserver?.disconnect();

    accountUI = createAccountHeader(signIn);

    // This cache is for display only, never for authentication.
    accountUI.render(currentProfile);

    initializeFirebase();
  }

  startHeaderIfReady();

  if (!headerStarted) {
    headerObserver = new MutationObserver(
      startHeaderIfReady
    );

    headerObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function finishPageSetup() {
    startHeaderIfReady();
    headerObserver?.disconnect();

    let selected = language();

    try {
      selected =
        localStorage.getItem("medisafe-language") || selected;
    } catch {
      // Use the page language.
    }

    updateNavigation(selected);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      finishPageSetup,
      { once: true }
    );
  } else {
    finishPageSetup();
  }

  new MutationObserver(() => {
    updateNavigation();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(
      "button[data-language]"
    );

    if (button) {
      updateNavigation(button.dataset.language);
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === "medisafe-language") {
      updateNavigation(event.newValue || language());
    }
  });
})();
