const card = document.getElementById("invitationCard");
const form = document.getElementById("editorForm");
const styleSelect = document.getElementById("styleSelect");
const photoInput = document.getElementById("photoInput");
const logoInput = document.getElementById("logoInput");
const graduateImage = document.getElementById("graduateImage");
const schoolLogo = document.getElementById("schoolLogo");
const ribbonEmblem = document.querySelector(".ribbon-emblem");
const animationToggle = document.getElementById("animationToggle");
const downloadButton = document.getElementById("downloadButton");
const statusMessage = document.getElementById("statusMessage");

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
  "template-satin-blue"
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

form.addEventListener("input", (event) => {
  const input = event.target;
  const target = input.dataset.target;

  if (!target) {
    return;
  }

  updateBoundText(target, input.value);
});

styleSelect.addEventListener("change", () => {
  card.classList.remove(...templateClasses);
  card.classList.add(styleSelect.value);
  setStatus(`Đã đổi sang mẫu ${styleSelect.options[styleSelect.selectedIndex].text}.`);
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
