// https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js
import { Easing, Group, Tween } from "./lib/tween.esm.js";

export default class Eye {
  // global animation values
  blinkTimeout = 5000;
  easingFunc = Easing.Quadratic.Out;

  // remember previous eyeball position, and store reference to the tween
  eyeballTween;
  eyeballCoords = { x: 0, y: 0 };

  constructor(selector) {
    this.el = document.querySelector(selector);
  }

  // render the eye from the external SVG
  async renderEye(eyeData) {
    this.el.innerHTML = eyeData;
    this.svg = this.el.querySelector("svg");
    this.pupil = this.svg.querySelector("#eyeball-pupil");
  }

  // draw the eye and make it blink every x seconds
  drawBlink() {
    const eye = this.svg.querySelector("#eye-path");

    const openCoords = { x: 50, y1: -20, y2: 120 };
    const closedCoords = { x: 0, y1: 45, y2: 50 };

    const group = new Group();

    const closeTween = new Tween(openCoords, group)
      .to(closedCoords, 300)
      .easing(this.easingFunc)
      .onUpdate(updateEye)
      .onComplete(() => {
        openTween.start();
        setTimeout(() => {
          closeTween.start();
        }, this.blinkTimeout);
      })
      .start();

    const openTween = new Tween(closedCoords, group)
      .to(openCoords, 300)
      .easing(this.easingFunc)
      .onUpdate(updateEye)
      .start();

    function updateEye(newCoords) {
      eye.setAttribute(
        "d",
        `M10,50 C10,50 ${newCoords.x},${newCoords.y1} 90,50 C90,50 ${newCoords.x},${newCoords.y2} 10,48`
      );
    }

    return group;
  }

  // draw and animate all of the lashes
  drawLashes() {
    const eyeLashesEl = this.svg.querySelector("#eye-lashes");
    const eyelashes = [
      {
        id: "eye-lash-top-1",
        open: { x1: 5, y1: 20, x2: 25, y2: 40 },
        closed: { x1: 20, y1: 25, x2: 20, y2: 50 },
      },
      {
        id: "eye-lash-top-2",
        open: { x1: 50, y1: 0, x2: 50, y2: 25 },
        closed: { x1: 50, y1: 25, x2: 50, y2: 50 },
      },
      {
        id: "eye-lash-top-3",
        open: { x1: 95, y1: 20, x2: 70, y2: 40 },
        closed: { x1: 80, y1: 25, x2: 80, y2: 50 },
      },
      {
        id: "eye-lash-btm-1",
        open: { x1: 25, y1: 70, x2: 10, y2: 85 },
        closed: { x1: 20, y1: 50, x2: 20, y2: 70 },
      },
      {
        id: "eye-lash-btm-2",
        open: { x1: 50, y1: 75, x2: 50, y2: 100 },
        closed: { x1: 50, y1: 50, x2: 50, y2: 70 },
      },
      {
        id: "eye-lash-btm-3",
        open: { x1: 70, y1: 70, x2: 85, y2: 85 },
        closed: { x1: 80, y1: 50, x2: 80, y2: 70 },
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
        .easing(this.easingFunc)
        .onUpdate(updateEyelash)
        .onComplete(() => {
          openTween.start();
          setTimeout(() => {
            closeTween.start();
          }, this.blinkTimeout);
        })
        .start();

      const openTween = new Tween(eyelash.closed, group)
        .to(eyelash.open, 300)
        .easing(this.easingFunc)
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

  // move the pupil when the face detection changes
  movePupil(newEyeballCoords) {
    if (this.eyeballTween) {
      this.eyeballTween.stop();
    }
    this.eyeballTween = new Tween(this.eyeballCoords)
      .to(newEyeballCoords, 300)
      .easing(this.easingFunc)
      .onUpdate((newCoords) => {
        this.pupil.style.transform = `translate(${newCoords.x}px, ${newCoords.y}px)`;
      })
      .onComplete(() => {
        this.eyeballCoords.x = newEyeballCoords.x;
        this.eyeballCoords.y = newEyeballCoords.y;
      })
      .start();
    return this.eyeballTween;
  }
}
