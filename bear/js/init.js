import Eye from "./eye.js";
import FaceTracker from "./face-tracker.js";
import Sound from "./sound.js";

// ----

function animate(tweens) {
  function _animate(time) {
    tweens.map((tween) => tween && tween.update(time));
    requestAnimationFrame(_animate);
  }
  _animate();
}

// ----

// import the eye SVG so we can manipulate it with JS
function loadSVG() {
  return fetch("./img/eye.svg")
    .then((response) => response.text())
    .then((data) => data);
}

// ----

async function init() {
  const sound = new Sound();
  sound.init();

  const svgData = await loadSVG();

  const tweens = [];

  // draw and animate eyes
  const eyes = [];
  eyes.push(new Eye("#left-eye"), new Eye("#right-eye"));
  eyes.map((eye) => {
    eye.renderEye(svgData);
    tweens.push(eye.drawBlink());
    tweens.push(eye.drawLashes());
  });

  // proxy the eye position from the face tracker so we can watch for changes
  const eyePosition = { x: 0, y: 0 };
  const proxiedEyePosition = new Proxy(eyePosition, {
    set(target, prop, value) {
      eyes.forEach((eye) => tweens.push(eye.movePupil(eyePosition)));
      target[prop] = value;
      return true;
    },
  });

  // proxy the box dimensions from the face tracker so we can watch for changes
  const boxDimensions = { w: 0, h: 0 };
  const proxiedBoxDimensions = new Proxy(boxDimensions, {
    set(target, prop, value) {
      sound.checkBoxSize(boxDimensions);
      target[prop] = value;
      return true;
    },
  });

  const faceTracker = new FaceTracker(proxiedEyePosition, proxiedBoxDimensions);
  faceTracker.init();

  animate(tweens);
}

init();
