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
const resetPhotoPositionButton = document.getElementById("resetPhotoPositionButton");
const backgroundFolderInput = document.getElementById("backgroundFolderInput");
const backgroundImageSelect = document.getElementById("backgroundImageSelect");
const resetBackgroundPositionButton = document.getElementById("resetBackgroundPositionButton");
const removeBackgroundButton = document.getElementById("removeBackgroundButton");
const statusMessage = document.getElementById("statusMessage");
const photoMoveInputs = {
  x: document.getElementById("photoMoveX"),
  y: document.getElementById("photoMoveY"),
  scale: document.getElementById("photoScale")
};
const backgroundControls = {
  x: document.getElementById("backgroundMoveX"),
  y: document.getElementById("backgroundMoveY"),
  scale: document.getElementById("backgroundScale"),
  opacity: document.getElementById("backgroundOpacity")
};

const customColorInputs = {
  bg: document.getElementById("customBgColor"),
  deep: document.getElementById("customBgDeepColor"),
  text: document.getElementById("customTextColor"),
  accent: document.getElementById("customAccentColor"),
  ribbon: document.getElementById("customRibbonColor"),
  gold: document.getElementById("customGoldColor"),
  page: document.getElementById("pageBgColor")
};
const customBgStyle = document.getElementById("customBgStyle");

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
  "template-card-stack",
  "template-paper-ribbon"
];
const backgroundModeClasses = [
  "background-solid",
  "background-soft",
  "background-split",
  "background-dark",
  "background-clean"
];
const defaultBackgroundAssets = [
  "./assets/background/background_loangmau.jpg",
  "./assets/background/background_loangmau2.jpg",
  "./assets/background/background_loangmau3.jpg",
  "./assets/background/loang4.jpg",
  "./assets/background/loang5.jpg",
  "./assets/background/loang6.jpg",
  "./assets/background/loang7.jpg",
  "./assets/background/loang8.jpg"
];
const backgroundFolderPath = "./assets/background/";
const backgroundImagePattern = /\.(png|jpe?g|webp|gif)$/i;

let uploadedPhotoUrl = "";
let uploadedLogoUrl = "";
let backgroundOptions = [];

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
  document.body.style.setProperty("--page-bg", customColorInputs.page.value);
  setRgbVariable("--custom-bg-rgb", customColorInputs.bg.value);
  setRgbVariable("--custom-bg-deep-rgb", customColorInputs.deep.value);
  setRgbVariable("--custom-accent-rgb", customColorInputs.accent.value);
  setRgbVariable("--custom-ribbon-rgb", customColorInputs.ribbon.value);
  setRgbVariable("--custom-gold-rgb", customColorInputs.gold.value);
  applyBackgroundMode();
  if (activate) {
    card.classList.add("custom-colors-active");
    document.body.classList.add("custom-page-bg");
  }
}

function applyBackgroundMode() {
  card.classList.remove(...backgroundModeClasses);
  card.classList.add(`background-${customBgStyle.value}`);
}

function applyPhotoPosition() {
  card.style.setProperty("--photo-x", `${photoMoveInputs.x.value}%`);
  card.style.setProperty("--photo-y", `${photoMoveInputs.y.value}%`);
  card.style.setProperty("--photo-scale", Number(photoMoveInputs.scale.value) / 100);
}

function applyBackgroundPosition() {
  card.style.setProperty("--custom-background-x", `${backgroundControls.x.value}%`);
  card.style.setProperty("--custom-background-y", `${backgroundControls.y.value}%`);
  card.style.setProperty("--custom-background-size", `${backgroundControls.scale.value}%`);
  card.style.setProperty("--custom-background-opacity", Number(backgroundControls.opacity.value) / 100);
}

function clearBackgroundOptions() {
  backgroundOptions.forEach((option) => {
    if (option.revoke) {
      URL.revokeObjectURL(option.url);
    }
  });
  backgroundOptions = [];
}

function setCustomBackground(index) {
  const option = backgroundOptions[index];

  if (!option) {
    card.classList.remove("has-custom-background");
    card.style.removeProperty("--custom-background-image");
    return;
  }

  card.style.setProperty("--custom-background-image", `url("${option.url}")`);
  card.classList.add("has-custom-background");
  setStatus(`Đã chọn background ${option.name}.`);
}

function renderBackgroundOptions(options, defaultMessage = "Chưa có background") {
  backgroundImageSelect.innerHTML = "";

  if (!options.length) {
    backgroundImageSelect.disabled = true;
    backgroundImageSelect.innerHTML = `<option value="">${defaultMessage}</option>`;
    setCustomBackground(-1);
    return;
  }

  options.forEach((option, index) => {
    const selectOption = document.createElement("option");
    selectOption.value = String(index);
    selectOption.textContent = option.name;
    backgroundImageSelect.append(selectOption);
  });

  backgroundImageSelect.disabled = false;
  backgroundImageSelect.value = "0";
  setCustomBackground(0);
}

function normalizeBackgroundUrl(path) {
  return new URL(path, window.location.href).href;
}

async function discoverBackgroundAssets() {
  try {
    const response = await fetch(backgroundFolderPath, { cache: "no-store" });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const urls = [...doc.querySelectorAll("a")]
      .map((link) => link.getAttribute("href") || "")
      .filter((href) => backgroundImagePattern.test(href))
      .map((href) => normalizeBackgroundUrl(href.startsWith("http") ? href : `${backgroundFolderPath}${href.split("/").pop()}`));

    return [...new Set(urls)];
  } catch (error) {
    return [];
  }
}

async function loadDefaultBackgroundAssets() {
  clearBackgroundOptions();
  const discoveredAssets = await discoverBackgroundAssets();
  const assetUrls = discoveredAssets.length
    ? discoveredAssets
    : defaultBackgroundAssets.map(normalizeBackgroundUrl);

  backgroundOptions = assetUrls.map((url) => ({
    name: decodeURIComponent(url.split("/").pop()),
    url,
    revoke: false
  }));
  renderBackgroundOptions(backgroundOptions);
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

Object.values(photoMoveInputs).forEach((input) => {
  input.addEventListener("input", () => {
    applyPhotoPosition();
    setStatus("Đã cập nhật vị trí ảnh.");
  });
});

resetPhotoPositionButton.addEventListener("click", () => {
  photoMoveInputs.x.value = 0;
  photoMoveInputs.y.value = 0;
  photoMoveInputs.scale.value = 100;
  applyPhotoPosition();
  setStatus("Đã đưa ảnh về vị trí mặc định.");
});

Object.values(backgroundControls).forEach((input) => {
  input.addEventListener("input", () => {
    applyBackgroundPosition();
    setStatus("Đã cập nhật vị trí background.");
  });
});

backgroundFolderInput.addEventListener("change", () => {
  const files = [...(backgroundFolderInput.files || [])]
    .filter((file) => file.type.startsWith("image/"))
    .sort((a, b) => {
      const nameA = a.webkitRelativePath || a.name;
      const nameB = b.webkitRelativePath || b.name;
      return nameA.localeCompare(nameB);
    });

  clearBackgroundOptions();

  if (!files.length) {
    renderBackgroundOptions([], "Không có ảnh trong folder");
    setStatus("Folder chưa có ảnh PNG/JPG/WEBP.");
    return;
  }

  backgroundOptions = files.map((file) => ({
    name: file.webkitRelativePath || file.name,
    url: URL.createObjectURL(file),
    revoke: true
  }));

  renderBackgroundOptions(backgroundOptions);
});

backgroundImageSelect.addEventListener("change", () => {
  setCustomBackground(Number(backgroundImageSelect.value));
});

resetBackgroundPositionButton.addEventListener("click", () => {
  backgroundControls.x.value = 0;
  backgroundControls.y.value = 0;
  backgroundControls.scale.value = 100;
  backgroundControls.opacity.value = 100;
  applyBackgroundPosition();
  setStatus("Đã đưa background về vị trí mặc định.");
});

removeBackgroundButton.addEventListener("click", () => {
  backgroundImageSelect.value = "";
  setCustomBackground(-1);
  setStatus("Đã xóa background ảnh khỏi thiệp.");
});

customBgStyle.addEventListener("change", () => {
  applyCustomColors();
  setStatus(`Đã đổi kiểu nền trên mẫu ${styleSelect.options[styleSelect.selectedIndex].text}.`);
});

resetColorButton.addEventListener("click", () => {
  card.classList.remove("custom-colors-active");
  card.classList.remove(...backgroundModeClasses);
  document.body.classList.remove("custom-page-bg");
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

schoolLogo.addEventListener("load", () => {
  ribbonEmblem.classList.add("has-logo");
});

schoolLogo.addEventListener("error", () => {
  ribbonEmblem.classList.remove("has-logo");
});

if (schoolLogo.complete && schoolLogo.naturalWidth === 0) {
  ribbonEmblem.classList.remove("has-logo");
}

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
applyPhotoPosition();
applyBackgroundPosition();
loadDefaultBackgroundAssets();
