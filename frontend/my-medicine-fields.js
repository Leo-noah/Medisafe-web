(() => {
  "use strict";

  const CATALOGUE_URL =
    "./data/myanmar-200-general-information-audio-prelinked.json";

  const nameInput = document.getElementById("medicine-name");
  const doseInput = document.getElementById("medicine-dose");
  const options = document.getElementById("mm-name-options");
  const unitButtons = [
    ...document.querySelectorAll("[data-dose-unit]")
  ];

  if (!nameInput || !doseInput || !options) return;

  let medicines = [];
  let matches = [];
  let activeIndex = -1;
  let selectedUnit = "";
  let dismissed = false;

  const normalise = value =>
    String(value || "").normalize("NFC").trim().toLowerCase();

  const isMyanmar = () =>
    document.documentElement.lang.startsWith("my");

  function closeSuggestions() {
    options.hidden = true;
    activeIndex = -1;

    nameInput.setAttribute("aria-expanded", "false");
    nameInput.removeAttribute("aria-activedescendant");
  }

  function preferredName(medicine) {
    return isMyanmar()
      ? medicine.generic_name_my || medicine.generic_name_en
      : medicine.generic_name_en || medicine.generic_name_my;
  }

  function chooseMedicine(index) {
    const medicine = matches[index];
    if (!medicine) return;

    nameInput.value = preferredName(medicine);
    dismissed = true;
    closeSuggestions();
    nameInput.focus();
  }

  function highlight(index) {
    activeIndex = index;

    [...options.children].forEach((button, buttonIndex) => {
      button.setAttribute(
        "aria-selected",
        String(buttonIndex === index)
      );
    });

    const activeOption = options.children[index];

    if (activeOption) {
      nameInput.setAttribute(
        "aria-activedescendant",
        activeOption.id
      );

      activeOption.scrollIntoView({ block: "nearest" });
    }
  }

  function renderSuggestions() {
    const query = normalise(nameInput.value);

    options.replaceChildren();
    activeIndex = -1;
    nameInput.removeAttribute("aria-activedescendant");

    if (!query || dismissed) {
      closeSuggestions();
      return;
    }

    matches = medicines.filter(medicine => {
      const names = [
        medicine.generic_name_en,
        medicine.generic_name_my,
        ...(Array.isArray(medicine.search_aliases)
          ? medicine.search_aliases
          : [])
      ];

      return names.some(name =>
        typeof name === "string" &&
        normalise(name).startsWith(query)
      );
    });

    matches.forEach((medicine, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.tabIndex = -1;
      button.id = `mm-name-option-${index}`;
      button.className = "mm-name-option";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", "false");

      button.textContent = [
        medicine.generic_name_en,
        medicine.generic_name_my
      ].filter(Boolean).join(" · ");

      // Keep input focus while selecting with a mouse.
      button.addEventListener("mousedown", event => {
        event.preventDefault();
      });

      button.addEventListener("click", () => {
        chooseMedicine(index);
      });

      options.append(button);
    });

    options.hidden = matches.length === 0;
    nameInput.setAttribute(
      "aria-expanded",
      String(matches.length > 0)
    );
  }

  nameInput.addEventListener("input", () => {
    dismissed = false;
    renderSuggestions();
  });

  nameInput.addEventListener("focus", () => {
    dismissed = false;
    renderSuggestions();
  });

  nameInput.addEventListener("keydown", event => {
    if (event.key === "Escape" || event.key === "Tab") {
      dismissed = true;
      closeSuggestions();
      return;
    }

    if (options.hidden || !matches.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlight((activeIndex + 1) % matches.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      highlight(
        activeIndex <= 0
          ? matches.length - 1
          : activeIndex - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      chooseMedicine(activeIndex);
    }
  });

  nameInput.addEventListener("blur", () => {
    // Allow a suggestion click to complete before closing.
    setTimeout(() => {
      if (!options.contains(document.activeElement)) {
        closeSuggestions();
      }
    }, 150);
  });

  document.addEventListener("click", event => {
    if (
      event.target instanceof Node &&
      !nameInput.parentElement.contains(event.target)
    ) {
      closeSuggestions();
    }
  });

  function setUnit(unit) {
    selectedUnit = unit;

    unitButtons.forEach(button => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.doseUnit === unit)
      );
    });

    // mg / mL require a positive numerical amount.
    // As written also allows instructions such as "1 tablet".
    if (unit) {
      doseInput.setAttribute("inputmode", "decimal");
      doseInput.setAttribute(
        "pattern",
        "(?:[0-9]+(?:\\.[0-9]+)?|\\.[0-9]+)"
      );
    } else {
      doseInput.removeAttribute("inputmode");
      doseInput.removeAttribute("pattern");
    }

    validateDose();
  }

  function validateDose() {
    doseInput.setCustomValidity("");

    if (!selectedUnit || !doseInput.value.trim()) return;

    const value = doseInput.value.trim();

    if (
      !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ||
      !Number.isFinite(Number(value)) ||
      Number(value) <= 0
    ) {
      doseInput.setCustomValidity(
        isMyanmar()
          ? "ပမာဏကို သုညထက်ကြီးသော ဂဏန်းဖြင့် ဖြည့်ပါ။ ဥပမာ 500 သို့မဟုတ် 2.5"
          : "Enter a number greater than zero, such as 500 or 2.5."
      );
    }
  }

  unitButtons.forEach(button => {
    button.addEventListener("click", () => {
      setUnit(button.dataset.doseUnit);
      doseInput.focus();
    });
  });

  doseInput.addEventListener("input", validateDose);

  function setDose(value = "") {
    const saved = String(value).trim();
    const match = saved.match(
      /^(\d+(?:\.\d+)?|\.\d+)\s*(mg|ml)$/i
    );

    if (match) {
      doseInput.value = match[1];
      setUnit(match[2].toLowerCase() === "mg" ? "mg" : "mL");
    } else {
      // Preserve existing free-text instructions.
      doseInput.value = saved;
      setUnit("");
    }

    closeSuggestions();
  }

  function renderLanguage() {
    const writtenButton = unitButtons.find(
      button => button.dataset.doseUnit === ""
    );

    if (writtenButton) {
      writtenButton.textContent = isMyanmar()
        ? "ညွှန်ကြားချက်အတိုင်း"
        : "As written";
    }

    validateDose();

    if (document.activeElement === nameInput) {
      renderSuggestions();
    }
  }

  window.MedicineFormFields = {
    getDose() {
      const amount = doseInput.value.trim();

      return selectedUnit
        ? `${amount} ${selectedUnit}`
        : amount;
    },

    setDose,

    reset() {
      setDose("");
    }
  };

  new MutationObserver(renderLanguage).observe(
    document.documentElement,
    {
      attributes: true,
      attributeFilter: ["lang"]
    }
  );

  renderLanguage();

  fetch(CATALOGUE_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Catalogue HTTP ${response.status}`);
      }

      return response.json();
    })
    .then(payload => {
      const records = Array.isArray(payload)
        ? payload
        : payload.medicines;

      if (!Array.isArray(records)) {
        throw new Error("Invalid medicine catalogue");
      }

      medicines = records
        .filter(item =>
          item &&
          (item.generic_name_en || item.generic_name_my)
        )
        .sort((a, b) =>
          String(a.generic_name_en || "").localeCompare(
            String(b.generic_name_en || ""),
            "en"
          )
        );

      if (document.activeElement === nameInput) {
        renderSuggestions();
      }
    })
    .catch(error => {
      console.error("Medicine suggestions unavailable:", error);

      // Manual medicine entry remains available.
      closeSuggestions();
    });
})();