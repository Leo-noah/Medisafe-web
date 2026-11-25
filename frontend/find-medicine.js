(() => {
  "use strict";

  const CATALOGUE_URL =
  "./data/myanmar-200-general-information-audio-prelinked.json";

  const LANGUAGE_KEY = "medisafe-language";
  const PAGE_SIZE = 30;

  const translations = {
    en: {
      pageTitle: "Find Medicine | MediSafe",
      account: "My account",
      eyebrow: "A LITTLE MORE CLARITY",
      title: "Get to know your medicines.",
      description:
        "Search a medicine name in English or Burmese. No account needed to explore.",

      searchLabel: "Search medicines",
      searchPlaceholder: "Search medicine names…",
      searchHint: "Try A, Am, Paracetamol or ပါရာစီတမော",
      browseTitle: "Browse medicines · A–Z",

      photoTitle: "Have a medicine photo?",
      photoDescription:
        "Choose a clear photo of the medicine packaging.",
      choosePhoto: "Choose a photo",
      photoNote: "JPG, PNG or WebP · Maximum 8 MB",
      previewTitle: "Your selected photo",
      recognitionPending:
        "Photo preview only. Medicine recognition is not connected yet.",
      removePhoto: "Remove photo",
      invalidPhoto: "Choose a JPG, PNG or WebP image up to 8 MB.",
      unreadablePhoto:
        "This image could not be opened. Choose another photo.",

      catalogueLabel: "EXPLORE THE CATALOGUE",
      catalogueTitle: "Find what you are looking for",
      categoryLabel: "Category",
      allCategories: "All categories",
      loading: "Loading medicines…",

      

      emptyTitle: "No matching medicines",
      emptyDescription:
        "Try another spelling or choose a different category.",
      clearFilters: "Clear filters",

      loadErrorTitle: "The medicine list is unavailable",
      loadErrorDescription:
        "The JSON catalogue could not be loaded. Check the file location and try again.",
      retry: "Try again",

      medicineDetails: "MEDICINE INFORMATION",
      close: "Close",
      viewDetails: "Read information",
      selectionHint:
        "Select a medicine from the search suggestions or the browse list to read its information here.",

      ingredients: "Active ingredients",
      uses: "What it is used for",
      formulations: "Example forms and strengths",
      howToUse: "How to use / key precautions",
      sideEffects: "Selected side effects",
      contraindications: "Selected contraindications",
      precautions: "Precautions",
      interactions: "Selected drug interactions",
      pregnancy: "Pregnancy and breastfeeding",
      monitoring: "Monitoring and when to seek help",
      missedDose: "Missed dose",
      overdose: "Overdose warning",
      storage: "Storage",

      notPrepared: "Information has not been prepared yet.",
      detailsWarning:
        "Draft information: the lists may be incomplete. Confirm the actual product label and seek professional advice before use.",

      footer: "Medicine information, made easier to explore."
    },

    my: {
      pageTitle: "ဆေးရှာရန် | MediSafe",
      account: "ကျွန်ုပ်အကောင့်",
      eyebrow: "ဆေးအကြောင်း ပိုမိုရှင်းလင်းစွာ သိရှိရန်",
      title: "သင့်ဆေးဝါးအကြောင်း သိရှိပါ။",
      description:
        "ဆေးအမည်ကို အင်္ဂလိပ် သို့မဟုတ် မြန်မာဖြင့် ရှာပါ။ ကြည့်ရှုရန် အကောင့်မလိုပါ။",

      searchLabel: "ဆေးဝါးရှာရန်",
      searchPlaceholder: "ဆေးအမည် ရိုက်ထည့်ပါ…",
      searchHint: "ဥပမာ A၊ Am၊ Paracetamol သို့မဟုတ် ပါရာစီတမော",
      browseTitle: "ဆေးအမည်များ · A–Z",

      photoTitle: "ဆေးပုံရှိပါသလား",
      photoDescription:
        "ဆေးထုပ်ပေါ်က စာသားရှင်းလင်းသော ပုံကို ရွေးပါ။",
      choosePhoto: "ဆေးပုံ ရွေးမည်",
      photoNote: "JPG၊ PNG သို့မဟုတ် WebP · အများဆုံး 8 MB",
      previewTitle: "သင်ရွေးထားသော ဆေးပုံ",
      recognitionPending:
        "ပုံအကြိုကြည့်ရှုမှုသာ ဖြစ်သည်။ ဆေးပုံခွဲခြားစနစ် မချိတ်ဆက်ရသေးပါ။",
      removePhoto: "ပုံဖယ်မည်",
      invalidPhoto:
        "8 MB ထက်မပိုသော JPG၊ PNG သို့မဟုတ် WebP ပုံကို ရွေးပါ။",
      unreadablePhoto:
        "ဤပုံကို မဖွင့်နိုင်ပါ။ အခြားပုံရွေးပါ။",

      catalogueLabel: "ဆေးစာရင်းကို ကြည့်ရှုပါ",
      catalogueTitle: "သင်သိလိုသော ဆေးကို ရှာပါ",
      categoryLabel: "အမျိုးအစား",
      allCategories: "အမျိုးအစားအားလုံး",
      loading: "ဆေးစာရင်း ဖွင့်နေသည်…",

      

      emptyTitle: "ကိုက်ညီသော ဆေးမတွေ့ပါ",
      emptyDescription:
        "စာလုံးပေါင်း သို့မဟုတ် အမျိုးအစား ပြောင်းရှာပါ။",
      clearFilters: "ရှာဖွေမှု ပြန်စမည်",

      loadErrorTitle: "ဆေးစာရင်းကို မဖွင့်နိုင်ပါ",
      loadErrorDescription:
        "JSON ဆေးစာရင်း မရရှိပါ။ ဖိုင်တည်နေရာကို စစ်ဆေးပြီး ပြန်ကြိုးစားပါ။",
      retry: "ပြန်ကြိုးစားမည်",

      medicineDetails: "ဆေးဝါးအချက်အလက်",
      close: "ပိတ်မည်",
      viewDetails: "အချက်အလက်ဖတ်ရန်",
      selectionHint:
        "ရှာဖွေမှုအောက်က အကြံပြုစာရင်း သို့မဟုတ် ဆေးအမည်စာရင်းမှ ဆေးတစ်ခုရွေးပြီး ဤနေရာတွင် အချက်အလက်များ ဖတ်ရှုနိုင်ပါတယ်။",

      ingredients: "အာနိသင်ရှိသော ပါဝင်ပစ္စည်းများ",
      uses: "အသုံးပြုမှု",
      formulations: "နမူနာဆေးပုံစံနှင့် ပါဝင်အား",
      howToUse: "သုံးစွဲနည်း / အရေးကြီးသတိချက်",
      sideEffects: "ဘေးထွက်ဆိုးကျိုးအချို့",
      contraindications: "မသုံးသင့်သော အခြေအနေအချို့",
      precautions: "သတိပြုရန်",
      interactions: "ဆေးအပြန်အလှန်သက်ရောက်မှုအချို့",
      pregnancy: "ကိုယ်ဝန်နှင့် နို့တိုက်ခြင်း",
      monitoring: "စောင့်ကြည့်မှုနှင့် ဆေးကုသမှုလိုအပ်ချိန်",
      missedDose: "ဆေးမေ့သောက်ခြင်း",
      overdose: "ဆေးပမာဏလွန်ခြင်း သတိပေးချက်",
      storage: "သိမ်းဆည်းနည်း",

      notPrepared: "အချက်အလက် မပြင်ဆင်ရသေးပါ။",
      detailsWarning:
        "မူကြမ်းအချက်အလက်ဖြစ်၍ စာရင်းများ မပြည့်စုံနိုင်ပါ။ မသုံးမီ ဆေးအညွှန်းကို စစ်ဆေး၍ ကျန်းမာရေးပညာရှင်ထံ အကြံဉာဏ်တောင်းပါ။",

      footer: "ဆေးဝါးအချက်အလက်ကို ပိုမိုလွယ်ကူစွာ ရှာဖွေရန်။"
    }
  };

  function initialisePage() {
    const $ = id => document.getElementById(id);

    const searchInput = $("search");
    const categorySelect = $("category");
    const grid = $("medicine-grid");
    const resultCount = $("result-count");
    const emptyState = $("empty-state");
    const loadError = $("load-error");

    if (
      !searchInput ||
      !categorySelect ||
      !grid ||
      !resultCount ||
      !emptyState ||
      !loadError
    ) {
      console.error(
        "Find Medicine: required HTML element IDs are missing."
      );
      return;
    }

    let language = readLanguage();
    let medicines = [];
    let activeMedicine = null;
    let currentPage = 1;
    let loading = true;
    let catalogueFailed = false;

    let loadVersion = 0;
    let requestController = null;

    let suggestionMatches = [];
    let activeSuggestionIndex = -1;

    let photoURL = "";
    let photoMessageKey = "";

    function element(tag, className, text) {
      const node = document.createElement(tag);

      if (className) {
        node.className = className;
      }

      if (text !== undefined) {
        node.textContent = text;
      }

      return node;
    }

    function readLanguage() {
      try {
        return localStorage.getItem(LANGUAGE_KEY) === "my"
          ? "my"
          : "en";
      } catch {
        return "en";
      }
    }

    function t(key) {
      return (
        translations[language][key] ||
        translations.en[key] ||
        key
      );
    }

    function label(en, my) {
      return language === "my" ? my : en;
    }

    function localised(value) {
      if (typeof value === "string") return value;
      if (!value || typeof value !== "object") return "";

      const text = value[language] || value.en || value.my;

      return typeof text === "string" ? text : "";
    }

    function normalise(value) {
      return String(value || "")
        .normalize("NFC")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }

    function number(value) {
      return new Intl.NumberFormat(
        language === "my" ? "my-MM" : "en"
      ).format(value);
    }

    function medicineName(medicine) {
      return language === "my"
        ? medicine.generic_name_my || medicine.generic_name_en
        : medicine.generic_name_en || medicine.generic_name_my;
    }

    function isDraft(medicine) {
      return medicine.review?.approved_for_patient_use !== true;
    }

    function lines(value) {
      const values = Array.isArray(value)
        ? value
        : value
          ? [value]
          : [];

      return [
        ...new Set(
          values.map(localised).filter(text => text.trim())
        )
      ];
    }

    /* --------------------------------------------------
       Browse panel and pagination
    -------------------------------------------------- */

    let namePanel = document.querySelector(".medicine-name-panel");

    if (!namePanel) {
      namePanel = element("section", "medicine-name-panel");
    }

    namePanel.setAttribute(
      "aria-labelledby",
      "medicine-name-heading"
    );

    const nameHeader = element("div", "medicine-name-heading");

    const nameHeading = element("h2");
    nameHeading.id = "medicine-name-heading";

    const nameCount = element("p");
    nameCount.id = "medicine-name-count";
    nameCount.setAttribute("role", "status");
    nameCount.setAttribute("aria-live", "polite");

    const nameList = element("div", "medicine-name-list");
    nameList.id = "medicine-name-list";

    const pagination = element("nav", "medicine-pagination");
    pagination.hidden = true;

    const browseControls = element(
  "div",
  "medicine-browse-controls"
);

const categoryField = categorySelect.closest(".category-field");

if (categoryField) {
  browseControls.append(categoryField);
}

browseControls.append(nameCount);

// Title and description
const browseIntro = element(
  "div",
  "medicine-browse-intro"
);

const browseDescription = element(
  "p",
  "medicine-browse-description"
);

browseDescription.id = "medicine-browse-description";

browseIntro.append(
  nameHeading,
  browseDescription
);

nameHeader.append(
  browseIntro,
  browseControls
);

    namePanel.replaceChildren(
      nameHeader,
      nameList,
      pagination
    );

    const hero = document.querySelector(".hero");

    if (hero) {
      hero.after(namePanel);
    } else {
      grid.before(namePanel);
    }

    /* --------------------------------------------------
       Search dropdown
    -------------------------------------------------- */

    const searchBox =
      searchInput.closest(".search-box") ||
      searchInput.parentElement;

    // Remove a previously inserted dropdown, if present.
    $("medicine-suggestions")?.remove();

    searchBox
      .querySelector(".medicine-search-status")
      ?.remove();

    const suggestions = element("div", "medicine-suggestions");

    suggestions.id = "medicine-suggestions";
    suggestions.hidden = true;
    suggestions.setAttribute("role", "listbox");

    const searchStatus = element(
      "span",
      "medicine-search-status"
    );

    searchStatus.setAttribute("role", "status");
    searchStatus.setAttribute("aria-live", "polite");

    searchBox.append(suggestions, searchStatus);

    searchInput.setAttribute("role", "combobox");
    searchInput.setAttribute("aria-autocomplete", "list");
    searchInput.setAttribute("aria-haspopup", "listbox");
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.setAttribute("aria-controls", suggestions.id);
    searchInput.setAttribute("autocomplete", "off");

    function closeSearchSuggestions() {
      suggestions.hidden = true;
      searchStatus.textContent = "";

      searchInput.setAttribute("aria-expanded", "false");
      searchInput.removeAttribute("aria-activedescendant");

      activeSuggestionIndex = -1;
    }

    function showSuggestionMessage(message) {
      const option = element(
        "div",
        "medicine-suggestion",
        message
      );

      option.setAttribute("role", "option");
      option.setAttribute("aria-disabled", "true");

      suggestions.replaceChildren(option);
      suggestions.hidden = false;

      searchInput.setAttribute("aria-expanded", "true");
      searchStatus.textContent = message;
    }

    function chooseSuggestion(medicine) {
      searchInput.value = medicineName(medicine);
      closeSearchSuggestions();
      openDetails(medicine);
    }

    function highlightSuggestion(index) {
      if (!suggestionMatches.length) return;

      activeSuggestionIndex =
        (index + suggestionMatches.length) %
        suggestionMatches.length;

      const options = [
        ...suggestions.querySelectorAll(
          'button[role="option"]'
        )
      ];

      options.forEach((option, optionIndex) => {
        const active =
          optionIndex === activeSuggestionIndex;

        option.classList.toggle("is-active", active);

        option.setAttribute(
          "aria-selected",
          String(active)
        );
      });

      const selected = options[activeSuggestionIndex];

      if (selected) {
        searchInput.setAttribute(
          "aria-activedescendant",
          selected.id
        );

        selected.scrollIntoView({
          block: "nearest"
        });
      }
    }

    function renderSearchSuggestions() {
      const query = normalise(searchInput.value);

      suggestions.replaceChildren();
      suggestionMatches = [];
      activeSuggestionIndex = -1;

      searchInput.removeAttribute("aria-activedescendant");

      if (!query) {
        closeSearchSuggestions();
        return;
      }

      if (loading || catalogueFailed) {
        showSuggestionMessage(
          loading
            ? t("loading")
            : t("loadErrorDescription")
        );
        return;
      }

      // Search ALL records, independently of browse pagination.
      suggestionMatches = medicines.filter(medicine =>
        [
          medicine.generic_name_en,
          medicine.generic_name_my
        ].some(name =>
          typeof name === "string" &&
          name.trim() &&
          normalise(name).startsWith(query)
        )
      );

      if (!suggestionMatches.length) {
        showSuggestionMessage(t("emptyTitle"));
        return;
      }

      const fragment = document.createDocumentFragment();

      suggestionMatches.forEach((medicine, index) => {
        const option = element(
          "button",
          "medicine-suggestion"
        );

        option.type = "button";
        option.tabIndex = -1;
        option.id = `medicine-suggestion-${index}`;

        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");

        option.append(
          element(
            "span",
            "suggestion-primary",
            medicineName(medicine)
          )
        );

        const secondaryName = language === "my"
          ? medicine.generic_name_en
          : medicine.generic_name_my;

        if (secondaryName) {
          const secondary = element(
            "span",
            "suggestion-secondary",
            secondaryName
          );

          secondary.lang = language === "my" ? "en" : "my";
          option.append(secondary);
        }

        option.addEventListener("mousedown", event => {
          event.preventDefault();
        });

        option.addEventListener("click", () => {
          chooseSuggestion(medicine);
        });

        fragment.append(option);
      });

      suggestions.append(fragment);
      suggestions.hidden = false;

      searchInput.setAttribute("aria-expanded", "true");

      searchStatus.textContent = label(
        `${suggestionMatches.length} suggestions available. Use arrow keys to choose.`,
        `ဆေး ${number(suggestionMatches.length)} မျိုး တွေ့ပါသည်။ ရွေးရန် မြားခလုတ်များ သုံးနိုင်ပါသည်။`
      );
    }

    /* --------------------------------------------------
       Inline information panel
    -------------------------------------------------- */

    const oldPanel = $("medicine-dialog");

    if (
      oldPanel?.tagName === "DIALOG" &&
      oldPanel.open
    ) {
      oldPanel.close();
    }

    const infoPanel = element(
      "section",
      "medicine-inline-panel"
    );

    infoPanel.id = "medicine-dialog";
    infoPanel.hidden = true;
    infoPanel.setAttribute(
      "aria-labelledby",
      "detail-title"
    );

    const toolbar = element("div", "dialog-toolbar");

    const detailLabel = element("span", "detail-eyebrow");
    detailLabel.dataset.i18n = "medicineDetails";

    const closeButton = element("button", "close-button");

    closeButton.id = "close-dialog";
    closeButton.type = "button";
    closeButton.dataset.i18n = "close";

    const detailContent = element("div");
    detailContent.id = "detail-content";

    toolbar.append(detailLabel, closeButton);
    infoPanel.append(toolbar, detailContent);

    if (oldPanel) {
      oldPanel.replaceWith(infoPanel);
    }

    grid.after(infoPanel);

    /* --------------------------------------------------
       Categories and language
    -------------------------------------------------- */

    function buildCategories() {
      const selected = categorySelect.value;
      const categories = new Map();

      for (const medicine of medicines) {
        if (medicine.category?.code) {
          categories.set(
            medicine.category.code,
            medicine.category
          );
        }
      }

      categorySelect.replaceChildren(
        new Option(t("allCategories"), "")
      );

      [...categories.entries()]
        .sort((a, b) =>
          localised(a[1]).localeCompare(localised(b[1]))
        )
        .forEach(([code, category]) => {
          categorySelect.add(
            new Option(localised(category), code)
          );
        });

      if (categories.has(selected)) {
        categorySelect.value = selected;
      }
    }

    function renderLanguage() {
      document.documentElement.lang = language;
      document.title = t("pageTitle");

      browseDescription.textContent = label(
    "Select a medicine name to read its uses and detailed information below.",
    "ဆေးအမည်တစ်ခုကို နှိပ်ပြီး အသုံးပြုမှုနှင့် အသေးစိတ်အချက်အလက်များကို အောက်တွင် ဖတ်ရှုပါ။"
  );

      document.querySelectorAll("[data-i18n]").forEach(node => {
        const key = node.dataset.i18n;

        if (translations[language][key] !== undefined) {
          node.textContent = t(key);
        }
      });

      document.querySelectorAll("[data-language]").forEach(button => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.language === language)
        );
      });

      searchInput.placeholder = t("searchPlaceholder");
      nameHeading.textContent = t("browseTitle");

      suggestions.setAttribute(
        "aria-label",
        t("searchLabel")
      );

      const preview = $("photo-preview");

      if (preview) {
        preview.alt = t("previewTitle");
      }

      buildCategories();
      renderMedicines();
      renderPhotoMessage();

      if (activeMedicine) {
        renderDetails(activeMedicine);
      }

      if (document.activeElement === searchInput) {
        renderSearchSuggestions();
      } else {
        closeSearchSuggestions();
      }
    }

    /* --------------------------------------------------
       Browse list: independent of search
    -------------------------------------------------- */

    function showNameMessage(text) {
      nameList.append(
        element("p", "medicine-name-message", text)
      );
    }

    function renderMedicines() {
      nameList.replaceChildren();
      pagination.replaceChildren();
      grid.replaceChildren();

      nameList.setAttribute("aria-busy", String(loading));
      grid.setAttribute("aria-busy", String(loading));

      nameCount.textContent = "";
      pagination.hidden = true;
      emptyState.hidden = true;
      loadError.hidden = !catalogueFailed;
      grid.hidden = true;

      const draftNotice = $("draft-notice");

      if (draftNotice) {
        draftNotice.hidden =
          loading ||
          catalogueFailed ||
          !medicines.some(isDraft);
      }

      infoPanel.hidden =
        !activeMedicine || loading || catalogueFailed;

      if (loading) {
        resultCount.textContent = t("loading");
        showNameMessage(t("loading"));
        return;
      }

      if (catalogueFailed) {
        resultCount.textContent = "";
        showNameMessage(t("loadErrorDescription"));
        return;
      }

      const selectedCategory = categorySelect.value;

      // Search input is intentionally not used here.
      const browseRecords = medicines.filter(medicine =>
        !selectedCategory ||
        medicine.category?.code === selectedCategory
      );

      const totalPages = Math.max(
        1,
        Math.ceil(browseRecords.length / PAGE_SIZE)
      );

      currentPage = Math.max(
        1,
        Math.min(currentPage, totalPages)
      );

      const startIndex = (currentPage - 1) * PAGE_SIZE;

      const visible = browseRecords.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );

      const firstNumber = browseRecords.length
        ? startIndex + 1
        : 0;

      const lastNumber = startIndex + visible.length;

      const countText = label(
        `Showing ${number(firstNumber)}–${number(lastNumber)} of ${number(browseRecords.length)} medicines`,
        `ဆေး ${number(browseRecords.length)} မျိုးအနက် ${number(firstNumber)}–${number(lastNumber)} ကို ပြထားသည်`
      );

      resultCount.textContent = countText;
      nameCount.textContent = countText;

      emptyState.hidden = browseRecords.length !== 0;

      if (!visible.length) {
        showNameMessage(t("emptyDescription"));
        return;
      }

      const fragment = document.createDocumentFragment();

      for (const medicine of visible) {
        const button = element(
          "button",
          "medicine-name-button",
          medicineName(medicine)
        );

        button.type = "button";

        button.setAttribute(
          "aria-label",
          `${t("viewDetails")}: ${medicineName(medicine)}`
        );

        if (medicine === activeMedicine) {
          button.setAttribute("aria-current", "true");
        }

        button.addEventListener("click", () => {
          openDetails(medicine);
        });

        fragment.append(button);
      }

      nameList.append(fragment);

      function addPageButton(
        text,
        targetPage,
        accessibleLabel,
        disabled = false,
        current = false
      ) {
        const button = element(
          "button",
          "medicine-page-button",
          text
        );

        button.type = "button";
        button.disabled = disabled;
        button.setAttribute("aria-label", accessibleLabel);

        if (current) {
          button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {
          currentPage = targetPage;
          renderMedicines();

          pagination
            .querySelector('[aria-current="page"]')
            ?.focus({ preventScroll: true });
        });

        pagination.append(button);
      }

      addPageButton(
        "«",
        1,
        label("First page", "ပထမဆုံးစာမျက်နှာ"),
        currentPage === 1
      );

      addPageButton(
        "‹",
        currentPage - 1,
        label("Previous page", "ရှေ့စာမျက်နှာ"),
        currentPage === 1
      );

      for (let page = 1; page <= totalPages; page++) {
        addPageButton(
          number(page),
          page,
          label(
            `Page ${page}`,
            `စာမျက်နှာ ${number(page)}`
          ),
          false,
          page === currentPage
        );
      }

      addPageButton(
        "›",
        currentPage + 1,
        label("Next page", "နောက်စာမျက်နှာ"),
        currentPage === totalPages
      );

      addPageButton(
        "»",
        totalPages,
        label("Last page", "နောက်ဆုံးစာမျက်နှာ"),
        currentPage === totalPages
      );

      pagination.setAttribute(
        "aria-label",
        label(
          "Medicine catalogue pagination",
          "ဆေးစာရင်း စာမျက်နှာများ"
        )
      );

      pagination.hidden = false;

      if (!activeMedicine) {
        grid.hidden = false;

        grid.append(
          element(
            "p",
            "medicine-selection-hint",
            t("selectionHint")
          )
        );
      }
    }

    /* --------------------------------------------------
       General-information reader
    -------------------------------------------------- */

    function openDetails(medicine) {
      closeSearchSuggestions();

      activeMedicine = medicine;

      renderMedicines();
      renderDetails(medicine);

      infoPanel.hidden = false;

      const header = document.querySelector(".site-header");
      const offset = header?.getBoundingClientRect().height || 0;

      infoPanel.style.scrollMarginTop = `${offset + 20}px`;

      const title = $("detail-title");

      if (title) {
        title.tabIndex = -1;
        title.focus({ preventScroll: true });
      }

      infoPanel.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    }

    function addNote(parent, value, className) {
      const text = localised(value);

      if (text) {
        parent.append(
          element(
            "p",
            className || "medicine-detail-note",
            text
          )
        );
      }
    }

    function addSection(title, values) {
      const section = element("section", "detail-section");
      section.append(element("h3", "", title));

      const content = lines(values);

      if (content.length) {
        const list = element("ul");

        for (const text of content) {
          list.append(element("li", "", text));
        }

        section.append(list);
      } else {
        section.append(
          element("p", "", t("notPrepared"))
        );
      }

      detailContent.append(section);
      return section;
    }

    function formatAge(age) {
      if (!age) return "";

      const years = Number(age.years || 0);
      const months = Number(age.months || 0);
      const parts = [];

      if (years || !months) {
        parts.push(
          label(
            `${years} years`,
            `${number(years)} နှစ်`
          )
        );
      }

      if (months) {
        parts.push(
          label(
            `${months} months`,
            `${number(months)} လ`
          )
        );
      }

      return parts.join(" ");
    }

    function ageRange(row) {
      const explicit = localised(row.age_display);

      if (explicit) return explicit;

      const minimum = formatAge(row.age_min_inclusive);
      const maximum = formatAge(row.age_max_exclusive);

      if (minimum && maximum) {
        return label(
          `${minimum} to under ${maximum}`,
          `${minimum} မှ ${maximum} မပြည့်မီ`
        );
      }

      if (minimum) {
        return label(
          `${minimum} and above`,
          `${minimum} နှင့်အထက်`
        );
      }

      if (maximum) {
        return label(
          `Under ${maximum}`,
          `${maximum} အောက်`
        );
      }

      return label(
        "See product restrictions",
        "ဆေးအလိုက် ကန့်သတ်ချက်ကို ကြည့်ပါ"
      );
    }

    function weightText(weight) {
      if (!weight) return "";
      if (typeof weight === "string") return weight;

      return (
        (
          language === "my"
            ? weight.display_my || weight.display_en
            : weight.display_en || weight.display_my
        ) ||
        localised(weight)
      );
    }

    function addDosageTable(title, rows, childTable) {
      const section = element("section", "detail-section");
      section.append(element("h3", "", title));

      const wrapper = element("div", "medicine-table-wrap");

      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", title);

      const table = element("table", "medicine-dose-table");
      table.setAttribute("aria-label", title);

      const headings = [
        childTable
          ? label("Weight / age", "အလေးချိန် / အသက်")
          : label("Population / age", "လူနာအုပ်စု / အသက်"),

        label("Product / indication", "ဆေးပုံစံ / ရောဂါ"),
        label("Dose", "ဆေးပမာဏ"),
        label("Interval", "အကြိမ်ခြား"),

        label(
          "Daily limit / stated regimen",
          "နေ့စဉ်ကန့်သတ်ချက် / ဖော်ပြကုသပုံ"
        ),

        label(
          "Reference context / notes",
          "ကိုးကားအခြေအနေ / မှတ်ချက်"
        )
      ];

      const thead = element("thead");
      const headerRow = element("tr");

      for (const text of headings) {
        const th = element("th", "", text);
        th.scope = "col";
        headerRow.append(th);
      }

      thead.append(headerRow);

      const tbody = element("tbody");

      function addCell(tr, main, secondary) {
        const td = element("td", "", main || "—");

        if (secondary) {
          td.append(element("small", "", secondary));
        }

        tr.append(td);
      }

      if (Array.isArray(rows) && rows.length) {
        for (const row of rows) {
          const tr = element("tr");

          addCell(
            tr,
            childTable
              ? weightText(row.weight)
              : localised(row.population),
            ageRange(row)
          );

          addCell(
            tr,
            language === "my"
              ? row.formulation_my || localised(row.formulation)
              : localised(row.formulation),
            localised(row.indication)
          );

          addCell(tr, localised(row.dose));
          addCell(tr, localised(row.interval));

          addCell(
            tr,
            localised(row.maximum_in_24_hours)
          );

          addCell(
            tr,
            localised(row.reference_region),
            localised(row.note)
          );

          tbody.append(tr);
        }
      } else {
        const tr = element("tr");
        const td = element("td", "", t("notPrepared"));

        td.colSpan = headings.length;
        tr.append(td);
        tbody.append(tr);
      }

      table.append(thead, tbody);
      wrapper.append(table);
      section.append(wrapper);
      detailContent.append(section);
    }

    function renderDetails(medicine) {
      detailContent.replaceChildren();

      const title = element(
        "h2",
        "",
        [
          medicine.generic_name_en,
          medicine.generic_name_my
        ]
          .filter(Boolean)
          .join(" · ")
      );

      title.id = "detail-title";
      detailContent.append(title);

      addNote(
        detailContent,
        medicine.category,
        "medicine-detail-category"
      );

      if (isDraft(medicine)) {
        addNote(
          detailContent,
          t("detailsWarning"),
          "notice detail-warning"
        );
      }

      addNote(
        detailContent,
        medicine.key_information,
        "medicine-key-information"
      );

      const ingredients = Array.isArray(medicine.ingredients)
        ? medicine.ingredients.map(ingredient => {
            if (typeof ingredient === "string") {
              return ingredient;
            }

            return language === "my"
              ? ingredient.name_my || ingredient.name_en || ""
              : ingredient.name_en || ingredient.name_my || "";
          })
        : [];

      const ingredientSection = addSection(
        t("ingredients"),
        ingredients
      );

      addNote(
        ingredientSection,
        medicine.ingredient_scope
      );

      addSection(t("uses"), medicine.uses);

      const forms = Array.isArray(medicine.formulations)
        ? medicine.formulations.map(form => {
            if (typeof form === "string") return form;

            const strength =
              typeof form.strength === "string"
                ? form.strength
                : form.strength?.display || "";

            return [
              localised(form.dosage_form),
              localised(form.route),
              strength
            ]
              .filter(Boolean)
              .join(" · ");
          })
        : [];

      addSection(t("formulations"), forms);
      addSection(t("howToUse"), medicine.how_to_use);
      addSection(t("sideEffects"), medicine.side_effects);

      addSection(
        t("contraindications"),
        medicine.contraindications
      );

      addSection(t("precautions"), medicine.precautions);

      const interactions = Array.isArray(medicine.drug_interactions)
        ? medicine.drug_interactions.map(item => {
            const text = localised(item);

            return item?.related_ingredient
              ? `${item.related_ingredient}: ${text}`
              : text;
          })
        : [];

      addSection(t("interactions"), interactions);

      const pregnancy = medicine.pregnancy_and_breastfeeding;

      const pregnancySection = addSection(
        t("pregnancy"),
        pregnancy?.guidance || pregnancy
      );

      if (
        pregnancy?.guidance_scope ===
        "category_context_not_individual_clearance"
      ) {
        addNote(
          pregnancySection,
          label(
            "This includes category-level guidance; individual pregnancy and breastfeeding suitability still requires review.",
            "ဤအပိုင်းတွင် ဆေးအုပ်စုဆိုင်ရာညွှန်ကြားချက် ပါဝင်သည်။ တစ်ဦးချင်း ကိုယ်ဝန်၊ နို့တိုက်အခြေအနေအတွက် သင့်မသင့် သီးခြားစစ်ဆေးရန်လိုသည်။"
          )
        );
      }

      addSection(
        t("monitoring"),
        medicine.monitoring_and_when_to_seek_help
      );

      addSection(t("missedDose"), medicine.missed_dose);
      addSection(t("overdose"), medicine.overdose_warning);
      addSection(t("storage"), medicine.storage);

      const dosage = medicine.dosage || {};

      addNote(
        detailContent,
        dosage.table_interpretation,
        "medicine-key-information"
      );

      addDosageTable(
        label(
          "Table 1 · Formulation and dosage",
          "ဇယား ၁ · ဆေးပုံစံနှင့် ဆေးပမာဏ"
        ),
        dosage.table_1_formulation_dosage,
        false
      );

      addDosageTable(
        label(
          "Table 2 · Child weight–age–dose",
          "ဇယား ၂ · ကလေး အလေးချိန်–အသက်–ပမာဏ"
        ),
        dosage.table_2_child_weight_age_dose,
        true
      );

        addNote(
    detailContent,
    medicine.clinical_scope,
    "medicine-detail-scope"
  );

  window.MedicineAudio.mount({
    container: detailContent,
    medicine,
    language,

    headings: {
      use_safety: t("howToUse"),
      precautions_interactions: t("precautions"),
      overdose_storage: t("overdose")
    }
  });
}

    /* --------------------------------------------------
       Load JSON catalogue
    -------------------------------------------------- */

    async function loadCatalogue() {
      window.MedicineAudio.stop();
      const version = ++loadVersion;

      requestController?.abort();

      const controller = new AbortController();
      requestController = controller;

      const timeout = window.setTimeout(
        () => controller.abort(),
        15000
      );

      loading = true;
      catalogueFailed = false;
      activeMedicine = null;

      closeSearchSuggestions();
      renderMedicines();

      try {
        const response = await fetch(CATALOGUE_URL, {
          cache: "no-cache",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();

        const rows = Array.isArray(payload)
          ? payload
          : payload?.medicines;

        if (
          !Array.isArray(rows) ||
          !rows.length ||
          !rows.every(row =>
            row &&
            typeof row.generic_name_en === "string" &&
            row.generic_name_en.trim()
          )
        ) {
          throw new Error("Invalid medicine JSON format.");
        }

        if (version !== loadVersion) return;

        medicines = [...rows].sort((a, b) =>
          a.generic_name_en.localeCompare(
            b.generic_name_en,
            "en",
            {
              sensitivity: "base",
              numeric: true
            }
          )
        );

        currentPage = 1;
        buildCategories();
      } catch (error) {
        if (version !== loadVersion) return;

        medicines = [];
        catalogueFailed = true;

        console.error(
          "Cannot load medicine catalogue:",
          CATALOGUE_URL,
          error
        );
      } finally {
        window.clearTimeout(timeout);

        if (version === loadVersion) {
          loading = false;
          requestController = null;

          renderMedicines();

          if (document.activeElement === searchInput) {
            renderSearchSuggestions();
          }
        }
      }
    }

    /* --------------------------------------------------
       Search events
    -------------------------------------------------- */

    searchInput.addEventListener(
      "input",
      renderSearchSuggestions
    );

    searchInput.addEventListener(
      "focus",
      renderSearchSuggestions
    );

    searchInput.addEventListener("keydown", event => {
      if (event.key === "Escape" || event.key === "Tab") {
        closeSearchSuggestions();
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();

        if (suggestions.hidden) {
          renderSearchSuggestions();
        }

        if (!suggestionMatches.length) return;

        if (event.key === "ArrowDown") {
          highlightSuggestion(activeSuggestionIndex + 1);
        } else {
          highlightSuggestion(
            activeSuggestionIndex < 0
              ? suggestionMatches.length - 1
              : activeSuggestionIndex - 1
          );
        }

        return;
      }

      if (
        event.key === "Enter" &&
        !suggestions.hidden
      ) {
        if (activeSuggestionIndex >= 0) {
          event.preventDefault();

          chooseSuggestion(
            suggestionMatches[activeSuggestionIndex]
          );
        } else if (suggestionMatches.length === 1) {
          event.preventDefault();
          chooseSuggestion(suggestionMatches[0]);
        }
      }
    });

    document.addEventListener("click", event => {
      if (!searchBox.contains(event.target)) {
        closeSearchSuggestions();
      }
    });

    searchBox.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!searchBox.contains(document.activeElement)) {
          closeSearchSuggestions();
        }
      }, 0);
    });

    /* --------------------------------------------------
       Browse/category events
    -------------------------------------------------- */

    categorySelect.addEventListener("change", () => {
      currentPage = 1;
      closeSearchSuggestions();
      renderMedicines();
    });

    $("clear-filters")?.addEventListener("click", () => {
      searchInput.value = "";
      categorySelect.value = "";
      currentPage = 1;

      closeSearchSuggestions();
      renderMedicines();

      searchInput.focus();
    });

    $("retry")?.addEventListener("click", loadCatalogue);

    closeButton.addEventListener("click", () => {
  window.MedicineAudio.stop();

  activeMedicine = null;
  renderMedicines();

  searchInput.focus();
  closeSearchSuggestions();
});
    /* --------------------------------------------------
       Shared language preference
    -------------------------------------------------- */

    document.querySelectorAll("[data-language]").forEach(button => {
      button.addEventListener("click", () => {
        const selected = button.dataset.language;

        if (selected !== "en" && selected !== "my") return;

        language = selected;

        try {
          localStorage.setItem(LANGUAGE_KEY, language);
        } catch {
          // Saving the preference is optional.
        }

        renderLanguage();
      });
    });

    window.addEventListener("storage", event => {
      if (event.key === LANGUAGE_KEY) {
        language = readLanguage();
        renderLanguage();
      }
    });

    window.addEventListener("pageshow", () => {
      const saved = readLanguage();

      if (saved !== language) {
        language = saved;
        renderLanguage();
      }
    });

    /* --------------------------------------------------
       Photo preview
    -------------------------------------------------- */

    const photoInput = $("medicine-photo");
    const photoPreview = $("photo-preview");
    const photoPanel = $("photo-preview-panel");

    function renderPhotoMessage() {
      const status = $("photo-status");
      if (!status) return;

      status.hidden = !photoMessageKey;

      status.textContent = photoMessageKey
        ? t(photoMessageKey)
        : "";
    }

    function clearPhoto() {
      if (photoPreview) {
        photoPreview.onload = null;
        photoPreview.onerror = null;
        photoPreview.removeAttribute("src");
      }

      if (photoURL) {
        URL.revokeObjectURL(photoURL);
        photoURL = "";
      }

      if (photoInput) {
        photoInput.value = "";
      }

      if (photoPanel) {
        photoPanel.hidden = true;
      }

      if ($("photo-filename")) {
        $("photo-filename").textContent = "";
      }
    }

    if (photoInput && photoPreview && photoPanel) {
      photoInput.addEventListener("change", () => {
        const file = photoInput.files?.[0];
        if (!file) return;

        clearPhoto();

        photoMessageKey = "";
        renderPhotoMessage();

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];

        if (
          !allowedTypes.includes(file.type) ||
          file.size > 8 * 1024 * 1024
        ) {
          photoMessageKey = "invalidPhoto";
          renderPhotoMessage();
          return;
        }

        photoURL = URL.createObjectURL(file);
        const selectedURL = photoURL;

        photoPreview.onload = () => {
          if (photoURL !== selectedURL) return;

          if ($("photo-filename")) {
            $("photo-filename").textContent = file.name;
          }

          photoPanel.hidden = false;
        };

        photoPreview.onerror = () => {
          if (photoURL !== selectedURL) return;

          clearPhoto();

          photoMessageKey = "unreadablePhoto";
          renderPhotoMessage();
        };

        photoPreview.src = selectedURL;
      });
    }

    $("remove-photo")?.addEventListener("click", () => {
      clearPhoto();

      photoMessageKey = "";
      renderPhotoMessage();
    });

    /* Initial page */

    renderLanguage();
    loadCatalogue();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialisePage,
      { once: true }
    );
  } else {
    initialisePage();
  }
})();