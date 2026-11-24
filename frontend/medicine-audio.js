(() => {
  "use strict";

  const SPEAKER_ICON = `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z"/>
      <path d="M15 8a6 6 0 0 1 0 8"/>
      <path d="M18 5a10 10 0 0 1 0 14"/>
    </svg>
  `;

  const STOP_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="2"
        fill="currentColor"
      />
    </svg>
  `;
  function renderAudioButton(button, playing = false) {
  const isBurmese = button.dataset.audioLanguage === "my";

  const text = playing
    ? (isBurmese ? "ရပ်ရန်" : "Stop")
    : (isBurmese ? "နားထောင်ရန်" : "Listen");

  button.innerHTML = playing ? STOP_ICON : SPEAKER_ICON;

  const label = document.createElement("span");
  label.className = "medicine-audio-label";
  label.textContent = text;

  button.append(label);
}
  let active = null;
  let messageNode = null;

  function showMessage(message) {
    if (messageNode) {
      messageNode.textContent = message;
    }
  }

  function stop() {
    const previous = active;
    active = null;

    if (previous) {
      previous.audio.pause();
      previous.audio.removeAttribute("src");
      previous.audio.load();

      renderAudioButton(previous.button, false);
      previous.button.classList.remove("is-playing");
      previous.button.setAttribute("aria-pressed", "false");
      previous.button.setAttribute(
        "aria-label",
        previous.listenLabel
      );

      previous.button.title = previous.listenLabel;
    }

    showMessage("");
  }

  function mount({
    container,
    medicine,
    language,
    headings
  }) {
    stop();

    if (!container || !medicine) return;

    const isBurmese = language === "my";

    const text = (en, my) => isBurmese ? my : en;

    // Avoid duplicate icons if mounted again.
    container
      .querySelectorAll(".medicine-audio-button")
      .forEach(button => button.remove());

    container
      .querySelector(".medicine-audio-message")
      ?.remove();

    messageNode = document.createElement("p");
    messageNode.className = "medicine-audio-message";
    messageNode.setAttribute("role", "status");
    messageNode.setAttribute("aria-live", "polite");

    const title = container.querySelector("#detail-title");

    if (title) {
      title.after(messageNode);
    } else {
      container.prepend(messageNode);
    }

    const sectionHeadings = [
      ...container.querySelectorAll(".detail-section > h3")
    ];

    function findHeading(titleText) {
      return sectionHeadings.find(
        heading => heading.textContent.trim() === titleText
      );
    }

    const targets = [
      {
        group: "overview",
        heading: title,
        label: text(
          "Medicine name and uses",
          "ဆေးနာမည်နှင့် အသုံးပြုမှု"
        )
      },
      {
        group: "use_safety",
        heading: findHeading(headings.use_safety),
        label: text(
          "How to use, side effects and contraindications",
          "သုံးစွဲနည်း၊ ဘေးထွက်ဆိုးကျိုးနှင့် မသုံးသင့်သောအခြေအနေ"
        )
      },
      {
        group: "precautions_interactions",
        heading: findHeading(headings.precautions_interactions),
        label: text(
          "Precautions and drug interactions",
          "သတိပြုရန်နှင့် ဆေးအပြန်အလှန်သက်ရောက်မှု"
        )
      },
      {
        group: "overdose_storage",
        heading: findHeading(headings.overdose_storage),
        label: text(
          "Overdose warning and storage",
          "ဆေးပမာဏလွန်ခြင်းနှင့် သိမ်းဆည်းနည်း"
        )
      }
    ];

    targets.forEach(target => {
      if (!target.heading) return;

      target.heading.classList.add("medicine-audio-heading");

      const button = document.createElement("button");

      button.type = "button";
      button.className = "medicine-audio-button";
      button.dataset.audioLanguage = language;
renderAudioButton(button, false);

      const listenLabel = text(
        `Listen: ${target.label}`,
        `နားထောင်ရန် — ${target.label}`
      );

      button.title = listenLabel;
      button.setAttribute("aria-label", listenLabel);
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", async () => {
        // Press the active icon again to stop.
        if (active?.button === button) {
          stop();
          return;
        }

        // Stop any other group before starting this one.
        stop();

        const source =
          medicine.audio_guide?.groups?.[target.group]?.[language];

        if (typeof source !== "string" || !source.trim()) {
          showMessage(
            text(
              "The audio recording for this section is not available yet.",
              "ဤအပိုင်းအတွက် အသံဖိုင် မထည့်ရသေးပါ။"
            )
          );
          return;
        }

        let url;

        try {
          url = new URL(source, document.baseURI);

          if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Unsupported audio URL.");
          }
        } catch {
          showMessage(
            text(
              "The audio file address is invalid.",
              "အသံဖိုင်လမ်းကြောင်း မမှန်ပါ။"
            )
          );
          return;
        }

        const audio = new Audio(url.href);
        audio.preload = "none";

        const state = {
          audio,
          button,
          listenLabel
        };

        active = state;

        renderAudioButton(button, true);
        button.classList.add("is-playing");
        button.setAttribute("aria-pressed", "true");

        const stopLabel = text(
          `Stop: ${target.label}`,
          `ရပ်ရန် — ${target.label}`
        );

        button.title = stopLabel;
        button.setAttribute("aria-label", stopLabel);

        function handleError() {
          if (active !== state) return;

          stop();

          showMessage(
            text(
              "The audio could not be played. Check the MP3 file and its path.",
              "အသံဖွင့်မရပါ။ MP3 ဖိုင်နှင့် ဖိုင်လမ်းကြောင်းကို စစ်ပါ။"
            )
          );
        }

        audio.addEventListener("ended", () => {
          if (active === state) {
            stop();
          }
        });

        audio.addEventListener("error", handleError);

        try {
          await audio.play();
        } catch {
          handleError();
        }
      });

      target.heading.append(button);
    });
  }

  window.MedicineAudio = {
    mount,
    stop
  };

  window.addEventListener("pagehide", stop);
})();