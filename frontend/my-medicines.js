"use strict";

/*
  Frontend-only storage.
  No login verification, prescribing logic or automatic notifications.
*/

const STORAGE_KEY = "medisafe-personal-medicines-v1";

const translations = {
  en: {
    pageTitle: "My Medicines | MediSafe",
    findMedicine: "Find medicine",
    myMedicines: "My medicines",
    title: "Your medicines, organised.",
    description: "Keep your prescribed schedule and personal notes together.",
    today: "Today",
    storageNotice:
      "Saved only in this browser. Anyone using this browser profile may " +
      "be able to view these records. Clearing browser data can remove them.",
    addMedicine: "Add a medicine",
    editMedicine: "Edit medicine",
    medicineName: "Medicine name",
    namePlaceholder: "Enter the name on your medicine label",
    dose: "Prescribed amount per dose",
    dosePlaceholder: "Copy the amount from your prescription",
    doseHint:
      "Record your existing instructions. This page does not recommend doses.",
    times: "Scheduled times",
    timeLabel: "Scheduled time",
    addTime: "+ Add another time",
    removeTime: "Remove",
    startDate: "Start date",
    endDate: "End date — optional",
    notes: "Personal notes — optional",
    notesPlaceholder: "Instructions you want to remember",
    save: "Save medicine",
    saveChanges: "Save changes",
    cancel: "Cancel editing",
    yourRoutine: "YOUR DAILY ROUTINE",
    savedMedicines: "My medicine list",
    todayProgress: "Today's recorded doses",
    notificationNote:
      "Schedule display only. Automatic notifications are not connected.",
    emptyTitle: "Your list starts here",
    emptyDescription: "Add a medicine using the form.",
    edit: "Edit",
    delete: "Delete",
    taken: "Taken",
    markTaken: "Mark taken",
    noEndDate: "Ongoing",
    notStarted: "This schedule has not started yet.",
    finished: "This schedule has ended.",
    saved: "Medicine saved in this browser.",
    updated: "Medicine updated.",
    deleted: "Medicine removed.",
    changed: "Today's record updated.",
    storageError:
      "The change could not be saved. Check browser storage settings.",
    damagedData:
      "Saved data could not be read. No existing data has been overwritten. " +
      "Try the browser profile where you originally saved your list.",
    invalidName: "Enter a medicine name and prescribed amount.",
    invalidTime: "Enter at least one valid time. Remove duplicate times.",
    invalidDates: "The end date must be on or after the start date.",
    confirmDelete:
      "Delete this medicine and its saved taken records from this browser?",
  },

  my: {
    pageTitle: "ကိုယ်ပိုင်ဆေးစာရင်း | MediSafe",
    findMedicine: "ဆေးရှာရန်",
    myMedicines: "ကိုယ်ပိုင်ဆေးစာရင်း",
    title: "သင့်ဆေးစာရင်းကို စနစ်တကျ သိမ်းပါ။",
    description:
      "ညွှန်ကြားထားသော ဆေးသောက်ချိန်နှင့် ကိုယ်ပိုင်မှတ်စုများကို " +
      "တစ်နေရာတည်းတွင် သိမ်းထားပါ။",
    today: "ယနေ့",
    storageNotice:
      "ဒီ browser ထဲမှာသာ သိမ်းထားပါသည်။ တူညီသော browser profile ကို " +
      "သုံးသူများ ကြည့်နိုင်ပါသည်။ Browser data ဖျက်ပါက မှတ်တမ်းများ ပျောက်နိုင်သည်။",
    addMedicine: "ဆေးအသစ် ထည့်မည်",
    editMedicine: "ဆေးစာရင်း ပြင်မည်",
    medicineName: "ဆေးအမည်",
    namePlaceholder: "ဆေးအညွှန်းပါ အမည်ကို ဖြည့်ပါ",
    dose: "ညွှန်ကြားထားသော တစ်ကြိမ်သောက်ပမာဏ",
    dosePlaceholder: "ဆေးညွှန်းပါ ပမာဏအတိုင်း ဖြည့်ပါ",
    doseHint:
      "ရှိပြီးသားညွှန်ကြားချက်ကို မှတ်တမ်းတင်ရန်သာ ဖြစ်သည်။ ဆေးပမာဏ အကြံမပေးပါ။",
    times: "ဆေးသောက်မည့်အချိန်များ",
    timeLabel: "ဆေးသောက်ချိန်",
    addTime: "+ အချိန်ထပ်ထည့်မည်",
    removeTime: "ဖယ်မည်",
    startDate: "စသောက်မည့်ရက်",
    endDate: "ပြီးဆုံးရက် — မဖြည့်လည်းရ",
    notes: "ကိုယ်ပိုင်မှတ်စု — မဖြည့်လည်းရ",
    notesPlaceholder: "မှတ်ထားချင်သော ညွှန်ကြားချက်များ",
    save: "ဆေးစာရင်း သိမ်းမည်",
    saveChanges: "ပြင်ထားသည်များ သိမ်းမည်",
    cancel: "ပြင်ဆင်မှု ပယ်ဖျက်မည်",
    yourRoutine: "နေ့စဉ် ဆေးသောက်အစီအစဉ်",
    savedMedicines: "ကျွန်ုပ်၏ ဆေးစာရင်း",
    todayProgress: "ယနေ့ သောက်ပြီးမှတ်တမ်း",
    notificationNote:
      "အချိန်စာရင်းပြသမှုသာ ဖြစ်သည်။ အလိုအလျောက် သတိပေးစနစ် မချိတ်ဆက်ရသေးပါ။",
    emptyTitle: "သင့်ဆေးစာရင်းကို စတင်ပါ",
    emptyDescription: "ဖောင်တွင် ဆေးအချက်အလက် ဖြည့်ပြီး သိမ်းပါ။",
    edit: "ပြင်မည်",
    delete: "ဖျက်မည်",
    taken: "သောက်ပြီးပြီ",
    markTaken: "သောက်ပြီးဟု မှတ်မည်",
    noEndDate: "ဆက်လက်သောက်ရန်",
    notStarted: "ဤဆေးသောက်အစီအစဉ် မစတင်သေးပါ။",
    finished: "ဤဆေးသောက်အစီအစဉ် ပြီးဆုံးပါပြီ။",
    saved: "ဆေးစာရင်းကို ဒီ browser ထဲတွင် သိမ်းပြီးပါပြီ။",
    updated: "ဆေးစာရင်း ပြင်ဆင်ပြီးပါပြီ။",
    deleted: "ဆေးစာရင်းမှ ဖယ်ရှားပြီးပါပြီ။",
    changed: "ယနေ့မှတ်တမ်း ပြင်ဆင်ပြီးပါပြီ။",
    storageError:
      "ပြောင်းလဲမှုကို မသိမ်းနိုင်ပါ။ Browser storage ခွင့်ပြုချက်ကို စစ်ဆေးပါ။",
    damagedData:
      "သိမ်းထားသောမှတ်တမ်းကို မဖတ်နိုင်ပါ။ ရှိပြီးသားဒေတာကို " +
      "အစားမထိုးထားပါ။ မူလသိမ်းခဲ့သော browser profile ဖြင့် ပြန်ကြိုးစားပါ။",
    invalidName: "ဆေးအမည်နှင့် ညွှန်ကြားထားသော ပမာဏကို ဖြည့်ပါ။",
    invalidTime:
      "မှန်ကန်သောအချိန် အနည်းဆုံးတစ်ခု ဖြည့်ပါ။ အချိန်ထပ်နေပါက ဖယ်ပါ။",
    invalidDates: "ပြီးဆုံးရက်သည် စတင်ရက်ထက် မစောရပါ။",
    confirmDelete:
      "ဤဆေးနှင့် ဆက်စပ်သောက်ပြီးမှတ်တမ်းများကို ဒီ browser မှ ဖျက်မလား။",
  },
};

const form = document.getElementById("medicine-form");
const nameInput = document.getElementById("medicine-name");
const doseInput = document.getElementById("medicine-dose");
const notesInput = document.getElementById("medicine-notes");
const startInput = document.getElementById("start-date");
const endInput = document.getElementById("end-date");
const timeFields = document.getElementById("time-fields");
const list = document.getElementById("medicine-list");

let language = "my";
let editingId = null;
let statusKey = "";
let statusType = "";
let dataReadable = true;
let state = { medicines: [], logs: [] };

try {
  const savedLanguage = localStorage.getItem("medisafe-language");

  if (savedLanguage === "en" || savedLanguage === "my") {
    language = savedLanguage;
  }
} catch {
  // Saving a record will report unavailable storage.
}

function t(key) {
  return translations[language][key] || key;
}

/* Local calendar date, rather than UTC date. */
function todayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
function updateDateLimits() {
  const today = todayKey();

  const existing = editingId
    ? state.medicines.find(item => item.id === editingId)
    : null;

  // Preserve the original start date when editing an older record.
  startInput.min =
    existing?.startDate && existing.startDate < today
      ? existing.startDate
      : today;

  endInput.min = startInput.value || today;

  startInput.setCustomValidity("");
  endInput.setCustomValidity("");

  const keepingOriginalStart =
    existing && startInput.value === existing.startDate;

  if (
    startInput.value &&
    startInput.value < today &&
    !keepingOriginalStart
  ) {
    startInput.setCustomValidity(
      language === "my"
        ? "စသောက်မည့်ရက်ကို ယနေ့ သို့မဟုတ် နောင်ရက် ရွေးပါ။"
        : "Choose today or a future date as the start date."
    );
  }

  if (
    endInput.value &&
    endInput.value < (startInput.value || today)
  ) {
    endInput.setCustomValidity(
      language === "my"
        ? "ပြီးဆုံးရက်သည် စသောက်မည့်ရက်ထက် မစောရပါ။"
        : "The end date must be on or after the start date."
    );
  }
}

function newId() {
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function showStatus(key = "", type = "") {
  statusKey = key;
  statusType = type;

  const element = document.getElementById("status");

  element.hidden = !key;
  element.className = `status ${type}`;
  element.textContent = key ? t(key) : "";
}

function validStoredData(value) {
  return (
    value &&
    Array.isArray(value.medicines) &&
    Array.isArray(value.logs) &&
    value.medicines.every(
      (medicine) =>
        typeof medicine.id === "string" &&
        typeof medicine.name === "string" &&
        typeof medicine.dose === "string" &&
        typeof medicine.notes === "string" &&
        typeof medicine.startDate === "string" &&
        typeof medicine.endDate === "string" &&
        Array.isArray(medicine.times) &&
        medicine.times.every(
          (time) =>
            typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time),
        ),
    ) &&
    value.logs.every(
      (log) =>
        log &&
        typeof log.medicineId === "string" &&
        typeof log.date === "string" &&
        typeof log.time === "string" &&
        typeof log.takenAt === "string",
    )
  );
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = JSON.parse(saved);

    if (!validStoredData(parsed)) {
      throw new Error("Invalid saved data");
    }

    state = parsed;
  } catch {
    dataReadable = false;
    showStatus("damagedData", "error");
  }
}

/*
  Update the visible state only after writing succeeds.
  This prevents showing a change as saved when storage fails.
*/
function persist(nextState) {
  if (!dataReadable) {
    showStatus("damagedData", "error");
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
state = nextState;

window.dispatchEvent(
  new Event("medisafe:medicines-updated")
);

return true;
  } catch {
    showStatus("storageError", "error");
    return false;
  }
}

function addTimeField(value = "") {
  const row = document.createElement("div");
  row.className = "time-row";

  const input = document.createElement("input");
  input.type = "time";
  input.required = true;
  input.value = value;
  input.setAttribute("aria-label", t("timeLabel"));

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-time";
  remove.textContent = t("removeTime");

  remove.addEventListener("click", () => {
    if (timeFields.children.length === 1) {
      input.value = "";
      input.focus();
      return;
    }

    row.remove();
  });

  row.append(input, remove);
  timeFields.append(row);
}

function resetForm() {
  editingId = null;
  form.reset();
  window.MedicineFormFields?.reset();

  startInput.value = todayKey();
  endInput.value = "";

  timeFields.replaceChildren();
  addTimeField();

  document.getElementById("cancel-edit").hidden = true;

  updateFormLabels();
  updateDateLimits();
}

function updateFormLabels() {
  document.getElementById("form-title").textContent = t(
    editingId ? "editMedicine" : "addMedicine",
  );

  document.getElementById("save-button").textContent = t(
    editingId ? "saveChanges" : "save",
  );

  nameInput.placeholder = t("namePlaceholder");
  doseInput.placeholder = t("dosePlaceholder");
  notesInput.placeholder = t("notesPlaceholder");

  timeFields.querySelectorAll("input").forEach((input) => {
    input.setAttribute("aria-label", t("timeLabel"));
  });

  timeFields.querySelectorAll("button").forEach((button) => {
    button.textContent = t("removeTime");
  });
}

function activeToday(medicine) {
  const today = todayKey();

  return (
    medicine.startDate <= today &&
    (!medicine.endDate || medicine.endDate >= today)
  );
}

function takenToday(medicineId, time) {
  return state.logs.some(
    (log) =>
      log.medicineId === medicineId &&
      log.date === todayKey() &&
      log.time === time,
  );
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat(language === "my" ? "my-MM" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

function makeButton(textKey, handler, className = "") {
  const button = document.createElement("button");

  button.type = "button";
  button.className = className;
  button.textContent = t(textKey);
  button.addEventListener("click", handler);

  return button;
}

function editMedicine(medicine) {
  editingId = medicine.id;

  nameInput.value = medicine.name;
  doseInput.value = medicine.dose;
  window.MedicineFormFields?.setDose(medicine.dose);
  notesInput.value = medicine.notes;
  startInput.value = medicine.startDate;
  endInput.value = medicine.endDate;

  timeFields.replaceChildren();

  medicine.times.forEach((time) => addTimeField(time));

  document.getElementById("cancel-edit").hidden = false;

  updateFormLabels();
  showStatus();

  form.scrollIntoView({ behavior: "auto", block: "start" });
  nameInput.focus();
  updateDateLimits();
}

function deleteMedicine(id) {
  if (!window.confirm(t("confirmDelete"))) {
    return;
  }

  const nextState = {
    medicines: state.medicines.filter((medicine) => medicine.id !== id),
    logs: state.logs.filter((log) => log.medicineId !== id),
  };

  if (persist(nextState)) {
    if (editingId === id) {
      resetForm();
    }

    renderList();
    showStatus("deleted");
  }
}

function toggleTaken(medicine, time) {
  const today = todayKey();
  const alreadyTaken = takenToday(medicine.id, time);

  const logs = state.logs.filter(
    (log) =>
      !(
        log.medicineId === medicine.id &&
        log.date === today &&
        log.time === time
      ),
  );

  if (!alreadyTaken) {
    logs.push({
      medicineId: medicine.id,
      date: today,
      time,
      takenAt: new Date().toISOString(),

      // Preserve what was recorded at this moment.
      medicineName: medicine.name,
      dose: medicine.dose,
    });
  }

  if (persist({ medicines: state.medicines, logs })) {
    renderList();
    showStatus("changed");
  }
}

function renderProgress() {
  let total = 0;
  let done = 0;

  state.medicines.filter(activeToday).forEach((medicine) => {
    medicine.times.forEach((time) => {
      total++;

      if (takenToday(medicine.id, time)) {
        done++;
      }
    });
  });

  const formatter = new Intl.NumberFormat(language === "my" ? "my-MM" : "en");

  document.getElementById("progress-text").textContent =
    `${formatter.format(done)} / ${formatter.format(total)}`;

  const progress = document.getElementById("today-progress");

  progress.max = Math.max(total, 1);
  progress.value = done;
  progress.setAttribute("aria-label", t("todayProgress"));

  document.getElementById("today-date").textContent = formatDate(todayKey());
}

const medicineDisplayNames = new Map();

function normaliseMedicineName(value) {
  return String(value || "")
    .normalize("NFC")
    .trim()
    .toLowerCase();
}

function addDisplayName(entry) {
  const en = entry.generic_name_en;
  const my = entry.generic_name_my;

  if (typeof en !== "string" || typeof my !== "string") {
    return;
  }

  [en, my].forEach(name => {
    medicineDisplayNames.set(
      normaliseMedicineName(name),
      { en, my }
    );
  });
}

// Available immediately, before the catalogue finishes loading.
addDisplayName({
  generic_name_en: "Paracetamol",
  generic_name_my: "ပါရာစီတမော"
});

addDisplayName({
  generic_name_en: "Ibuprofen",
  generic_name_my: "အိုင်ဗျူပရိုဖန်"
});

function displayMedicineName(medicine) {
  const names = medicineDisplayNames.get(
    normaliseMedicineName(medicine.name)
  );

  return names
    ? names[language] || medicine.name
    : medicine.name;
}

function groupMedicinesByTime(medicines) {
  const groups = new Map();

  medicines.forEach(medicine => {
    [...new Set(medicine.times)].forEach(time => {
      if (!groups.has(time)) {
        groups.set(time, []);
      }

      groups.get(time).push(medicine);
    });
  });

  return [...groups.entries()].sort(
    ([a], [b]) => a.localeCompare(b)
  );
}

function medicineDateRange(medicine) {
  return (
    `${formatDate(medicine.startDate)} — ` +
    (
      medicine.endDate
        ? formatDate(medicine.endDate)
        : t("noEndDate")
    )
  );
}
function markGroupTaken(time) {
  const date = todayKey();

  const pending = state.medicines.filter(medicine =>
    activeToday(medicine) &&
    medicine.times.includes(time) &&
    !takenToday(medicine.id, time)
  );

  if (!pending.length) return;

  const takenAt = new Date().toISOString();

  const logs = [
    ...state.logs,
    ...pending.map(medicine => ({
      medicineId: medicine.id,
      date,
      time,
      takenAt,
      medicineName: medicine.name,
      dose: medicine.dose
    }))
  ];

  if (persist({ medicines: state.medicines, logs })) {
    renderList();
    showStatus("changed");
  }
}
function renderList() {
  list.replaceChildren();

  document.getElementById("empty-state").hidden =
    state.medicines.length !== 0;

  document.getElementById("medicine-count").textContent =
    new Intl.NumberFormat(
      language === "my" ? "my-MM" : "en"
    ).format(state.medicines.length);

  const groups = groupMedicinesByTime(state.medicines);

  groups.forEach(([time, medicines]) => {
    const card = document.createElement("article");
    card.className = "medicine-card grouped-medicine-card";

    const sameDates = medicines.every(medicine =>
      medicine.startDate === medicines[0].startDate &&
      medicine.endDate === medicines[0].endDate
    );

    medicines.forEach(medicine => {
      const item = document.createElement("section");
      item.className = "grouped-medicine-item";

      const heading = document.createElement("div");
      heading.className = "card-heading";

      const info = document.createElement("div");
info.className = "grouped-medicine-info";

const title = document.createElement("h3");
title.textContent = displayMedicineName(medicine);

const dose = document.createElement("p");
dose.className = "card-dose";
dose.textContent = medicine.dose;

info.append(title, dose);

      const actions = document.createElement("div");
      actions.className = "card-actions";

      actions.append(
        makeButton(
          "edit",
          () => editMedicine(medicine)
        ),
        makeButton(
          "delete",
          () => deleteMedicine(medicine.id),
          "delete"
        )
      );

      heading.append(info, actions);
      item.append(heading);

      // Different date ranges: show each medicine's own dates.
      if (!sameDates) {
        const dates = document.createElement("p");
        dates.className = "card-dates";
        dates.textContent = medicineDateRange(medicine);
        item.append(dates);
      }

      if (medicine.notes) {
        const notes = document.createElement("p");
        notes.className = "card-notes";
        notes.textContent = medicine.notes;
        item.append(notes);
      }

      if (activeToday(medicine)) {
        const taken = takenToday(medicine.id, time);

        const action = makeButton(
          taken ? "taken" : "markTaken",
          () => toggleTaken(medicine, time),
          "taken-button"
        );

        action.setAttribute(
          "aria-pressed",
          String(taken)
        );

        action.setAttribute(
          "aria-label",
          `${displayMedicineName(medicine)}, ` +
          `${medicine.dose}, ${time}: ` +
          t(taken ? "taken" : "markTaken")
        );

        item.append(action);
      } else {
        const note = document.createElement("p");
        note.className = "inactive-note";

        note.textContent = t(
          medicine.startDate > todayKey()
            ? "notStarted"
            : "finished"
        );

        item.append(note);
      }

      card.append(item);
    });

    // Identical date ranges: display once below all medicines.
    if (sameDates) {
      const dates = document.createElement("p");
      dates.className = "card-dates grouped-shared-dates";
      dates.textContent = medicineDateRange(medicines[0]);
      card.append(dates);
    }

    // Shared scheduled time always appears last.
    const footer = document.createElement("div");
    footer.className = "grouped-time";

    const timeTitle = document.createElement("span");
    timeTitle.textContent = t("timeLabel");

    const timeValue = document.createElement("strong");
    timeValue.textContent = time;

    const timeInfo = document.createElement("div");
timeInfo.className = "grouped-time-info";
timeInfo.append(timeTitle, timeValue);

const eligible = medicines.filter(activeToday);

const allTaken =
  eligible.length > 0 &&
  eligible.every(medicine =>
    takenToday(medicine.id, time)
  );

const markAll = makeButton(
  "markTaken",
  () => markGroupTaken(time),
  "group-mark-taken"
);

markAll.textContent = language === "my"
  ? (
      allTaken
        ? "အားလုံး သောက်ပြီးပါပြီ"
        : "အားလုံး သောက်ပြီးမှတ်မည်"
    )
  : (
      allTaken
        ? "All taken"
        : "Mark all taken"
    );

markAll.disabled = eligible.length === 0 || allTaken;

markAll.setAttribute(
  "aria-label",
  `${time}: ${markAll.textContent}`
);

footer.append(timeInfo, markAll);
    card.append(footer);
    list.append(card);
  });

  renderProgress();
}

// Load the existing bilingual generic-name catalogue.
// Original saved names, doses and reminder records are preserved.
fetch(
  "./data/myanmar-200-general-information-audio-prelinked.json"
)
  .then(response => {
    if (!response.ok) {
      throw new Error("Medicine names could not load.");
    }

    return response.json();
  })
  .then(data => {
    const entries = Array.isArray(data)
      ? data
      : data.medicines;

    if (!Array.isArray(entries)) return;

    entries.forEach(addDisplayName);
    renderList();
  })
  .catch(error => {
    console.warn(error.message);
  });

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

    updateFormLabels();
  renderList();
  showStatus(statusKey, statusType);
  updateDateLimits();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  updateDateLimits();

  if (!form.reportValidity()) {
    return;
  }

  const name = nameInput.value.trim();
  const dose = window.MedicineFormFields
  ? window.MedicineFormFields.getDose()
  : doseInput.value.trim();

  if (!name || !dose) {
    showStatus("invalidName", "error");
    return;
  }

  const times = [...timeFields.querySelectorAll("input")]
    .map((input) => input.value)
    .sort();

  if (
    !times.length ||
    times.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) ||
    new Set(times).size !== times.length
  ) {
    showStatus("invalidTime", "error");
    return;
  }

  if (endInput.value && endInput.value < startInput.value) {
    showStatus("invalidDates", "error");
    return;
  }

  const wasEditing = Boolean(editingId);

  const medicine = {
    id: editingId || newId(),
    name,
    dose,
    times,
    startDate: startInput.value,
    endDate: endInput.value,
    notes: notesInput.value.trim(),
  };

  const medicines = wasEditing
    ? state.medicines.map((item) => (item.id === editingId ? medicine : item))
    : [...state.medicines, medicine];

  if (persist({ medicines, logs: state.logs })) {
    resetForm();
    renderList();

    showStatus(wasEditing ? "updated" : "saved");
  }
});

document.getElementById("add-time").addEventListener("click", () => {
  addTimeField();
  timeFields.lastElementChild.querySelector("input").focus();
});

document.getElementById("cancel-edit").addEventListener("click", () => {
  resetForm();
  showStatus();
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.language;

    try {
      localStorage.setItem("medisafe-language", language);
    } catch {
      // Language selection can work without being saved.
    }

    renderLanguage();
  });
});

/* Keep today's display correct when returning to the tab. */
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    renderList();
  }
});

/* Refresh the date/progress if the page stays open across midnight. */
setInterval(renderProgress, 60000);

loadState();
resetForm();
renderLanguage();

startInput.addEventListener("input", updateDateLimits);
endInput.addEventListener("input", updateDateLimits);

// Refresh the minimum date when returning to the page.
window.addEventListener("focus", updateDateLimits);

updateDateLimits();
