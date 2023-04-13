const mainContainerEle = document.querySelector(".mainContainer");
const settingsContainerEle = document.querySelector(".settings");
const sizeSetterEle = document.querySelector("#size");

// Track app state / settings
const state = {
  mouseDown: false,
  mode: "black",
  gridSize: 5,
  border: false,
};

const randomBetween = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

// Create the appropriate pixel depending on the mode
const generateRGB = function () {
  if (state.mode === "rainbow") return generateRandomRGB();
  if (state.mode === "black") return (rgb = `rgb(0,0,0)`);
  if (state.mode === "eraser") return (rgb = `rgb(255,255,255)`);
};

// Used for random pixel colouring mode
const generateRandomRGB = function () {
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);
  return (rgb = `rgb(${r},${g},${b})`); // Collect all to a css color string
};

// Draw the original layout grid
const drawPixelsHTML = function () {
  const pixelsPerSide = state.gridSize;
  mainContainerEle.innerHTML = ""; // Could use a while loop but faster as no event listeners
  const pixelHTML = `<div class="pixel" style="width: ${
    100 / pixelsPerSide
  }%; background-color: white;"></div>`;
  // Alternate - create an array of strings and forEach through it
  for (let i = 0; i < pixelsPerSide * pixelsPerSide; i++) {
    // Mosaic mode - generates random pixels
    // const pixelHTML = `<div class="pixel" style="width: ${
    //   100 / pixelsPerSide
    // }%; background-color: ${generateRandomRGB(pixelsPerSide)};"></div>`;

    mainContainerEle.insertAdjacentHTML("beforeend", pixelHTML);
  }
};

const toggleBorder = function () {
  state.border = !state.border;
  if (state.border) drawBorders();
  else removeBorders();
};

const drawBorders = function () {
  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach((pixel) => pixel.classList.add("bordered"));
};

const removeBorders = function () {
  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach((pixel) => pixel.classList.remove("bordered"));
};

const drawPixelsHTMLRandom = function () {
  const pixelsPerSide = state.gridSize;
  mainContainerEle.innerHTML = ""; // Could use a while loop but faster as no event listeners
  for (let i = 0; i < pixelsPerSide * pixelsPerSide; i++) {
    // Mosaic mode - generates random pixels
    const pixelHTML = `<div class="pixel" style="width: ${
      100 / pixelsPerSide
    }%; background-color: ${generateRandomRGB(pixelsPerSide)};"></div>`;
    mainContainerEle.insertAdjacentHTML("beforeend", pixelHTML);
  }
  if (state.border) drawBorders();
};

// Only want mouse move to trigger if the mouse is down - ie drag mouse
mainContainerEle.addEventListener("mousedown", function (e) {
  state.mouseDown = true;
});

mainContainerEle.addEventListener("mouseup", function (e) {
  state.mouseDown = false;
});

mainContainerEle.addEventListener("mousemove", function (e) {
  const pixel = e.target.closest(".pixel");
  // Could combine into a NAND but this is clearer guard clause?
  if (!pixel) return;
  if (!state.mouseDown) return;

  // Only change the colour if you've clicked on a pixel AND the mouse is down
  pixel.style.backgroundColor = generateRGB();
});

// TODO Separate so different for colour and function
settingsContainerEle.addEventListener("click", function (e) {
  const btn = e.target.closest(".button");
  if (!btn) return;

  if (e.target.dataset.mode === "magic") {
    drawPixelsHTMLRandom();
    return;
  }

  if (e.target.dataset.mode === "reset") {
    state.border = false;
    drawPixelsHTML();
    return;
  }

  if (e.target.dataset.mode === "border") {
    toggleBorder();
    return;
  }

  state.mode = e.target.dataset.mode;
});

sizeSetterEle.addEventListener("change", function (e) {
  console.log(e);
  e.preventDefault();
  state.gridSize = e.target.value <= 100 ? e.target.value : 100;
  sizeSetterEle.value = state.gridSize;
  drawPixelsHTML();
});

sizeSetterEle.addEventListener("submit", function (e) {
  console.log(e);
  e.preventDefault();
  drawPixelsHTML(e.target.value);
});

drawPixelsHTML();
