(() => {
  "use strict";

  const NEWS_ITEMS = [
    {
      id: "nih-endometriosis",
      type: "article",
      category: "research",
      source: "NIH",
      publisher: "National Institutes of Health",
      publishedAt: "2026-11-20",

      title: {
        en: "Study explores genetic pathways linked to endometriosis",
        my: "Endometriosis နှင့် ဆက်နွှယ်သော မျိုးဗီဇလုပ်ငန်းစဉ်များကို လေ့လာမှု"
      },

      summary: {
        en: "An NIH-supported study examines genetic associations that may guide future research into diagnosis and treatment.",
        my: "NIH ပံ့ပိုးသော လေ့လာမှုက အနာဂတ် ရောဂါရှာဖွေရေးနှင့် ကုသရေးသုတေသနကို အထောက်အကူပြုနိုင်သည့် မျိုးဗီဇဆက်နွှယ်မှုများကို လေ့လာထားသည်။"
      },

      url: "https://www.nih.gov/news-events/news-releases/large-nih-supported-study-identifies-key-underlying-pathways-endometriosis"
    },

    {
      id: "fda-glp1-safety",
      type: "article",
      category: "medicine",
      source: "FDA",
      publisher: "U.S. Food and Drug Administration",
      publishedAt: "2026-11-09",

      title: {
        en: "FDA announces a GLP-1 medicine safety-label update",
        my: "GLP-1 ဆေးများ၏ ဘေးကင်းရေးအညွှန်း ပြင်ဆင်မှုကို FDA ထုတ်ပြန်"
      },

      summary: {
        en: "Read the FDA communication about a potential increased risk of a rare eye condition and the required labeling changes.",
        my: "ရှားပါးမျက်စိအခြေအနေတစ်မျိုး ဖြစ်နိုင်ခြေ မြင့်တက်နိုင်မှုနှင့် လိုအပ်သော ဆေးအညွှန်းပြောင်းလဲမှုအကြောင်း FDA ထုတ်ပြန်ချက်ကို ဖတ်ရှုပါ။"
      },

      url: "https://www.fda.gov/drugs/drug-safety-communications/fda-requires-safety-labeling-changes-glucagon-peptide-1-receptor-agonists-glp-1-ras-due-potential"
    },

    {
      id: "fip-responsible-ai",
      type: "article",
      category: "pharmacy",
      source: "FIP",
      publisher: "International Pharmaceutical Federation",
      publishedAt: "2025-09-01",

      title: {
        en: "Responsible AI use in pharmacy",
        my: "ဆေးဝါးပညာလုပ်ငန်းတွင် AI ကို တာဝန်ယူစွာအသုံးပြုခြင်း"
      },

      summary: {
        en: "FIP outlines its policy position on responsible integration of artificial intelligence into pharmacy.",
        my: "ဆေးဝါးပညာလုပ်ငန်းအတွင်း AI ကို တာဝန်ယူစွာ ပေါင်းစပ်အသုံးပြုရေးဆိုင်ရာ FIP ၏ မူဝါဒရပ်တည်ချက်ကို ဖတ်ရှုနိုင်သည်။"
      },

      url: "https://www.fip.org/news?news=newsitem&newsitem=660"
    },

    // Source collections: these open the publisher's news listing.
    {
      id: "fda-updates",
      type: "source",
      category: "medicine",
      source: "FDA",
      publisher: "U.S. Food and Drug Administration",
      publishedAt: null,

      title: {
        en: "Medicine safety updates",
        my: "ဆေးဝါးဘေးကင်းရေး သတင်းအသစ်များ"
      },

      summary: {
        en: "Browse the FDA's collection of drug safety communications and medicine warnings.",
        my: "FDA ၏ ဆေးဝါးဘေးကင်းရေးထုတ်ပြန်ချက်များနှင့် သတိပေးချက်အသစ်များကို ကြည့်ရှုပါ။"
      },

      url: "https://www.fda.gov/drugs/drug-safety-and-availability/drug-safety-communications"
    },

    {
      id: "fip-updates",
      type: "source",
      category: "pharmacy",
      source: "FIP",
      publisher: "International Pharmaceutical Federation",
      publishedAt: null,

      title: {
        en: "Around the world of pharmacy",
        my: "ကမ္ဘာတစ်ဝန်း ဆေးဝါးပညာဆိုင်ရာသတင်းများ"
      },

      summary: {
        en: "Explore pharmacy practice, professional developments and pharmaceutical policy news from FIP.",
        my: "FIP မှ ဆေးဝါးပညာလုပ်ငန်း၊ ပညာရှင်များ၏ တိုးတက်မှုနှင့် ဆေးဝါးမူဝါဒဆိုင်ရာသတင်းများကို ဖတ်ရှုပါ။"
      },

      url: "https://www.fip.org/news"
    },

    {
      id: "nih-updates",
      type: "source",
      category: "research",
      source: "NIH",
      publisher: "National Institutes of Health",
      publishedAt: null,

      title: {
        en: "Discover medical research",
        my: "ဆေးဘက်ဆိုင်ရာ သုတေသနများကို လေ့လာရန်"
      },

      summary: {
        en: "Visit NIH news releases for medical studies, scientific findings and research announcements.",
        my: "ဆေးဘက်လေ့လာမှု၊ သိပ္ပံတွေ့ရှိချက်နှင့် သုတေသနထုတ်ပြန်ချက်များအတွက် NIH သတင်းစာမျက်နှာကို ကြည့်ရှုပါ။"
      },

      url: "https://www.nih.gov/news-events/news-releases"
    },

    {
      id: "who-updates",
      type: "source",
      category: "other",
      source: "WHO",
      publisher: "World Health Organization",
      publishedAt: null,

      title: {
        en: "Global health news",
        my: "ကမ္ဘာ့ကျန်းမာရေးသတင်းများ"
      },

      summary: {
        en: "Read WHO news about public health, health programmes and international health developments.",
        my: "ပြည်သူ့ကျန်းမာရေး၊ ကျန်းမာရေးအစီအစဉ်များနှင့် နိုင်ငံတကာကျန်းမာရေးအခြေအနေများဆိုင်ရာ WHO သတင်းများကို ဖတ်ရှုပါ။"
      },

      url: "https://www.who.int/news"
    },
    {
  id: "nih-npc-treatment",
  type: "article",
  category: "medicine",
  source: "NIH",
  publisher: "National Institutes of Health",
  publishedAt: "2026-11-17",

  title: {
    en: "Research supports a new treatment for infants with Niemann-Pick Type C",
    my: "ကလေးငယ်များ၏ Niemann-Pick Type C ရောဂါကုသမှုအသစ်အတွက် သုတေသန"
  },

  summary: {
    en:
      "NIH describes research behind a treatment for a rare childhood neurological disease. Read the original report for the findings and limitations.",
    my:
      "ကလေးငယ်များတွင် ဖြစ်ပွားသော ရှားပါးအာရုံကြောရောဂါတစ်မျိုး၏ ကုသမှုဆိုင်ရာ သုတေသနကို NIH က ဖော်ပြထားသည်။ တွေ့ရှိချက်နှင့် ကန့်သတ်ချက်များကို မူရင်းသတင်းတွင် ဖတ်ရှုပါ။"
  },

  image:
    "https://www.nih.gov/sites/default/files/2026-11/20261117-porter.png",

  imageAlt: {
    en: "Microscopy image of cells used in Niemann-Pick Type C research",
    my: "Niemann-Pick Type C သုတေသနဆိုင်ရာ ဆဲလ်များ၏ အဏုကြည့်ပုံ"
  },

  imageCredit: "NICHD / NIH",

  url:
    "https://www.nih.gov/news-events/news-releases/nih-research-team-lays-groundwork-new-treatment-niemann-pick-type-c-infants"
},

{
  id: "nih-stroke-wearable",
  type: "article",
  category: "research",
  source: "NIH",
  publisher: "National Institutes of Health",
  publishedAt: "2026-11-05",

  title: {
    en: "Wearable devices track recovery after stroke",
    my: "လေဖြတ်ပြီးနောက် ပြန်လည်ကောင်းမွန်မှုကို ဝတ်ဆင်နိုင်သောကိရိယာဖြင့် တိုင်းတာခြင်း"
  },

  summary: {
    en:
      "Researchers studied wrist-worn sensors that measure everyday arm movements during stroke recovery. The tool may help assess rehabilitation progress.",
    my:
      "လေဖြတ်ပြီးနောက် လက်လှုပ်ရှားမှု ပြန်လည်ကောင်းမွန်လာပုံကို လက်ကောက်ဝတ်တွင် ဝတ်ဆင်ထားသော sensor များဖြင့် လေ့လာခဲ့သည်။ ပြန်လည်ထူထောင်ရေး တိုးတက်မှုကို အကဲဖြတ်ရာတွင် အထောက်အကူပြုနိုင်သည်။"
  },

  image: null,
  imageAlt: { en: "", my: "" },
  imageCredit: null,

  url:
    "https://www.nih.gov/news-events/nih-research-matters/stroke-recovery-tracked-wearable-device"
},

{
  id: "nih-long-covid-trial",
  type: "article",
  category: "research",
  source: "NIH",
  publisher: "National Institutes of Health",
  publishedAt: "2026-09-29",

  title: {
    en: "Antiviral treatment did not improve Long COVID symptoms in a trial",
    my: "လေ့လာမှုတစ်ခုတွင် ဗိုင်းရပ်စ်တားဆေးက Long COVID လက္ခဏာများကို မတိုးတက်စေခဲ့"
  },

  summary: {
    en:
      "A clinical trial found that an extended course of nirmatrelvir and ritonavir did not improve the Long COVID symptoms studied compared with the control group.",
    my:
      "စမ်းသပ်လေ့လာမှုတစ်ခုတွင် nirmatrelvir နှင့် ritonavir ကို ရက်တိုးပေးခြင်းက လေ့လာထားသော Long COVID လက္ခဏာများကို နှိုင်းယှဉ်အုပ်စုထက် ပိုမိုမသက်သာစေခဲ့ပါ။"
  },

  image: null,
  imageAlt: { en: "", my: "" },
  imageCredit: null,

  url:
    "https://beta.nih.gov/our-science/nih-research-matters/antiviral-drug-did-not-improve-long-covid-symptoms"
}
  ];

  const TEXT = {
    en: {
      pageTitle: "News | MediSafe",
      eyebrow: "THE MEDISAFE READING ROOM",
      title: "A little knowledge. A healthier perspective.",
      description:
        "Explore medicine updates, pharmacy stories and research from original sources.",

      tagOne: "Medicine updates",
      tagTwo: "Research discoveries",
      tagThree: "Pharmacy insights",

      directoryLabel: "EXPLORE & LEARN",
      directoryTitle: "News worth reading",

      all: "All",
      medicine: "Medicine",
      pharmacy: "Pharmacy",
      research: "Research",
      other: "Other Health News",

      search: "Search news",
      searchPlaceholder: "Search news or source...",

      directoryNote:
        "Selected articles and publisher news collections. Open the original website for full details; external articles may be in English.",

      article: "Selected article",
      collection: "News collection",
      read: "Read article",
      browse: "Browse updates",
      opensNewTab: "opens in a new tab",

      emptyTitle: "No matching news",
      emptyDescription: "Try another keyword or category.",
      reset: "Clear filters",

      footer: "Discover. Read. Understand.",
      results: count => `${count} items`
    },

    my: {
      pageTitle: "သတင်းများ | MediSafe",
      eyebrow: "MEDISAFE သတင်းဖတ်ခန်း",
      title: "ဗဟုသုတတိုးစေဖို့ ကျန်းမာရေးသတင်းများ ဖတ်ရှုစို့။",
      description:
        "ဆေးဝါး၊ ဆေးဝါးပညာနှင့် သုတေသနသတင်းများကို မူရင်းရင်းမြစ်များမှ လေ့လာဖတ်ရှုနိုင်ပါတယ်။",

      tagOne: "ဆေးဝါးသတင်းများ",
      tagTwo: "သုတေသနတွေ့ရှိချက်များ",
      tagThree: "ဆေးဝါးပညာသတင်းများ",

      directoryLabel: "ဖတ်ရှုလေ့လာရန်",
      directoryTitle: "စိတ်ဝင်စားဖွယ် သတင်းများ",

      all: "အားလုံး",
      medicine: "ဆေးဝါး",
      pharmacy: "ဆေးဝါးပညာ",
      research: "သုတေသန",
      other: "အခြားကျန်းမာရေးသတင်း",

      search: "သတင်းရှာရန်",
      searchPlaceholder: "သတင်း၊ ရင်းမြစ်အမည် ရှာရန်...",

      directoryNote:
        "ရွေးထားသောဆောင်းပါးများနှင့် သတင်းရင်းမြစ်စာမျက်နှာများ ပါဝင်သည်။ အသေးစိတ်ကို မူရင်း website တွင် ဖတ်ရှုနိုင်ပြီး မူရင်းဆောင်းပါးများသည် အင်္ဂလိပ်ဘာသာဖြစ်နိုင်သည်။",

      article: "ရွေးထားသောဆောင်းပါး",
      collection: "သတင်းစုစည်းမှု",
      read: "ဆောင်းပါးဖတ်ရန်",
      browse: "သတင်းအသစ်များကြည့်ရန်",
      opensNewTab: "tab အသစ်တွင်ဖွင့်မည်",

      emptyTitle: "ကိုက်ညီသောသတင်း မတွေ့ပါ",
      emptyDescription:
        "အခြားစကားလုံး သို့မဟုတ် အမျိုးအစားဖြင့် ရှာကြည့်ပါ။",
      reset: "စစ်ထုတ်မှုရှင်းရန်",

      footer: "ရှာဖွေပါ။ ဖတ်ရှုပါ။ နားလည်ပါ။",
      results: count => `စုစုပေါင်း ${count} ခု`
    }
  };

  const grid = document.getElementById("news-grid");
  function removeBrokenNewsImage(image) {
  const cover = image.closest(".news-card-cover");

  if (cover) {
    cover.classList.remove("has-image");
    cover.querySelector(".news-image-credit")?.remove();
  }

  image.remove();
}

grid.addEventListener(
  "error",
  event => {
    const image = event.target;

    if (
      image instanceof HTMLImageElement &&
      image.classList.contains("news-cover-photo")
    ) {
      removeBrokenNewsImage(image);
    }
  },
  true
);
  const searchInput = document.getElementById("news-search");
  const countElement = document.getElementById("news-count");
  const emptyState = document.getElementById("news-empty");

  let category = "all";
  let language = "en";

  try {
    language =
      localStorage.getItem("medisafe-language") === "my"
        ? "my"
        : "en";
  } catch {
    // The page works even when browser storage is unavailable.
  }

  const externalIcon = `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3h7v7M10 14 21 3"/>
      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>
    </svg>
  `;

  const coverIcon = `
    <svg
      class="news-cover-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <path d="M8 7h8M8 11h8M8 15h4M8 18h8"/>
    </svg>
  `;

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function safeExternalURL(value) {
    try {
      const url = new URL(value);

      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  }

  function formatDate(value) {
    if (!value) return TEXT[language].collection;

    // Local noon avoids shifting a calendar date across time zones.
    const date = new Date(`${value}T12:00:00`);

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(
      language === "my" ? "my-MM" : "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    ).format(date);
  }
  function createNewsCover(item) {
  let imageURL = null;

  if (typeof item.image === "string" && item.image.trim()) {
    try {
      const parsed = new URL(item.image, document.baseURI);

      if (["https:", "http:"].includes(parsed.protocol)) {
        imageURL = parsed.href;
      }
    } catch {
      // Invalid image paths use the publisher cover instead.
    }
  }

  const alt =
    item.imageAlt?.[language] ||
    item.imageAlt?.en ||
    item.title[language];

  const imageMarkup = imageURL
    ? `
      <img
        class="news-cover-photo"
        src="${escapeHTML(imageURL)}"
        alt="${escapeHTML(alt)}"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
      >
    `
    : "";

  const creditMarkup = imageURL && item.imageCredit
    ? `
      <span class="news-image-credit">
        ${escapeHTML(item.imageCredit)}
      </span>
    `
    : "";

  return `
    <div class="news-card-cover${imageURL ? " has-image" : ""}">
      <div class="news-cover-fallback" aria-hidden="true">
        <span class="news-source-mark">
          ${escapeHTML(item.source)}
        </span>

        ${coverIcon}
      </div>

      ${imageMarkup}
      ${creditMarkup}
    </div>
  `;
}
  function createCard(item) {
    const text = TEXT[language];
    const url = safeExternalURL(item.url);

    if (!url) return "";

    const title = item.title[language] || item.title.en;
    const summary = item.summary[language] || item.summary.en;
    const action = item.type === "article" ? text.read : text.browse;

    const dateMarkup = item.publishedAt
      ? `
        <time
          class="news-card-date"
          datetime="${escapeHTML(item.publishedAt)}"
        >
          ${escapeHTML(formatDate(item.publishedAt))}
        </time>
      `
      : `
        <span class="news-card-date">
          ${escapeHTML(text.collection)}
        </span>
      `;

    return `
      <article
        class="news-card"
        data-category="${escapeHTML(item.category)}"
      >
       ${createNewsCover(item)}

        <div class="news-card-body">
          <div class="news-card-meta">
            <span class="news-category-badge">
              ${escapeHTML(text[item.category])}
            </span>

            ${dateMarkup}
          </div>

          <h3>${escapeHTML(title)}</h3>

          <p class="news-card-summary">
            ${escapeHTML(summary)}
          </p>

          <div class="news-card-bottom">
            <span class="news-publisher">
              ${escapeHTML(item.publisher)}
            </span>

            <a
              class="news-read-link"
              href="${escapeHTML(url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${escapeHTML(action)}

              ${externalIcon}

              <span class="news-sr-only">
                — ${escapeHTML(title)};
                ${escapeHTML(text.opensNewTab)}
              </span>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderNews() {
    const query = searchInput.value
      .trim()
      .normalize("NFC")
      .toLowerCase();

    const filtered = NEWS_ITEMS.filter(item => {
      const matchesCategory =
        category === "all" || item.category === category;

      const searchable = [
        item.title.en,
        item.title.my,
        item.summary.en,
        item.summary.my,
        item.source,
        item.publisher
      ]
        .join(" ")
        .normalize("NFC")
        .toLowerCase();

      return (
        matchesCategory &&
        searchable.includes(query) &&
        safeExternalURL(item.url)
      );
    });

    // Dated articles first, newest first; source collections follow.
    filtered.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "article" ? -1 : 1;
      }

      return (b.publishedAt || "").localeCompare(
        a.publishedAt || ""
      );
    });

    grid.innerHTML = filtered.map(createCard).join("");
    // Also handle images that have already failed to load.
grid.querySelectorAll(".news-cover-photo").forEach(image => {
  if (image.complete && image.naturalWidth === 0) {
    removeBrokenNewsImage(image);
  }
});

    countElement.textContent =
      TEXT[language].results(filtered.length);

    emptyState.hidden = filtered.length !== 0;
  }

  function renderLanguage() {
    const text = TEXT[language];

    document.documentElement.lang = language;
    document.title = text.pageTitle;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const value = text[element.dataset.i18n];

      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    searchInput.placeholder = text.searchPlaceholder;

    document.querySelectorAll("[data-language]").forEach(button => {
      const active = button.dataset.language === language;

      button.setAttribute("aria-pressed", String(active));
    });

    renderNews();
  }

  document.querySelectorAll("[data-language]").forEach(button => {
    button.addEventListener("click", () => {
      language = button.dataset.language === "my" ? "my" : "en";

      try {
        localStorage.setItem("medisafe-language", language);
      } catch {
        // Language switching still works for this visit.
      }

      renderLanguage();
    });
  });

  document.querySelectorAll("[data-category]").forEach(button => {
    if (!button.matches("button")) return;

    button.addEventListener("click", () => {
      category = button.dataset.category;

      document
        .querySelectorAll(".news-filter")
        .forEach(filterButton => {
          filterButton.setAttribute(
            "aria-pressed",
            String(filterButton.dataset.category === category)
          );
        });

      renderNews();
    });
  });

  searchInput.addEventListener("input", renderNews);

  document.getElementById("news-reset").addEventListener("click", () => {
    category = "all";
    searchInput.value = "";

    document.querySelectorAll(".news-filter").forEach(button => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === "all")
      );
    });

    renderNews();
    searchInput.focus();
  });

  renderLanguage();
})();