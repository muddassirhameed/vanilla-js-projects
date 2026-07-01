const passwordInputElement = document.querySelector("#password");
const copyPasswordButton = document.querySelector("#copy-password");
const regeneratePasswordButton = document.querySelector("#regen-password");

const passwordLength = document.querySelector("#lengthValue");
const passwordSliderInput = document.querySelector("#lengthSlider");

const progressFill = document.querySelector("#progressFill");
const strengthLabel = document.querySelector("#strengthLabel");

const minPasswordLength = 12;
const maxPasswordLength = 50;

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*";

// User Interface Update
function updateUI() {
  const currentLength = passwordInputElement.value.length;
  passwordLength.textContent = currentLength;
  updateStrengthUI();
}

// Random 12 Character User Password Generator
function generateRandomUserPassword(length = minPasswordLength) {
  const password = [];
  const passwordPool = lowercase + uppercase + numbers + symbols;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * passwordPool.length);
    password.push(passwordPool[randomIndex]);
  }
  return password.join("");
}

// toast message Notification
function showToast(message, type = "green") {
  const toastMessage = document.querySelector(".message-box");

  const div = document.createElement("div");
  div.textContent = message;
  div.className = type;

  toastMessage.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}

// Normalize User Password
function normalizePassword(password) {
  return password.replace(/\s+/g, "");
}

// User password validation
function isPasswordValid() {
  const cleanPassword = normalizePassword(passwordInputElement.value);
  const length = cleanPassword.length;
  return length >= minPasswordLength && length <= maxPasswordLength;
}

// User Password copy handler
async function handleCopy(event) {
  if (!isPasswordValid()) {
    event.preventDefault();
    showToast(
      `Password must be ${minPasswordLength}–${maxPasswordLength} characters ⚠️`,
      "red",
    );
    return;
  }
  try {
    await navigator.clipboard.writeText(
      normalizePassword(passwordInputElement.value),
    );
    showToast("Copied ✓", "green");
  } catch (error) {
    showToast("Copy failed ❌", "red");
  }
}

// Inital Page Load
document.addEventListener("DOMContentLoaded", function () {
  passwordSliderInput.value = minPasswordLength;
  passwordInputElement.value = generateRandomUserPassword(minPasswordLength);
  updateUI();
});

// slider control
passwordSliderInput.addEventListener("input", function (event) {
  const length = Number(event.target.value);
  passwordInputElement.value = generateRandomUserPassword(length);
  updateUI();
});

// typing only UI sync
passwordInputElement.addEventListener("input", function () {
  updateUI();
});

// password score calculate
function calculatePasswordScore(password) {
  let score = 0;
  if (password.length >= 1) score += 10;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 20;

  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  return score;
}

// password strength
function getStrength(score) {
  if (score <= 40) {
    return {
      label: "Weak",
      percent: 33,
      color: "#ff4d4d",
    };
  }

  if (score <= 75) {
    return {
      label: "Average",
      percent: 66,
      color: "#ffa500",
    };
  }

  return {
    label: "Strong",
    percent: 100,
    color: "#00c853",
  };
}

// update progress UI
function updateStrengthUI() {
  const password = passwordInputElement.value;

  const score = calculatePasswordScore(password);
  const strength = getStrength(score);

  strengthLabel.textContent = strength.label;

  progressFill.style.transition = "width 0.4s ease, background 0.4s ease";
  progressFill.style.width = strength.percent + "%";
  progressFill.style.background = strength.color;
}

// regenerate User Password based On button
regeneratePasswordButton.addEventListener("click", function () {
  const length = Number(passwordSliderInput.value);
  passwordInputElement.value = generateRandomUserPassword(length);
  updateUI();
  showToast("Regenerated ✓", "blue");
});

// Copy EVENTS
copyPasswordButton.addEventListener("click", handleCopy);
passwordInputElement.addEventListener("copy", handleCopy);
