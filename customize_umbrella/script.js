const body = document.querySelector("body");
const colorIcons = document.querySelectorAll(".color-icon");
const imgContainer = document.querySelector("figure");
const umbrellaImg = document.querySelector("#umbrella_img");
const uploadButton = document.querySelector(".button");
const buttonText = document.querySelector(".button-text");
const uploadIcon = document.querySelector(".upload-icon");
const loadingIcon = document.querySelector(".loading-icon");
const fileInput = document.querySelector("#files");
const label = document.querySelector("label[for=files]");
const cancelButton = document.querySelector(".cancel-btn");
const errorText = document.querySelector(".error");
const logo = document.querySelector(".logo");
let isLogoPresent = false;
let file = null;
let activeIcon;
let timeout;
let colorState = "blue";

function updateColor(icon) {
  const color = icon.getAttribute("data-color");
  console.log(color, "got color");
  colorState = color;

  clearTimeout(timeout);
  updateUI(color);
}

const updateUI = (color) => {
  colorIcons.forEach((i) => i.classList.remove("active"));
  activeIcon = document.querySelector(`.color-icon[data-color="${color}"]`);
  activeIcon.classList.add("active");

  umbrellaImg.classList.remove("fade-in-image");
  updateImage(color);

  updateStyles(color);
};

const updateImage = (color) => {
  const svg = createSVG(
    getComputedStyle(document.documentElement).getPropertyValue(`--${color}`)
  );
  imgContainer.innerHTML = "";
  imgContainer.append(svg);

  timeout = setTimeout(
    () => {
      imgContainer.innerHTML = "";
      imgContainer.append(umbrellaImg);
      imgContainer.append(logo);
      umbrellaImg.src = `./assets/${color}_umbrella.png`;
      umbrellaImg.classList.add("fade-in-image");
    },
    isLogoPresent ? 1000 : 100
  );
  if (isLogoPresent && file) {
    logo.src = URL.createObjectURL(file);
    logo.style.display = "block";
    logo.style.zIndex = "100";
  }
};

const updateStyles = (color) => {
  const styleVar = `var(--${color})`;
  [uploadButton, buttonText, uploadIcon].forEach((elem) => {
    elem.style.backgroundColor = styleVar;
  });

  activeIcon.style.borderColor = `var(--${color}-outline)`;
  activeIcon.style.backgroundColor = styleVar;
  body.style.backgroundColor = `var(--${color}-background)`;
};

colorIcons.forEach((icon) => {
  icon.addEventListener("click", () => updateColor(icon));
});

const handleFileUpload = (event) => {
  file = event.target.files[0];
  if (file && validateFile(file)) {
    updateLabel(file.name);
    cancelButton.style.display = "block";
  } else {
    return;
  }
  handleLoading(file);

  setTimeout(() => {
    logo.src = URL.createObjectURL(file);
    logo.style.display = "block";
  }, 4000);

  isLogoPresent = true;
};

const validateFile = (file) => {
  if (!/image\/(png|jpe?g)$/i.test(file.type)) {
    showError("File type not supported!");
    return false;
  }

  const fileSize = file.size / (1024 * 1024);
  if (fileSize > 5) {
    showError("File size exceeds 5 MB!");
    return false;
  }

  return true;
};

function showError(message) {
  errorText.innerText = message;
  setTimeout(() => (errorText.innerText = ""), 1500);
}

function updateLabel(fileName) {
  label.innerText =
    fileName.length > 12
      ? `${fileName.substr(0, 12)}...${fileName.substr(-5)}`
      : fileName;
}

cancelButton.addEventListener("click", handleCancel);

function handleCancel(e) {
  e.stopPropagation();
  handleRemoveLogo();
}

const handleRemoveLogo = () => {
  fileInput.value = "";
  file = null;
  label.innerText = "UPLOAD LOGO";
  cancelButton.style.display = "none";
  logo.src = "";
  logo.style.display = "none";
  isLogoPresent = false;
};

const handleLoading = () => {
  const colorValue = getComputedStyle(
    document.documentElement
  ).getPropertyValue(`--${colorState}`);

  const svg = createSVG(colorValue);
  svg.classList.add("rotate");

  if (imgContainer.contains(umbrellaImg)) {
    imgContainer.removeChild(umbrellaImg);
  }

  imgContainer.appendChild(svg);

  if (imgContainer.contains(logo)) {
    logo.style.display = "none";
  }

  uploadIcon.style.display = "none";
  loadingIcon.style.display = "block";
  loadingIcon.classList.add("rotate");

  setTimeout(() => {
    if (imgContainer.contains(svg)) {
      imgContainer.removeChild(svg);
    }
    imgContainer.appendChild(umbrellaImg);
    umbrellaImg.src = `./assets/${colorState}_umbrella.png`;
    umbrellaImg.classList.add("fade-in-image");
    umbrellaImg.style.opacity = 1;

    uploadIcon.style.display = "block";
    loadingIcon.style.display = "none";
    loadingIcon.classList.remove("rotate");
  }, 2000);
};

const createSVG = (color) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "80");
  svg.setAttribute("height", "80");
  svg.setAttribute("viewBox", "0 0 28.3 31.2");
  svg.innerHTML = `<path fill="${color}" d="M25.1 23.6c-.3.1-.6.2-1 .2-.6.1-1.3 0-2.1.1s-1.7.3-2.6.8c-.8.5-1.4 1.1-1.9 1.6-.7.9-1.1 1.7-1.5 2.2-.2.3-.4.4-.7.6-.2.1-.4.2-.8.2v-13L26 22.9c-.3.3-.6.5-.9.7m-11.3 5.9c-.5-.1-.8-.2-1-.4-.2-.2-.5-.4-.7-.7-.3-.5-.7-1.1-1.2-1.7-.5-.7-1.1-1.3-2.1-1.9-.8-.5-1.6-.7-2.3-.8-1.1-.2-2-.1-2.7-.2l-.9-.3c-.2-.1-.4-.3-.6-.6l11.4-6.6v13.2zM1.7 21.3c0-.3.1-.6.2-1 .2-.5.6-1.1.9-1.9.3-.8.6-1.7.6-2.8v-.1c0-1.5-.6-2.6-1-3.5l-.6-1.2c-.1-.4-.2-.7-.2-1 0-.3.1-.6.2-1l11.4 6.6-11.3 6.8c-.1-.4-.2-.7-.2-.9M3.2 7.6c.3-.1.6-.2 1-.2.6-.1 1.3 0 2.1-.1.7-.2 1.6-.4 2.5-.9.8-.5 1.4-1.1 1.9-1.6.7-.9 1.1-1.7 1.5-2.2.2-.3.4-.4.7-.6.2-.1.5-.2.8-.2V15L2.3 8.3c.3-.4.6-.6.9-.7m11.3-5.9c.5 0 .8.2 1 .4.2.2.5.4.7.7.3.5.7 1.1 1.2 1.7.5.7 1.1 1.3 2.1 1.9.8.5 1.6.7 2.4.8 1.1.1 2 .1 2.7.2l.9.3c.2.1.4.3.6.6l-11.4 6.6V1.7zm12.1 8.2c0 .3-.1.6-.2 1-.2.5-.6 1.1-.9 1.9-.3.8-.6 1.7-.6 2.8v.2c0 1.5.5 2.6 1 3.5l.6 1.2c.1.4.2.7.2 1 0 .3-.1.6-.2.9l-11.4-6.6L26.3 9c.2.4.3.7.3.9m.4 7.8c-.3-.6-.5-1.3-.5-2v-.1c0-1 .4-1.8.8-2.7.2-.4.5-.8.6-1.3.2-.5.3-1 .3-1.6 0-.7-.2-1.4-.6-2.1-.5-.8-1.1-1.4-1.8-1.7-.5-.2-1-.3-1.5-.4-.7-.1-1.4-.1-2.1-.1-.7-.1-1.3-.2-1.9-.6-.6-.3-1-.7-1.4-1.2-.5-.9-.9-1.7-1.6-2.5-.3-.4-.7-.8-1.3-1-.5-.3-1.1-.4-1.9-.4-1 0-1.8.2-2.4.7-.5.3-.8.7-1.1 1.1-.4.6-.7 1.2-1.1 1.7-.4.5-.8 1-1.5 1.4-.6.4-1.2.5-1.8.6-.9.1-1.8 0-2.8.2-.5.1-1 .3-1.5.7-.5.3-.9.8-1.3 1.4C.2 8.5 0 9.3 0 10c0 .6.1 1.1.3 1.6.3.7.7 1.3 1 2 .3.6.5 1.3.5 2.1v.1c0 1.1-.4 1.8-.8 2.7-.2.4-.5.8-.6 1.3-.2.5-.3 1-.3 1.6 0 .7.2 1.4.6 2.1.5.8 1.1 1.4 1.8 1.7.5.2 1 .3 1.5.4.7.1 1.4.1 2.1.1.7.1 1.3.2 2 .6.6.3 1 .7 1.4 1.2.5.7.9 1.5 1.6 2.3.3.4.7.7 1.3 1 .5.3 1.2.4 1.9.4 1 0 1.8-.3 2.4-.7.5-.3.8-.7 1.1-1.1.4-.6.8-1.2 1.2-1.7.4-.5.8-1 1.5-1.4.6-.3 1.1-.5 1.7-.6.9-.1 1.8 0 2.8-.2.5-.1 1-.3 1.5-.6s.9-.8 1.3-1.4c.4-.7.6-1.5.6-2.1 0-.6-.1-1.1-.3-1.6-.5-.9-.8-1.5-1.1-2.1"></path>`;
  return svg;
};
