// https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js
import { Easing, Group, Tween } from "./lib/tween.esm.js";

// global animation values
const blinkTimeout = 5000;
const easingFunc = Easing.Quadratic.Out;

// cache DOM element references
const videoEl = document.querySelector("#debug-video");
const canvas = document.querySelector("#debug-overlay");
let svg, pupil, iris;

// import the eye SVG so we can manipulate with JS
function loadSVG() {
  return fetch("./img/eye.svg")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#svg-wrapper").innerHTML = data;

      svg = document.querySelector("svg");
      pupil = svg.querySelector("#eyeball-pupil");
      iris = svg.querySelector("#eyeball-iris");
    });
}

// draw the eye and make it blink every x seconds
function blink() {
  const svg = document.querySelector("svg");
  const eye = svg.querySelector("#eye-path");

  const openCoords = { x: 240, y1: -50, y2: 250 };
  const closedCoords = { x: 0, y1: 100, y2: 100 };

  const group = new Group();

  const closeTween = new Tween(openCoords, group)
    .to(closedCoords, 300)
    .easing(easingFunc)
    .onUpdate(updateEye)
    .onComplete(() => {
      openTween.start();
      setTimeout(() => {
        closeTween.start();
      }, blinkTimeout);
    })
    .start();

  const openTween = new Tween(closedCoords, group)
    .to(openCoords, 300)
    .easing(easingFunc)
    .onUpdate(updateEye)
    .start();

  function updateEye(newCoords) {
    eye.setAttribute(
      "d",
      `M0,100 C0,100 ${newCoords.x},${newCoords.y1} 480,100 C480,100 ${newCoords.x},${newCoords.y2} 0,100`
    );
  }

  return group;
}

// draw and animate all of the lashes
function lashes() {
  const svg = document.querySelector("svg");
  const eyeLashesEl = svg.querySelector("#eye-lashes");
  const eyelashes = [
    {
      id: "eye-lash-top-1",
      open: { x1: 25, y1: 55, x2: 40, y2: 80 },
      closed: { x1: 40, y1: 70, x2: 40, y2: 100 },
    },
    {
      id: "eye-lash-top-2",
      open: { x1: 130, y1: 15, x2: 140, y2: 55 },
      closed: { x1: 140, y1: 70, x2: 140, y2: 100 },
    },
    {
      id: "eye-lash-top-3",
      open: { x1: 240, y1: 0, x2: 240, y2: 35 },
      closed: { x1: 240, y1: 70, x2: 240, y2: 100 },
    },
    {
      id: "eye-lash-top-4",
      open: { x1: 350, y1: 15, x2: 340, y2: 55 },
      closed: { x1: 340, y1: 70, x2: 340, y2: 100 },
    },
    {
      id: "eye-lash-top-5",
      open: { x1: 455, y1: 55, x2: 440, y2: 80 },
      closed: { x1: 440, y1: 70, x2: 440, y2: 100 },
    },
    {
      id: "eye-lash-btm-1",
      open: { x1: 40, y1: 125, x2: 25, y2: 150 },
      closed: { x1: 40, y1: 100, x2: 40, y2: 130 },
    },
    {
      id: "eye-lash-btm-2",
      open: { x1: 140, y1: 155, x2: 130, y2: 185 },
      closed: { x1: 140, y1: 100, x2: 140, y2: 130 },
    },
    {
      id: "eye-lash-btm-3",
      open: { x1: 240, y1: 140, x2: 240, y2: 200 },
      closed: { x1: 240, y1: 100, x2: 240, y2: 130 },
    },
    {
      id: "eye-lash-btm-4",
      open: { x1: 340, y1: 155, x2: 350, y2: 185 },
      closed: { x1: 340, y1: 100, x2: 340, y2: 130 },
    },
    {
      id: "eye-lash-btm-5",
      open: { x1: 440, y1: 120, x2: 455, y2: 150 },
      closed: { x1: 440, y1: 100, x2: 440, y2: 130 },
    },
  ];

  const group = new Group();

  eyelashes.map((eyelash) => {
    const eyelashEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    eyelashEl.setAttribute("id", eyelash.id);
    eyelashEl.setAttribute("x1", eyelash.open.x1);
    eyelashEl.setAttribute("x2", eyelash.open.x2);
    eyelashEl.setAttribute("y1", eyelash.open.y1);
    eyelashEl.setAttribute("y2", eyelash.open.y2);
    eyelashEl.setAttribute("stroke", "#000000");
    eyelashEl.setAttribute("stroke-width", "5px");
    eyeLashesEl.appendChild(eyelashEl);

    const closeTween = new Tween(eyelash.open, group)
      .to(eyelash.closed, 300)
      .easing(easingFunc)
      .onUpdate(updateEyelash)
      .onComplete(() => {
        openTween.start();
        setTimeout(() => {
          closeTween.start();
        }, blinkTimeout);
      })
      .start();

    const openTween = new Tween(eyelash.closed, group)
      .to(eyelash.open, 300)
      .easing(easingFunc)
      .onUpdate(updateEyelash)
      .start();

    function updateEyelash(newCoords) {
      eyelashEl.setAttribute("x1", newCoords.x1);
      eyelashEl.setAttribute("x2", newCoords.x2);
      eyelashEl.setAttribute("y1", newCoords.y1);
      eyelashEl.setAttribute("y2", newCoords.y2);
    }
  });

  return group;
}

// ----

async function startVideo() {
  // load face detection library
  await faceapi.nets.tinyFaceDetector.load("./js/lib/");

  // start webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  videoEl.srcObject = stream;

  // init when ready
  videoEl.addEventListener("loadedmetadata", detectFacePosition);
}

// remember previous eyeball position, and store reference to the tween
let eyeballTween;
const eyeballCoords = { x: 0, y: 0 };

// re-check face position every x milliseconds
async function detectFacePosition() {
  if (videoEl.paused || videoEl.ended || !faceapi.nets.tinyFaceDetector.params)
    return setTimeout(() => detectFacePosition());

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 512,
    scoreThreshold: 0.5,
  });

  const result = await faceapi.detectSingleFace(videoEl, options);
  if (result) {
    // allowed movement range (relative to initial position - centered)
    const xRange = { min: 245, max: -245 };
    const yRange = { min: -60, max: 60 };

    // calculate centre of face position, as a percentage of total width/height
    const x =
      (result._box._x + result._box._width / 2) / result._imageDims._width;
    const y =
      (result._box._y + result._box._height / 2) / result._imageDims._height;

    // convert face position to point in x/y range
    const eyePos = {
      x: (xRange.max - xRange.min) * x + xRange.min,
      y: (yRange.max - yRange.min) * y + yRange.min,
    };

    if (eyeballTween) {
      eyeballTween.stop();
    }

    eyeballTween = new Tween(eyeballCoords)
      .to(eyePos, 300)
      .easing(easingFunc)
      .onUpdate((newCoords) => {
        iris.style.transform = `translate(${newCoords.x}px, ${newCoords.y}px)`;
        pupil.style.transform = `translate(${newCoords.x}px, ${newCoords.y}px)`;
      })
      .onComplete(() => {
        eyeballCoords.x = eyePos.x;
        eyeballCoords.y = eyePos.y;
      })
      .start();

    debugCurrentEyePosition(result, x, y);
  }

  setTimeout(() => detectFacePosition(), 10);
}

// ----

function animateEye(blinkAnim, lashesAnim) {
  function _animate(time) {
    blinkAnim.update(time);
    lashesAnim.update(time);
    if (eyeballTween) {
      eyeballTween.update(time);
    }
    requestAnimationFrame(_animate);
  }
  _animate();
}

// ----

function initDebug() {
  const debugBtn = document.querySelector("#debug-toggle");
  debugBtn.addEventListener("click", () => {
    const debugEl = document.querySelector("#debug-panel");
    debugEl.classList.toggle("open");
    debugBtn.classList.toggle("active");
  });
}

function debugCurrentEyePosition(result, x, y) {
  const dims = faceapi.matchDimensions(canvas, videoEl, true);
  faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims));

  const debugBox = document.querySelector("#debug-values");
  debugBox.innerHTML = `
          X: ${result._box._x.toFixed(2)}<br>
          Y: ${result._box._y.toFixed(2)}<br>
          W: ${result._box._width.toFixed(2)}<br>
          H: ${result._box._height.toFixed(2)}<br>
          Box W: ${result._imageDims._width.toFixed(2)}<br>
          Box H: ${result._imageDims._height.toFixed(2)}<br>
          ---------------<br>
          X%: ${(x * 100).toFixed(2)}<br>
          Y%: ${(y * 100).toFixed(2)}
        `;
}

// ----

async function init() {
  await loadSVG();
  startVideo();
  const blinkAnim = blink();
  const lashesAnim = lashes();
  animateEye(blinkAnim, lashesAnim);
  initDebug();
}

init();
