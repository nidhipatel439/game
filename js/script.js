import { setupGround, updateGround } from "./ground.js";
import { getDinoRect, setDinoLose, setupDino, updateDino } from "./dino.js";
import { getCactusRects, setupCactus, updateCactus } from "./cactus.js";

const windowWidth = 100;
const windowHeight = 30;
const speed = 0.00001;

const mainElem = document.querySelector("[data-main]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

setPixelToMainScale();
window.addEventListener("resize", setPixelToMainScale);
document.addEventListener("keydown", handleStart, {
  once: true,
});
document.addEventListener("touchstart", handleStart, {
  once: true,
});

let lastTime;
let speedScale;
let score;

function update(time) {
  if (lastTime === null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }

  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedSclae(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoReact = getDinoRect();
  return getCactusRects().some((rect) => isCollision(rect, dinoReact));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedSclae(delta) {
  speedScale += delta * speed;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, {
      once: true,
    });
    document.addEventListener("touchstart", handleStart, {
      once: true,
    });
    startScreenElem.classList.remove("hide");
  }, 100);
}

function setPixelToMainScale() {
  let mainToPixelSclae;
  if (window.innerWidth / window.innerHeight < windowWidth / windowHeight) {
    mainToPixelSclae = window.innerWidth / windowWidth;
  } else {
    mainToPixelSclae = window.innerHeight / windowHeight;
  }

  mainElem.style.width = `${windowWidth * mainToPixelSclae}px`;
  mainElem.style.height = `${windowHeight * mainToPixelSclae}px`;
}
