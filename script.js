const mainContainerEle = document.querySelector(".mainContainer");

const randomBetween = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

// Used for random pixel colouring mode
const generateRandomRGB = function () {
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);
  return (rgb = `rgb(${r},${g},${b})`); // Collect all to a css color string
};

// Draw the original layout grid
const drawPixels = function (pixelsPerSide) {
  for (let i = 0; i < pixelsPerSide * pixelsPerSide; i++) {
    // Inside the loop so it creates a new RGB value each time. Otherwise could be before loop for template
    const pixelHTML = `<div class="pixel" style="width: ${
      100 / pixelsPerSide
    }%; background-color: ${generateRandomRGB()};"></div>`;
    mainContainerEle.insertAdjacentHTML("beforeend", pixelHTML);
  }
};

mainContainerEle.addEventListener("click", function (e) {
  console.log(`Clicked on ${e.target}`);
});

drawPixels(50);

const generatePixelElement = function () {
  const newPixel = document.createElement("div");
  newPixel.classList.add("pixel");
  newPixel.style.width = `${100 / pixelsPerSide}%`;
  newPixel.style.backgroundColor = generateRandomRGB();
  return newPixel;
};
