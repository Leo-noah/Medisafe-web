"use strict";

const SAVED_SHOPS_KEY = "medisafe-saved-shops-v1";

const translations = {
  en: {
    pageTitle: "Online Shop | MediSafe",
    eyebrow: "PHARMACY DIRECTORY",
    title: "Find a pharmacy that works for you.",
    description:
      "Explore Myanmar pharmacy shops and healthcare retailers. " +
      "Open a shop's own page to check products and ordering.",
    tagOne: "Myanmar pharmacy links",
    tagTwo: "No account needed",
    directoryLabel: "EXPLORE YOUR OPTIONS",
    directoryTitle: "Pharmacies & online shops",
    search: "Search pharmacies",
    searchPlaceholder: "Search a pharmacy name…",
    filter: "Shop type",
    allShops: "All shops",
    catalogue: "Online catalogue",
    contactFirst: "Contact first",
    savedShops: "Saved shops",
    notice:
      "Confirm stock, delivery coverage and prescription requirements " +
      "with the shop. A directory listing is not a quality or licensing endorsement.",
    results: "{count} shops",
    visitShop: "Open shop",
    viewContact: "View contact / information",
    externalLabel: "opens in a new tab",
    saveShop: "Save shop",
    removeSaved: "Remove saved shop",
    emptyTitle: "No matching shops",
    emptyDescription: "Try another name or change the filters.",
    reset: "Clear filters",
    storageError: "Your saved shops could not be updated in browser storage.",
    footer: "Ordering and payments take place on the shop's own service.",
  },

  my: {
    pageTitle: "အွန်လိုင်းဆေးဆိုင်များ | MediSafe",
    eyebrow: "ဆေးဆိုင် လမ်းညွှန်",
    title: "သင့်အတွက် အဆင်ပြေသော ဆေးဆိုင်ကို ရှာပါ။",
    description:
      "မြန်မာနိုင်ငံရှိ ဆေးဆိုင်နှင့် ကျန်းမာရေးပစ္စည်းဆိုင်များကို ကြည့်ရှုပါ။ " +
      "ပစ္စည်းနှင့် မှာယူပုံသိရန် ဆိုင်၏မူရင်းစာမျက်နှာကို ဖွင့်ပါ။",
    tagOne: "မြန်မာဆေးဆိုင် လင့်ခ်များ",
    tagTwo: "အကောင့်မလိုပါ",
    directoryLabel: "ဆေးဆိုင်များကို ကြည့်ရှုပါ",
    directoryTitle: "ဆေးဆိုင်နှင့် အွန်လိုင်းဆိုင်များ",
    search: "ဆေးဆိုင်ရှာရန်",
    searchPlaceholder: "ဆေးဆိုင်အမည် ရိုက်ထည့်ပါ…",
    filter: "ဆိုင်အမျိုးအစား",
    allShops: "ဆိုင်အားလုံး",
    catalogue: "အွန်လိုင်းပစ္စည်းစာရင်း",
    contactFirst: "အရင်ဆက်သွယ်ရန်",
    savedShops: "မှတ်ထားသောဆိုင်များ",
    notice:
      "ပစ္စည်းရှိမရှိ၊ ပို့ဆောင်နိုင်သောနေရာနှင့် ဆေးညွှန်းလိုအပ်ချက်ကို " +
      "ဆိုင်ထံ အတည်ပြုပါ။ ဤစာရင်းသည် အရည်အသွေး သို့မဟုတ် " +
      "လိုင်စင်အတည်ပြုချက် မဟုတ်ပါ။",
    results: "ဆိုင် {count} ခု",
    visitShop: "ဆိုင်စာမျက်နှာ ဖွင့်မည်",
    viewContact: "ဆက်သွယ်ရန် / အချက်အလက် ကြည့်မည်",
    externalLabel: "tab အသစ်တွင် ဖွင့်မည်",
    saveShop: "ဆိုင်ကို မှတ်ထားမည်",
    removeSaved: "မှတ်ထားသောဆိုင်မှ ဖယ်မည်",
    emptyTitle: "ကိုက်ညီသောဆိုင် မတွေ့ပါ",
    emptyDescription: "အခြားအမည် သို့မဟုတ် အမျိုးအစားဖြင့် ပြန်ရှာပါ။",
    reset: "စစ်ထုတ်မှု ဖယ်မည်",
    storageError: "မှတ်ထားသောဆိုင်များကို browser ထဲတွင် ပြင်ဆင်မသိမ်းနိုင်ပါ။",
    footer:
      "မှာယူမှုနှင့် ငွေပေးချေမှုကို ဆိုင်၏မူရင်းဝန်ဆောင်မှုတွင် ဆောင်ရွက်ရပါမည်။",
  },
};

/*
  Catalogue = a publicly accessible shopping/catalogue page was found.
  Contact = enquire about the current ordering process first.
  Neither label guarantees order fulfilment or licensing.
*/

const shops = [
  {
    id: "lifeplus",
    name: "LifePlus Health & Beauty",
    nameMy: "လိုက်ဖ်ပလပ်စ်",
    initials: "LP",
    type: "catalogue",
    url: "https://lifeplusmm.com/",
    tint: "#e0f0e7",
    color: "#217452",
    description: {
      en: "Medicines, health, beauty and personal care products.",
      my: "ဆေးဝါး၊ ကျန်းမာရေး၊ အလှအပနှင့် တစ်ကိုယ်ရည်သုံးပစ္စည်းများ။",
    },
  },
  {
    id: "my-medicine",
    name: "My-Medicine",
    nameMy: "မိုင်မက်ဒီစင်း",
    initials: "MM",
    type: "catalogue",
    url: "https://mymedicine.com.mm/pharmacy",
    tint: "#e0eef8",
    color: "#3277a0",
    description: {
      en: "An online pharmacy catalogue with healthcare product categories.",
      my: "ကျန်းမာရေးပစ္စည်း အမျိုးအစားများပါဝင်သော အွန်လိုင်းဆေးဆိုင်စာရင်း။",
    },
  },
  {
    id: "pacific-aa",
    name: "Pacific-AA Online Shop",
    nameMy: "ပစိဖိတ် အေ-အေ",
    initials: "AA",
    type: "catalogue",
    url: "https://onlineshop.aa.com.mm/",
    tint: "#e8e5f7",
    color: "#7060a8",
    description: {
      en: "Medicines, supplements and medical devices from AA Medical Products.",
      my: "AA Medical Products ၏ ဆေးဝါး၊ ဖြည့်စွက်အားဆေးနှင့် ဆေးဘက်ကိရိယာများ။",
    },
  },
  {
    id: "shwemed",
    name: "ShweMed",
    nameMy: "ရွှေမက်ဒ်",
    initials: "SM",
    type: "catalogue",
    url: "https://shwemed.com/",
    tint: "#faf0d5",
    color: "#9a7728",
    description: {
      en: "An online medicine and healthcare product marketplace.",
      my: "ဆေးဝါးနှင့် ကျန်းမာရေးပစ္စည်းများအတွက် အွန်လိုင်းစျေးကွက်။",
    },
  },
  {
    id: "orchid",
    name: "Orchid Online Pharmacy",
    nameMy: "သစ်ခွဆေးဆိုင်",
    initials: "OR",
    type: "catalogue",
    url: "https://orchidonlineshop.com/",
    tint: "#f3e3ef",
    color: "#a05a90",
    description: {
      en: "An online pharmacy with an ordering page.",
      my: "မှာယူရန်စာမျက်နှာ ပါဝင်သော အွန်လိုင်းဆေးဆိုင်။",
    },
  },
  {
    id: "soe-pyae",
    name: "Soe Pyae Pharmacy",
    nameMy: "စိုးပြည့်ဆေးဆိုင်",
    initials: "SP",
    type: "catalogue",
    url: "https://soepyaepharmacy.shop/shop/",
    tint: "#e0f0ef",
    color: "#39847e",
    description: {
      en: "A searchable medicine catalogue from a Yangon pharmacy.",
      my: "ရန်ကုန်ရှိ ဆေးဆိုင်တစ်ဆိုင်၏ ရှာဖွေနိုင်သော ဆေးပစ္စည်းစာရင်း။",
    },
  },
  {
    id: "city-care",
    name: "City Care",
    nameMy: "စီးတီးကဲယား",
    initials: "CC",
    type: "catalogue",
    url: "https://www.citymall.com.mm/citymall/my/c/TSCC1",
    tint: "#f7e6df",
    color: "#b06d50",
    description: {
      en: "Health and beauty products through City Mall Online.",
      my: "City Mall Online မှတစ်ဆင့် ကျန်းမာရေးနှင့် အလှအပပစ္စည်းများ။",
    },
  },
  {
    id: "shwe-ohh",
    name: "Shwe Ohh Pharmacy",
    nameMy: "ရွှေအိုးဆေးဆိုင်",
    initials: "SO",
    type: "contact",
    url: "https://www.facebook.com/shweohhpharmacy",
    tint: "#f7eed7",
    color: "#a57e2d",
    description: {
      en: "Contact the pharmacy page about current stock and ordering.",
      my: "လက်ရှိပစ္စည်းရှိမရှိနှင့် မှာယူပုံကို ဆေးဆိုင်စာမျက်နှာမှ ဆက်သွယ်မေးမြန်းပါ။",
    },
  },
  {
    id: "padaukoo",
    name: "PadaukOo Pharmacy",
    nameMy: "ပိတောက်ဦးဆေးဆိုင်",
    initials: "PO",
    type: "contact",
    url: "https://padaukoo.com/",
    tint: "#e4eddc",
    color: "#668241",
    description: {
      en: "A pharmacy chain; confirm the current retail ordering service directly.",
      my: "ဆေးဆိုင်ကွန်ရက်ဖြစ်ပြီး လက်ရှိလက်လီမှာယူနိုင်ပုံကို ဆိုင်ထံ တိုက်ရိုက်အတည်ပြုပါ။",
    },
  },
  {
    id: "wellington",
    name: "Wellington Pharmacy",
    nameMy: "ဝယ်လင်တန်ဆေးဆိုင်",
    initials: "WP",
    type: "contact",
    url: "https://capitalretail.com.mm/wellington-pharmacy/",
    tint: "#e1edf7",
    color: "#4a78a0",
    description: {
      en: "Capital Retail's pharmacy service; enquire about available ordering channels.",
      my: "Capital Retail ၏ ဆေးဆိုင်ဝန်ဆောင်မှုဖြစ်ပြီး လက်ရှိမှာယူနိုင်သောလမ်းကြောင်းများကို မေးမြန်းပါ။",
    },
  },
  {
    id: "osc",
    name: "OSC Hospital Pharmacy",
    nameMy: "OSC ဆေးရုံဆေးဆိုင်",
    initials: "OSC",
    type: "contact",
    url: "https://www.oschospitalmm.com/hospital-services/online-pharmacy-delivery-services/",
    tint: "#e3efea",
    color: "#4c8370",
    description: {
      en: "A hospital pharmacy delivery service; confirm patient eligibility and delivery.",
      my: "ဆေးရုံဆေးဆိုင် ပို့ဆောင်ရေးဝန်ဆောင်မှုဖြစ်ပြီး လူနာအတွက် သုံးနိုင်မနိုင်နှင့် ပို့ဆောင်မှုကို အတည်ပြုပါ။",
    },
  },
  {
    id: "k-pharmacy",
    name: "K Pharmacy",
    nameMy: "ကေ ဆေးဆိုင်",
    initials: "KP",
    type: "catalogue",
    url: "https://k-pharmacymm.com/",
    tint: "#e1f2eb",
    color: "#23775b",
    description: {
      en:
        "Browse medicines and healthcare products. " +
        "Check pickup and delivery options on the shop website.",
      my:
        "ဆေးဝါးနှင့် ကျန်းမာရေးပစ္စည်းများကို ကြည့်ရှုနိုင်ပါသည်။ " +
        "ဆိုင်တွင်လာယူခြင်းနှင့် ပို့ဆောင်ရေးအတွက် ဆိုင်၏ website တွင် စစ်ဆေးပါ။"
    }
  },

  {
    id: "nat-say-myanmar",
    name: "Nat Say Myanmar",
    nameMy: "နတ်ဆေး မြန်မာ",
    initials: "NS",
    type: "catalogue",
    url: "https://www.natsay.com.mm/home",
    tint: "#e6edf9",
    color: "#426da5",
    description: {
      en:
        "A marketplace for medicines and healthcare products. " +
        "Check the seller and delivery details for each order.",
      my:
        "ဆေးဝါးနှင့် ကျန်းမာရေးပစ္စည်းများအတွက် အွန်လိုင်းစျေးကွက်။ " +
        "မှာယူမည့်ပစ္စည်း၏ ရောင်းချသူနှင့် ပို့ဆောင်ရေးအချက်အလက်ကို စစ်ဆေးပါ။"
    }
  },
  {
  id: "zaw-pharmacy",
  name: "Zaw Pharmacy",
  nameMy: "ဇော် ဆေးဆိုင်",
  initials: "ZP",
  type: "catalogue",
  url: "https://zaw-pharmacy.stagebeta.kyte.site/en",
  tint: "#f5eadc",
  color: "#926b31",
  description: {
    en:
      "Browse the pharmacy's online catalogue. " +
      "Confirm stock, payment and delivery arrangements with the shop.",
    my:
      "ဆေးဆိုင်၏ အွန်လိုင်းပစ္စည်းစာရင်းကို ကြည့်ရှုနိုင်ပါသည်။ " +
      "ပစ္စည်းရှိမရှိ၊ ငွေပေးချေမှုနှင့် ပို့ဆောင်မှုကို ဆိုင်ထံ အတည်ပြုပါ။"
  }
},
];

const searchInput = document.getElementById("shop-search");
const typeSelect = document.getElementById("shop-type");
const favouritesFilter = document.getElementById("favourites-filter");
const grid = document.getElementById("shop-grid");

let language = "en";
let savedShops = new Set();
let showSavedOnly = false;
let storageError = false;
let savedDataReadable = true;

try {
  const savedLanguage = localStorage.getItem("medisafe-language");

  if (savedLanguage === "en" || savedLanguage === "my") {
    language = savedLanguage;
  }

  const raw = localStorage.getItem(SAVED_SHOPS_KEY);

  if (raw) {
    const parsed = JSON.parse(raw);

    if (
      !Array.isArray(parsed) ||
      !parsed.every((item) => typeof item === "string")
    ) {
      throw new Error("Invalid saved shops");
    }

    savedShops = new Set(parsed);
  }
} catch {
  savedDataReadable = false;
  storageError = true;
}

function t(key) {
  return translations[language][key] || key;
}

function normalise(value) {
  return String(value || "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function toggleSaved(id) {
  if (!savedDataReadable) {
    storageError = true;
    render();
    return;
  }

  const next = new Set(savedShops);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  try {
    localStorage.setItem(SAVED_SHOPS_KEY, JSON.stringify([...next]));

    savedShops = next;
    storageError = false;
  } catch {
    storageError = true;
  }

  render();

  // Keep keyboard focus on the same save button after re-rendering.
  const replacement = grid.querySelector(`[data-favourite="${id}"]`);

  if (replacement) {
    replacement.focus();
  } else if (showSavedOnly) {
    favouritesFilter.focus();
  }
}

function createShopCard(shop) {
  const card = document.createElement("article");
  card.className = "shop-card";

  card.style.setProperty("--shop-tint", shop.tint);
  card.style.setProperty("--shop-color", shop.color);

  const banner = document.createElement("div");
  banner.className = "shop-banner";

  const monogram = document.createElement("span");
  monogram.className = "shop-monogram";
  monogram.textContent = shop.initials;
  monogram.setAttribute("aria-hidden", "true");

  const save = document.createElement("button");
  save.type = "button";
  save.className = "save-shop-button";
  save.dataset.favourite = shop.id;

  const isSaved = savedShops.has(shop.id);

  save.textContent = isSaved ? "♥" : "♡";
  save.setAttribute("aria-pressed", String(isSaved));
  save.setAttribute(
    "aria-label",
    `${t(isSaved ? "removeSaved" : "saveShop")}: ${shop.name}`,
  );

  save.addEventListener("click", () => toggleSaved(shop.id));

  banner.append(monogram, save);

  const content = document.createElement("div");
  content.className = "shop-card-content";

  const type = document.createElement("span");
  type.className = `shop-type ${shop.type}`;
  type.textContent = t(
    shop.type === "catalogue" ? "catalogue" : "contactFirst",
  );

  const title = document.createElement("h3");
  title.textContent = shop.name;

  const subtitle = document.createElement("p");
  subtitle.className = "shop-subtitle";
  subtitle.lang = "my";
  subtitle.textContent = shop.nameMy;

  const description = document.createElement("p");
  description.className = "shop-description";
  description.textContent = shop.description[language];

  const link = document.createElement("a");
  link.className = "shop-link";
  link.href = shop.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const linkLabel = document.createElement("span");
  linkLabel.textContent = t(
    shop.type === "catalogue" ? "visitShop" : "viewContact",
  );

  const externalIcon = document.createElement("span");
  externalIcon.setAttribute("aria-hidden", "true");

  externalIcon.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.7"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 3h7v7M21 3l-9 9"/>
      <path d="M10 3H5a2 2 0 0 0-2 2v14
               a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>
    </svg>
  `;

  link.setAttribute(
    "aria-label",
    `${linkLabel.textContent}: ${shop.name}, ${t("externalLabel")}`,
  );

  link.append(linkLabel, externalIcon);

  content.append(type, title, subtitle, description, link);
  card.append(banner, content);

  return card;
}

function render() {
  const query = normalise(searchInput.value);
  const selectedType = typeSelect.value;

  const filtered = shops.filter((shop) => {
    const text = normalise(
      `${shop.name} ${shop.nameMy} ` +
        `${shop.description.en} ${shop.description.my}`,
    );

    return (
      (!query || text.includes(query)) &&
      (selectedType === "all" || shop.type === selectedType) &&
      (!showSavedOnly || savedShops.has(shop.id))
    );
  });

  grid.replaceChildren();

  const fragment = document.createDocumentFragment();

  filtered.forEach((shop) => {
    fragment.append(createShopCard(shop));
  });

  grid.append(fragment);

  const count = new Intl.NumberFormat(
    language === "my" ? "my-MM" : "en",
  ).format(filtered.length);

  document.getElementById("result-count").textContent = t("results").replace(
    "{count}",
    count,
  );

  document.getElementById("empty-state").hidden = filtered.length !== 0;

  favouritesFilter.setAttribute("aria-pressed", String(showSavedOnly));

  const storageStatus = document.getElementById("storage-status");

  storageStatus.hidden = !storageError;
  storageStatus.textContent = storageError ? t("storageError") : "";
}

function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  });

  searchInput.placeholder = t("searchPlaceholder");

  render();
}

searchInput.addEventListener("input", render);
typeSelect.addEventListener("change", render);

favouritesFilter.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  render();
});

document.getElementById("reset-filters").addEventListener("click", () => {
  searchInput.value = "";
  typeSelect.value = "all";
  showSavedOnly = false;

  render();
  searchInput.focus();
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.language;

    try {
      localStorage.setItem("medisafe-language", language);
    } catch {
      // Language switching still works without saving the preference.
    }

    renderLanguage();
  });
});

renderLanguage();
