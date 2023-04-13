const mainContainerEle = document.querySelector(".mainContainer");
const colourModesContainer = document.querySelector(".colourModes");
const otherSettingsContainer = document.querySelector(".otherSettings");
const gridSizeSetterEle = document.querySelector("#gridSizeInput");

// Track app state / settings
const state = {
  mouseDown: false,
  mode: "black",
  gridSize: 5,
  border: false,
  lastEle: undefined,
  minSize: 1,
  maxSize: 100,
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

/* Core functionality */

// Draw the original layout grid
const drawPixels = function (mode = "standard") {
  const pixelsPerSide = state.gridSize;
  // Could use a while loop but faster as no event listeners
  mainContainerEle.innerHTML = "";

  let pixelHTML = `<div class="pixel" style="width: ${
    100 / pixelsPerSide
  }%; background-color: white;"></div>`;

  for (let i = 0; i < pixelsPerSide * pixelsPerSide; i++) {
    // DRY
    if (mode === "mosaic") {
      pixelHTML = `<div class="pixel" style="width: ${
        100 / pixelsPerSide
      }%; background-color: ${generateRandomRGB(pixelsPerSide)};"></div>`;
    }

    mainContainerEle.insertAdjacentHTML("beforeend", pixelHTML);
  }
  if (state.border) drawBorders();
};

/* Border logic */
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

/* Event listeners */

// Used to allow for click + drag instead of just mouse over.
mainContainerEle.addEventListener("mousedown", function (e) {
  state.mouseDown = true;
});

mainContainerEle.addEventListener("mouseup", function (e) {
  state.mouseDown = false;
});

// Colour pixels if mouse down and it's a new pixel
mainContainerEle.addEventListener("mousemove", function (e) {
  const pixel = e.target.closest(".pixel");
  // I find this cleaner than a NAND
  if (!pixel) return;
  if (!state.mouseDown) return;

  // Keep track of last element - stops recolouring same pixel
  if (e.target === state.lastEle) return;
  state.lastEle = e.target;
  pixel.style.backgroundColor = generateRGB();
});

colourModesContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".button");
  if (!btn) return;

  state.mode = e.target.dataset.mode;
});

otherSettingsContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".button");
  if (!btn) return;

  if (e.target.dataset.mode === "magic") {
    drawPixels("mosaic");
    return;
  }

  if (e.target.dataset.mode === "reset") {
    state.border = false;
    drawPixels();
    return;
  }

  if (e.target.dataset.mode === "border") {
    toggleBorder();
    return;
  }
});

gridSizeSetterEle.addEventListener("change", function (e) {
  // Don't refresh page on submit
  e.preventDefault();
  // Data validation - an integer in range min <= x => max size.
  let desiredValue = Math.floor(e.target.value);

  if (desiredValue <= 1) desiredValue = state.minSize;
  if (desiredValue > state.maxSize) desiredValue = state.maxSize;

  state.gridSize = desiredValue;
  gridSizeSetterEle.value = state.gridSize;
  drawPixels();
});

drawPixels();

//  Mobile friendly - Doesn't work on my phone
// Only want mouse move to trigger if the mouse is down - ie drag mouse
mainContainerEle.addEventListener("touchstart", function (e) {
  state.mouseDown = true;
});

mainContainerEle.addEventListener("touchend", function (e) {
  state.mouseDown = false;
});

mainContainerEle.addEventListener("touchmove", function (e) {
  const pixel = e.target.closest(".pixel");
  // Could combine into a NAND but this is clearer guard clause?
  if (!pixel) return;
  if (!state.mouseDown) return;

  // Only change the colour if you've clicked on a pixel AND the mouse is down
  pixel.style.backgroundColor = generateRGB();
});
