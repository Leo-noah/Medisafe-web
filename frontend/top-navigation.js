(() => {
  function highlightCurrentPage() {
    const currentFile = window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

    document.querySelectorAll(".top-nav-link").forEach(link => {
      const targetFile = new URL(link.href)
        .pathname.split("/")
        .pop()
        .toLowerCase();

      const active = currentFile === targetFile;

      link.classList.toggle("is-active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      highlightCurrentPage
    );
  } else {
    highlightCurrentPage();
  }
})();
(() => {
  "use strict";

  const navigationLabels = {
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

  function updateNavigation(language) {
    const selected = language === "my" ? "my" : "en";

    document.querySelectorAll(".site-header").forEach(header => {
      header.querySelectorAll("a[href]").forEach(link => {
        // Keep the MediSafe brand unchanged.
        if (link.classList.contains("brand")) return;

        const url = new URL(link.getAttribute("href"), document.baseURI);
        const filename = url.pathname.split("/").pop();
        const labels = navigationLabels[filename];

        if (!labels) return;

        let label = link.querySelector("[data-nav-label]");

        if (!label) {
          // Prefer an existing text span outside the icon.
          label = Array.from(link.querySelectorAll("span")).find(span => {
            return (
              !span.closest("svg") &&
              !span.closest('[aria-hidden="true"]') &&
              !span.querySelector("svg") &&
              span.textContent.trim()
            );
          });

          if (!label) {
            // Replace direct text while preserving SVG/icon elements.
            Array.from(link.childNodes).forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = "";
              }
            });

            label = document.createElement("span");
            link.append(label);
          }

          label.setAttribute("data-nav-label", "");
        }

        label.textContent = labels[selected];
        link.setAttribute("aria-label", labels[selected]);
      });
    });
  }

  function initialiseNavigationLanguage() {
    let language = document.documentElement.lang;

    try {
      language =
        localStorage.getItem("medisafe-language") || language;
    } catch {
      // Use the page language when browser storage is unavailable.
    }

    updateNavigation(language);

    new MutationObserver(() => {
      updateNavigation(document.documentElement.lang);
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      const button = event.target.closest("button[data-language]");

      if (button) {
        updateNavigation(button.dataset.language);
      }
    });

    window.addEventListener("storage", event => {
      if (event.key === "medisafe-language") {
        updateNavigation(
          event.newValue || document.documentElement.lang
        );
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseNavigationLanguage,
      { once: true }
    );
  } else {
    initialiseNavigationLanguage();
  }
})();