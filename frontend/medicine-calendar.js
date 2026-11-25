(() => {
  "use strict";

  const STORAGE_KEY = "medisafe-personal-medicines-v1";

  const TEXT = {
    en: {
      title: "Medicine calendar",
      today: "Today",
      previous: "Previous month",
      next: "Next month",
      schedule: "SCHEDULE FOR SELECTED DAY",
      legend: "Pill icons show scheduled medicine records, not the number of pills to take.",
      empty: "No medicines scheduled for this date.",
      recorded: "Recorded as taken",
      scheduled: "Scheduled",
      hasSchedule: "Medicines scheduled",
      storageError: "Saved medicine data could not be read.",
      weekdays: [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]
    },

    my: {
      title: "ဆေးသောက်ရက် ပြက္ခဒိန်",
      today: "ယနေ့",
      previous: "ယခင်လ",
      next: "နောက်လ",
      schedule: "ရွေးထားသောနေ့၏ ဆေးသောက်အစီအစဉ်",
      legend: "ဆေးတောင့်ပုံများသည် ဆေးမှတ်တမ်းအရေအတွက်ကို ပြသည်။ သောက်ရမည့် ဆေးလုံးအရေအတွက် မဟုတ်ပါ။",
      empty: "ဤနေ့အတွက် ဆေးသောက်ချိန် မရှိပါ။",
      recorded: "သောက်ပြီးဟု မှတ်တမ်းတင်ထားသည်",
      scheduled: "သောက်ရန် စီစဉ်ထားသည်",
      hasSchedule: "ဆေးသောက်ချိန် ရှိပါသည်",
      storageError: "သိမ်းထားသော ဆေးစာရင်းကို ဖတ်မရပါ။",
      weekdays: [
  "တနင်္ဂနွေ",
  "တနင်္လာ",
  "အင်္ဂါ",
  "ဗုဒ္ဓဟူး",
  "ကြာသပတေး",
  "သောကြာ",
  "စနေ"
]
    }
  };

  function initialiseCalendar() {
    const root = document.querySelector(".mc-calendar");
    if (!root) return;

    const get = id => document.getElementById(id);

    let language = "en";
    let medicines = [];
    let logs = [];
    let storageError = false;

    let selectedDate = dateKey(new Date());
    let visibleMonth = monthOf(selectedDate);

    function dateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    function parseDate(key) {
      const [year, month, day] = key.split("-").map(Number);
      return new Date(year, month - 1, day, 12);
    }

    function monthOf(key) {
      const date = parseDate(key);

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
        12
      );
    }

    function locale() {
      return language === "my" ? "my-MM" : "en-GB";
    }

    function readMedicines() {
      storageError = false;
      medicines = [];
      logs = [];

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const saved = JSON.parse(raw);

        // Reuse the validation in your existing my-medicines.js.
        if (
          typeof validStoredData !== "function" ||
          !validStoredData(saved)
        ) {
          throw new Error("Invalid medicine data");
        }

        medicines = saved.medicines;
        logs = saved.logs;
      } catch {
        storageError = true;
      }
    }

    function scheduledOn(key) {
      return medicines.filter(medicine =>
        medicine.startDate <= key &&
        (!medicine.endDate || medicine.endDate >= key) &&
        medicine.times.length > 0
      );
    }

    function make(tag, className, text) {
      const node = document.createElement(tag);

      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;

      return node;
    }

    function renderSchedule() {
      const text = TEXT[language];

      get("mc-selected-date").textContent =
        new Intl.DateTimeFormat(locale(), {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }).format(parseDate(selectedDate));

      const container = get("mc-schedule");
      container.replaceChildren();

      if (storageError) {
        container.append(
          make("p", "mc-empty", text.storageError)
        );
        return;
      }

      const entries = scheduledOn(selectedDate)
        .flatMap(medicine =>
          medicine.times.map(time => ({ medicine, time }))
        )
        .sort((a, b) =>
          a.time.localeCompare(b.time) ||
          a.medicine.name.localeCompare(b.medicine.name)
        );

      if (!entries.length) {
        container.append(make("p", "mc-empty", text.empty));
        return;
      }

      entries.forEach(({ medicine, time }) => {
        const recorded = logs.some(log =>
          log.medicineId === medicine.id &&
          log.date === selectedDate &&
          log.time === time
        );

        const row = make("div", "mc-dose");
        const details = make("div");

        details.append(
          make("strong", "mc-dose-name", medicine.name),
          make("p", "mc-dose-amount", medicine.dose),
          make(
            "span",
            `mc-dose-state${recorded ? " is-recorded" : ""}`,
            recorded ? text.recorded : text.scheduled
          )
        );

        row.append(
          make("span", "mc-time", time),
          details
        );

        container.append(row);
      });
    }
    function createMedicineMarkers(count) {
  const markers = make(
    "span",
    count > 3 ? "mc-pills is-pile" : "mc-pills"
  );

  markers.setAttribute("aria-hidden", "true");

  const iconCount = count > 3 ? 5 : count;

  for (let index = 0; index < iconCount; index++) {
    markers.append(make("span", "mc-pill"));
  }

  return markers;
}
    function remainingMedicineText(key) {
  if (storageError) return "";

  const scheduled = scheduledOn(key);
  if (!scheduled.length) return "";

  const remaining = scheduled.filter(medicine => {
    // Complete only when every scheduled time has a taken record.
    const allTaken = medicine.times.every(time =>
      logs.some(log =>
        log.medicineId === medicine.id &&
        log.date === key &&
        log.time === time
      )
    );

    return !allTaken;
  }).length;

  const number = new Intl.NumberFormat(locale()).format(remaining);

  if (remaining === 0) {
    return language === "my"
      ? "ယနေ့ ဆေးအားလုံး သောက်ပြီးဟု မှတ်တမ်းတင်ထားသည်။"
      : "All medicines recorded as taken today.";
  }

  return language === "my"
    ? `ယနေ့ သောက်ရန် ဆေး ${number} မျိုး ကျန်သေးသည်။`
    : `${number} medicine${remaining === 1 ? "" : "s"} remaining today.`;
}
    function render() {
      language =
        document.documentElement.lang.startsWith("my")
          ? "my"
          : "en";

      const text = TEXT[language];
      root.lang = language;

      get("mc-title").textContent = text.title;
      get("mc-today").textContent = text.today;
      get("mc-schedule-label").textContent = text.schedule;
      get("mc-legend-text").textContent = text.legend;

      get("mc-previous").setAttribute(
        "aria-label",
        text.previous
      );

      get("mc-next").setAttribute("aria-label", text.next);

      get("mc-month").textContent =
        new Intl.DateTimeFormat(locale(), {
          year: "numeric",
          month: "long"
        }).format(visibleMonth);

      get("mc-weekdays").replaceChildren(
        ...text.weekdays.map(day => make("span", "", day))
      );

      const days = get("mc-days");
      days.replaceChildren();

      const first = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        1 - visibleMonth.getDay(),
        12
      );

      const today = dateKey(new Date());

      for (let index = 0; index < 42; index++) {
  const date = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate() + index,
    12
  );

  const key = dateKey(date);

  const medicineCount = storageError
    ? 0
    : scheduledOn(key).length;

  const button = make("button", "mc-day");
  button.type = "button";

  const number = make(
    "span",
    "mc-date-number",
    new Intl.NumberFormat(locale()).format(date.getDate())
  );

  button.append(number);

  if (medicineCount > 0) {
    button.append(createMedicineMarkers(medicineCount));
  } else {
    // Reserve space to keep date numbers aligned.
    const spacer = make("span", "mc-pill-spacer");
    spacer.setAttribute("aria-hidden", "true");
    button.append(spacer);
  }
  // Show remaining medicines under the icons for today only.
if (key === today && medicineCount > 0) {
  const remainingText = remainingMedicineText(key);

  const remainingLabel = make(
    "span",
    "mc-remaining-label",
    remainingText
  );

  button.append(remainingLabel);
  button.classList.add("has-remaining-label");
}
  button.classList.toggle(
    "is-outside",
    date.getMonth() !== visibleMonth.getMonth()
  );

  button.classList.toggle("is-today", key === today);

  button.classList.toggle(
    "has-schedule",
    medicineCount > 0
  );

  button.setAttribute(
    "aria-pressed",
    String(key === selectedDate)
  );

  if (key === today) {
    button.setAttribute("aria-current", "date");
  }

  const dateLabel = new Intl.DateTimeFormat(locale(), {
    dateStyle: "full"
  }).format(date);

  const countLabel = language === "my"
    ? `ဆေးမှတ်တမ်း ${
        new Intl.NumberFormat(locale()).format(medicineCount)
      } ခု`
    : `${medicineCount} medicine records scheduled`;

  button.setAttribute(
    "aria-label",
    medicineCount > 0
      ? `${dateLabel} — ${countLabel}`
      : dateLabel
  );
  if (key === today && medicineCount > 0) {
  button.setAttribute(
    "aria-label",
    `${dateLabel} — ${remainingMedicineText(key)}`
  );
}

  button.dataset.date = key;

  button.addEventListener("click", () => {
    selectedDate = key;
    visibleMonth = monthOf(key);

    render();

    days.querySelector(`[data-date="${key}"]`)?.focus();
  });

  days.append(button);
}
      renderSchedule();
    }

    function refresh() {
      readMedicines();
      render();
    }

    get("mc-previous").addEventListener("click", () => {
      visibleMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() - 1,
        1,
        12
      );

      render();
    });

    get("mc-next").addEventListener("click", () => {
      visibleMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        1,
        12
      );

      render();
    });

    get("mc-today").addEventListener("click", () => {
      selectedDate = dateKey(new Date());
      visibleMonth = monthOf(selectedDate);
      refresh();
    });

    window.addEventListener("medisafe:medicines-updated", refresh);

    window.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY || event.key === null) {
        refresh();
      }
    });

    window.addEventListener("focus", refresh);

    new MutationObserver(render).observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["lang"]
      }
    );

    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseCalendar,
      { once: true }
    );
  } else {
    initialiseCalendar();
  }
})();