"use strict";

const DEMO_OTP = "123456";

/*
  Frontend demonstration only.
  Real OTP generation, sending, verification and sessions
  must be implemented on a backend later.
*/

const translations = {
  en: {
    title: "MediSafe",
    eyebrow: "YOUR MEDICINE COMPANION",
    introTitle: "Understand your medicines. Make everyday care easier.",
    introDescription:
      "Explore medicine information without an account. " +
      "Sign in when you want to keep your personal medicine list.",
    feature: "English or Burmese. Your choice.",
    footer: "Made for everyday care.",
    previewBadge: "Frontend demo",
    welcomeLabel: "WELCOME TO MEDISAFE",
    welcome: "Start with what you need",
    entryDescription:
      "Browse first, or continue with your email or phone. No password needed.",
    continueGuest: "Explore without an account",
    guestDescription: "No sign-in needed to browse.",
    or: "or keep your personal medicine list",
    identifierLabel: "Email or Myanmar phone number",
    identifierHelp: "For example: name@example.com or 09xxxxxxxxx",
    identifierPlaceholder: "Email or 09xxxxxxxxx",
    sendCode: "Continue with a code",
    noPassword: "One contact method is enough. No password to remember.",
    changeContact: "Change email or phone",
    otpTitle: "Enter your code",
    otpDescription: "Contact selected:",
    demoCode: "Use this code for the frontend demo:",
    otpLabel: "6-digit code",
    verifyCode: "Continue",
    resend: "Try the demo code again",
    invalidContact: "Enter a valid email or Myanmar mobile number.",
    invalidCode: "Enter the demo code: 123456.",
    codeReset: "Demo code reset. Enter 123456.",
    guestMode: "GUEST BROWSING",
    demoMode: "OTP DEMO COMPLETED",
    browseTitle: "Find a medicine",
    browseDescription: "Search the sample medicine names below.",
    searchLabel: "Medicine name",
    searchPlaceholder: "Search in English or Burmese",
    noResults: "No matching sample medicine.",
    sampleNotice:
      "This preview contains sample names only. Personal records and real account access are not connected.",
    startOver: "Back to start",
  },

  my: {
    title: "MediSafe",
    eyebrow: "သင့်ဆေးဝါး စောင့်ရှောက်မှုအဖော်",
    introTitle: "ဆေးဝါးအကြောင်း သိရှိပြီး နေ့စဉ်စောင့်ရှောက်မှုကို လွယ်ကူစေပါ။",
    introDescription:
      "အကောင့်မလိုဘဲ ဆေးဝါးအချက်အလက်ကို ကြည့်နိုင်ပါသည်။ " +
      "ကိုယ်ပိုင်ဆေးစာရင်း သိမ်းချင်မှ အကောင့်ဝင်ပါ။",
    feature: "အင်္ဂလိပ် သို့မဟုတ် မြန်မာ၊ သင်ရွေးချယ်နိုင်ပါသည်။",
    footer: "နေ့စဉ်ကျန်းမာရေး စောင့်ရှောက်မှုအတွက်။",
    previewBadge: "ရှေ့ပိုင်းဒီဇိုင်း စမ်းသပ်မှု",
    welcomeLabel: "MEDISAFE မှ ကြိုဆိုပါသည်",
    welcome: "သင်လိုအပ်ရာမှ စတင်ပါ",
    entryDescription:
      "အကောင့်မဝင်ဘဲ ကြည့်နိုင်သည်။ သို့မဟုတ် အီးမေးလ်၊ " +
      "ဖုန်းနံပါတ်ဖြင့် ဆက်သုံးပါ။ စကားဝှက် မလိုပါ။",
    continueGuest: "အကောင့်မဝင်ဘဲ ကြည့်မည်",
    guestDescription: "ကြည့်ရှုရန် အကောင့်ဝင်စရာ မလိုပါ။",
    or: "သို့မဟုတ် ကိုယ်ပိုင်ဆေးစာရင်း သိမ်းရန်",
    identifierLabel: "အီးမေးလ် သို့မဟုတ် မြန်မာဖုန်းနံပါတ်",
    identifierHelp: "ဥပမာ name@example.com သို့မဟုတ် 09xxxxxxxxx",
    identifierPlaceholder: "အီးမေးလ် သို့မဟုတ် 09xxxxxxxxx",
    sendCode: "အတည်ပြုကုဒ်ဖြင့် ဆက်မည်",
    noPassword: "ဆက်သွယ်ရန်တစ်မျိုးသာ လိုပြီး စကားဝှက် မှတ်စရာမလိုပါ။",
    changeContact: "အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ် ပြင်မည်",
    otpTitle: "ကုဒ်ဖြည့်ပါ",
    otpDescription: "ရွေးထားသော ဆက်သွယ်ရန်လိပ်စာ -",
    demoCode: "ဒီဇိုင်းစမ်းသပ်ရန် ဤကုဒ်ကို သုံးပါ -",
    otpLabel: "ဂဏန်း ၆ လုံးပါ ကုဒ်",
    verifyCode: "ဆက်မည်",
    resend: "စမ်းသပ်ကုဒ်ဖြင့် ပြန်ကြိုးစားမည်",
    invalidContact:
      "မှန်ကန်သော အီးမေးလ် သို့မဟုတ် မြန်မာမိုဘိုင်းဖုန်းနံပါတ် ဖြည့်ပါ။",
    invalidCode: "စမ်းသပ်ကုဒ် 123456 ကို ဖြည့်ပါ။",
    codeReset: "စမ်းသပ်ကုဒ် ပြန်စထားပါပြီ။ 123456 ကို ဖြည့်ပါ။",
    guestMode: "အကောင့်မဝင်ဘဲ ကြည့်ရှုခြင်း",
    demoMode: "OTP စမ်းသပ်မှု ပြီးပါပြီ",
    browseTitle: "ဆေးအမည် ရှာမည်",
    browseDescription: "အောက်ပါ နမူနာဆေးအမည်များကို ရှာကြည့်ပါ။",
    searchLabel: "ဆေးအမည်",
    searchPlaceholder: "အင်္ဂလိပ် သို့မဟုတ် မြန်မာဖြင့် ရှာပါ",
    noResults: "ကိုက်ညီသော နမူနာဆေးအမည် မတွေ့ပါ။",
    sampleNotice:
      "ဤစမ်းသပ်မှုတွင် နမူနာဆေးအမည်များသာ ပါဝင်သည်။ " +
      "ကိုယ်ပိုင်မှတ်တမ်းနှင့် အကောင့်စနစ်အစစ် မချိတ်ဆက်ရသေးပါ။",
    startOver: "အစသို့ ပြန်သွားမည်",
  },
};

const sampleMedicines = [
  { en: "Paracetamol", my: "ပါရာစီတမော" },
  { en: "Ibuprofen", my: "အိုင်ဗျူပရိုဖန်" },
  { en: "Cetirizine", my: "စီတီရီဇင်း" },
  { en: "Loratadine", my: "လိုရာတာဒင်း" },
  { en: "Omeprazole", my: "အိုမီပရာဇိုး" },
  { en: "Amoxicillin", my: "အမောက်စီစီလင်" },
];

const entryScreen = document.getElementById("entry-screen");
const otpScreen = document.getElementById("otp-screen");
const browseScreen = document.getElementById("browse-screen");

const identifierForm = document.getElementById("identifier-form");
const identifierInput = document.getElementById("identifier");

const otpForm = document.getElementById("otp-form");
const otpInput = document.getElementById("otp");

const contactDisplay = document.getElementById("contact-display");
const statusBox = document.getElementById("status");
const searchInput = document.getElementById("medicine-search");

let language = "en";
let messageKey = "";
let messageType = "info";
let selectedContact = "";
let browsingMode = "guest";

try {
  const saved = localStorage.getItem("medisafe-language");

  if (saved === "en" || saved === "my") {
    language = saved;
  }
} catch {
  // Language switching also works without browser storage.
}

function setMessage(key = "", type = "info") {
  messageKey = key;
  messageType = type;

  statusBox.className = `status-message ${messageType}`;
  statusBox.textContent = key ? translations[language][key] : "";
}

function showScreen(screen) {
  [entryScreen, otpScreen, browseScreen].forEach((section) => {
    section.hidden = section !== screen;
  });

  setMessage();

  const heading = screen.querySelector("h2");

  if (heading) {
    heading.focus();
  }
}

function renderLanguage() {
  const text = translations[language];

  document.documentElement.lang = language;
  document.title = text.title;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = text[element.dataset.i18n];

    if (value !== undefined) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  });

  identifierInput.placeholder = text.identifierPlaceholder;
  searchInput.placeholder = text.searchPlaceholder;

  document.getElementById("browse-mode").textContent =
    browsingMode === "guest" ? text.guestMode : text.demoMode;

  setMessage(messageKey, messageType);
  renderMedicines();
}

/* Accept English and Burmese digits. */
function normaliseDigits(value) {
  return value.replace(/[၀-၉]/g, (character) =>
    String(character.charCodeAt(0) - "၀".charCodeAt(0)),
  );
}

function normaliseContact(rawValue) {
  const value = normaliseDigits(rawValue.trim());

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return value;
  }

  let phone = value.replace(/[\s()-]/g, "");

  if (phone.startsWith("0095")) {
    phone = "+" + phone.slice(2);
  } else if (phone.startsWith("09")) {
    phone = "+95" + phone.slice(1);
  } else if (phone.startsWith("959")) {
    phone = "+" + phone;
  }

  // Basic Myanmar mobile format check, not ownership verification.
  if (/^\+959\d{7,9}$/.test(phone)) {
    return phone;
  }

  return null;
}

function openBrowsing(mode) {
  window.location.assign("./find-medicine.html");
}

function renderMedicines() {
  const query = searchInput.value.trim().normalize("NFC").toLowerCase();

  const filtered = sampleMedicines.filter((medicine) =>
    `${medicine.en} ${medicine.my}`
      .normalize("NFC")
      .toLowerCase()
      .includes(query),
  );

  const list = document.getElementById("medicine-list");
  list.replaceChildren();

  filtered.forEach((medicine) => {
    const item = document.createElement("li");
    const primary = document.createElement("strong");
    const secondary = document.createElement("span");

    primary.textContent = language === "my" ? medicine.my : medicine.en;

    secondary.textContent = language === "my" ? medicine.en : medicine.my;

    primary.lang = language;
    secondary.lang = language === "my" ? "en" : "my";

    item.append(primary, secondary);
    list.append(item);
  });

  document.getElementById("no-results").hidden = filtered.length !== 0;
}

/* Language selection */
document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.language;

    try {
      localStorage.setItem("medisafe-language", language);
    } catch {
      // Storing the language preference is optional.
    }

    renderLanguage();
  });
});

/* Guest access */
document.getElementById("guest-button").addEventListener("click", () => {
  selectedContact = "";
  identifierForm.reset();

  openBrowsing("guest");
});

/* Email / phone entry */
identifierForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const contact = normaliseContact(identifierInput.value);

  if (!contact) {
    identifierInput.setAttribute("aria-invalid", "true");
    setMessage("invalidContact", "error");
    identifierInput.focus();
    return;
  }

  identifierInput.removeAttribute("aria-invalid");
  selectedContact = contact;

  contactDisplay.textContent = selectedContact;
  otpInput.value = "";

  showScreen(otpScreen);
  otpInput.focus();
});

/* OTP demonstration */
otpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const code = normaliseDigits(otpInput.value.trim());
  otpInput.value = code;

  if (code !== DEMO_OTP) {
    otpInput.setAttribute("aria-invalid", "true");
    setMessage("invalidCode", "error");
    otpInput.focus();
    return;
  }

  otpInput.removeAttribute("aria-invalid");

  // This opens a preview; it does not authenticate a real account.
  openBrowsing("demo");
});

document.getElementById("back-button").addEventListener("click", () => {
  otpInput.value = "";
  showScreen(entryScreen);
  identifierInput.focus();
});

document.getElementById("resend-button").addEventListener("click", () => {
  otpInput.value = "";
  otpInput.removeAttribute("aria-invalid");

  setMessage("codeReset");
  otpInput.focus();
});

document.getElementById("start-over").addEventListener("click", () => {
  selectedContact = "";
  contactDisplay.textContent = "";

  identifierForm.reset();
  otpForm.reset();

  identifierInput.removeAttribute("aria-invalid");
  otpInput.removeAttribute("aria-invalid");

  showScreen(entryScreen);
});

identifierInput.addEventListener("input", () => {
  identifierInput.removeAttribute("aria-invalid");
  setMessage();
});

otpInput.addEventListener("input", () => {
  otpInput.value = normaliseDigits(otpInput.value)
    .replace(/\D/g, "")
    .slice(0, 6);

  otpInput.removeAttribute("aria-invalid");
  setMessage();
});

searchInput.addEventListener("input", renderMedicines);

renderLanguage();
