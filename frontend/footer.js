"use strict";

(() => {
  const translations = {
    en: {
      description:
        "Understand your medicines. Keep your routine organised.",
      languages: "Available in English and Myanmar",
      explore: "Explore",
      find: "Find Medicine",
      myMedicine: "My Medicine",
      news: "News",
      shops: "Online Shop",
      information: "Before you use",
      medicalNote:
        "Medicine information is for learning. Follow your product label and advice from your doctor or pharmacist.",
      backToTop: "Back to top",
      rights: "All rights reserved.",
      tagline: "A little clarity for everyday care."
    },

    my: {
      description:
        "သင့်ဆေးဝါးများအကြောင်း သိရှိပြီး နေ့စဉ်ဆေးသောက်အစီအစဉ်ကို စနစ်တကျ စီမံပါ။",
      languages: "အင်္ဂလိပ်၊ မြန်မာ နှစ်ဘာသာဖြင့် အသုံးပြုနိုင်ပါသည်",
      explore: "လေ့လာရန်",
      find: "ဆေးရှာရန်",
      myMedicine: "ကိုယ်ပိုင်ဆေးစာရင်း",
      news: "သတင်းများ",
      shops: "အွန်လိုင်းဆေးဆိုင်များ",
      information: "အသုံးမပြုမီ သိထားရန်",
      medicalNote:
        "ဤဆေးဝါးအချက်အလက်များသည် လေ့လာရန်အတွက် ဖြစ်ပါသည်။ ဆေးဘူးအညွှန်းနှင့် ဆရာဝန် သို့မဟုတ် ဆေးဝါးပညာရှင်၏ အကြံပြုချက်ကို လိုက်နာပါ။",
      backToTop: "အပေါ်သို့ ပြန်သွားရန်",
      rights: "မူပိုင်ခွင့်အားလုံး ရယူထားပါသည်။",
      tagline: "နေ့စဉ်ကျန်းမာရေးအတွက် ဆေးဝါးအကြောင်း ပိုမိုသိရှိပါ။"
    }
  };

  function savedLanguage() {
    try {
      return localStorage.getItem("medisafe-language");
    } catch {
      return null;
    }
  }

  function renderFooter(language) {
    const selected = language === "my" ? "my" : "en";
    const text = translations[selected];

    document.querySelectorAll(".ms-footer").forEach(footer => {
      footer.lang = selected;

      footer.querySelectorAll("[data-footer-i18n]").forEach(node => {
        const key = node.dataset.footerI18n;

        if (text[key] !== undefined) {
          node.textContent = text[key];
        }
      });
    });
  }

  function initialiseFooter() {
    document.querySelectorAll("[data-footer-year]").forEach(node => {
      node.textContent = new Date().getFullYear();
    });

    renderFooter(
      savedLanguage() || document.documentElement.lang
    );

    // Follow language changes made by the existing page scripts.
    const observer = new MutationObserver(() => {
      renderFooter(document.documentElement.lang);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });

    // Also respond directly to the topbar language buttons.
    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      const languageButton = event.target.closest(
        "button[data-language]"
      );

      if (languageButton) {
        renderFooter(languageButton.dataset.language);
      }

      const backButton = event.target.closest("[data-footer-back]");

      if (backButton) {
        event.preventDefault();

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? "instant" : "smooth"
        });
      }
    });

    // Sync when the language is changed in another browser tab.
    window.addEventListener("storage", event => {
      if (event.key === "medisafe-language") {
        renderFooter(
          event.newValue || document.documentElement.lang
        );
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseFooter,
      { once: true }
    );
  } else {
    initialiseFooter();
  }
})();