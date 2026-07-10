const card = document.getElementById("invitationCard");
const form = document.getElementById("editorForm");
const styleSelect = document.getElementById("styleSelect");
const photoInput = document.getElementById("photoInput");
const logoInput = document.getElementById("logoInput");
const graduateImage = document.getElementById("graduateImage");
const schoolLogo = document.getElementById("schoolLogo");
const ribbonEmblem = document.querySelector(".ribbon-emblem");
const animationToggle = document.getElementById("animationToggle");
const mirrorToggle = document.getElementById("mirrorToggle");
const downloadButton = document.getElementById("downloadButton");
const resetColorButton = document.getElementById("resetColorButton");
const statusMessage = document.getElementById("statusMessage");

const customColorInputs = {
  bg: document.getElementById("customBgColor"),
  deep: document.getElementById("customBgDeepColor"),
  text: document.getElementById("customTextColor"),
  accent: document.getElementById("customAccentColor"),
  ribbon: document.getElementById("customRibbonColor"),
  gold: document.getElementById("customGoldColor")
};

const templateClasses = [
  "template-rose",
  "template-ivory",
  "template-modern",
  "template-pearl",
  "template-editorial",
  "template-sage",
  "template-lavender",
  "template-burgundy",
  "template-sky",
  "template-ocean",
  "template-navy",
  "template-royal",
  "template-blueprint",
  "template-midnight-script",
  "template-navy-gold",
  "template-satin-blue",
  "template-seafoam",
  "template-aqua-light",
  "template-coastal",
  "template-left-rose",
  "template-left-ocean",
  "template-left-navy",
  "template-solid-cream",
  "template-solid-blush",
  "template-solid-sea",
  "template-solid-navy",
  "template-split-luxe",
  "template-arch-photo",
  "template-date-sidebar",
  "template-center-poster",
  "template-diagonal",
  "template-bottom-stage",
  "template-minimal-line",
  "template-luxury-frame",
  "template-photo-spotlight",
  "template-card-stack"
];

let uploadedPhotoUrl = "";
let uploadedLogoUrl = "";

function setStatus(message) {
  statusMessage.textContent = message;
}

function updateBoundText(target, value) {
  document.querySelectorAll(`[data-bind="${target}"]`).forEach((element) => {
    element.textContent = value;
  });

  if (target === "year") {
    document.querySelectorAll('[data-bind="yearLarge"]').forEach((element) => {
      element.textContent = value;
    });
  }
}

function waitForImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
}

function downloadCanvas(canvas) {
  const link = document.createElement("a");
  link.download = "thiep-moi-tot-nghiep-kim-trinh.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  const value = Number.parseInt(cleanHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function setRgbVariable(name, hex) {
  const { r, g, b } = hexToRgb(hex);
  card.style.setProperty(name, `${r}, ${g}, ${b}`);
}

function applyTemplate(templateName) {
  card.classList.remove(...templateClasses);
  card.classList.add(templateName);
}

function applyCustomColors(activate = true) {
  card.style.setProperty("--custom-bg", customColorInputs.bg.value);
  card.style.setProperty("--custom-bg-deep", customColorInputs.deep.value);
  card.style.setProperty("--custom-text", customColorInputs.text.value);
  card.style.setProperty("--custom-accent", customColorInputs.accent.value);
  card.style.setProperty("--custom-ribbon", customColorInputs.ribbon.value);
  card.style.setProperty("--custom-gold", customColorInputs.gold.value);
  setRgbVariable("--custom-bg-rgb", customColorInputs.bg.value);
  setRgbVariable("--custom-bg-deep-rgb", customColorInputs.deep.value);
  setRgbVariable("--custom-accent-rgb", customColorInputs.accent.value);
  setRgbVariable("--custom-ribbon-rgb", customColorInputs.ribbon.value);
  setRgbVariable("--custom-gold-rgb", customColorInputs.gold.value);
  if (activate) {
    card.classList.add("custom-colors-active");
  }
}

form.addEventListener("input", (event) => {
  const input = event.target;
  const target = input.dataset.target;

  if (!target) {
    return;
  }

  updateBoundText(target, input.value);
});

styleSelect.addEventListener("change", () => {
  applyTemplate(styleSelect.value);

  setStatus(`Đã đổi sang mẫu ${styleSelect.options[styleSelect.selectedIndex].text}.`);
});

Object.values(customColorInputs).forEach((input) => {
  input.addEventListener("input", () => {
    applyCustomColors();
    setStatus(`Đã cập nhật màu trên mẫu ${styleSelect.options[styleSelect.selectedIndex].text}.`);
  });
});

resetColorButton.addEventListener("click", () => {
  card.classList.remove("custom-colors-active");
  setStatus(`Đã đưa ${styleSelect.options[styleSelect.selectedIndex].text} về màu gốc.`);
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];

  if (!file) {
    return;
  }

  if (uploadedPhotoUrl) {
    URL.revokeObjectURL(uploadedPhotoUrl);
  }

  uploadedPhotoUrl = URL.createObjectURL(file);
  graduateImage.src = uploadedPhotoUrl;
  setStatus("Ảnh đã được cập nhật trên thiệp.");
});

logoInput.addEventListener("change", () => {
  const file = logoInput.files?.[0];

  if (!file) {
    return;
  }

  if (uploadedLogoUrl) {
    URL.revokeObjectURL(uploadedLogoUrl);
  }

  uploadedLogoUrl = URL.createObjectURL(file);
  schoolLogo.src = uploadedLogoUrl;
  ribbonEmblem.classList.add("has-logo");
  setStatus("Logo trường đã được thêm vào vòng tròn.");
});

animationToggle.addEventListener("change", () => {
  document.body.classList.toggle("no-animation", !animationToggle.checked);
});

mirrorToggle.addEventListener("change", () => {
  card.classList.toggle("photo-mirrored", mirrorToggle.checked);
  setStatus(mirrorToggle.checked ? "Đã lật ảnh ngang." : "Đã đưa ảnh về chiều gốc.");
});

downloadButton.addEventListener("click", async () => {
  if (!window.html2canvas) {
    setStatus("Chưa tải được html2canvas. Hãy kiểm tra kết nối mạng rồi thử lại.");
    return;
  }

  downloadButton.disabled = true;
  setStatus("Đang chuẩn bị ảnh PNG...");

  const animationWasEnabled = animationToggle.checked;
  document.body.classList.add("no-animation");

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await Promise.all([...card.querySelectorAll("img")].map(waitForImage));

    const canvas = await html2canvas(card, {
      backgroundColor: "#ffffff",
      scale: 4,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: card.offsetWidth,
      height: card.offsetHeight
    });

    downloadCanvas(canvas);
    setStatus("Đã tạo file PNG chất lượng cao.");
  } catch (error) {
    setStatus("Không xuất được PNG. Nếu đang mở file trực tiếp, hãy chạy bằng Live Server rồi thử lại.");
  } finally {
    document.body.classList.toggle("no-animation", !animationWasEnabled);
    downloadButton.disabled = false;
  }
});

applyCustomColors(false);
