export default class FaceTracker {
  isDebugging = false;

  constructor(eyePosition, boxDimensions) {
    // cache DOM element references
    this.videoEl = document.querySelector("#debug-video");
    this.canvas = document.querySelector("#debug-overlay");
    this.debugBox = document.querySelector("#debug-values");

    // use externally proxied eyePosition object so updates can be tracked
    this.eyePosition = eyePosition;

    // use externally proxied boxDimensions object so updates can be tracked
    this.boxDimensions = boxDimensions;
  }

  async init() {
    // load face detection library
    await faceapi.nets.tinyFaceDetector.load("./js/lib/");

    // start webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.videoEl.srcObject = stream;

    this.videoEl.addEventListener(
      "loadedmetadata",
      this.detectFacePosition.bind(this)
    );

    this.initDebug();
  }

  // re-check face position every x milliseconds
  async detectFacePosition() {
    const timeout = 10;

    if (
      !this.videoEl.paused &&
      !this.videoEl.ended &&
      !!faceapi.nets.tinyFaceDetector.params
    ) {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5,
      });

      const result = await faceapi.detectSingleFace(this.videoEl, options);

      if (result) {
        // allowed movement range (relative to initial position - centered)
        const xRange = { min: 30, max: -30 };
        const yRange = { min: -25, max: 25 };

        // calculate centre of face position, as a percentage of total width/height
        const x =
          (result._box._x + result._box._width / 2) / result._imageDims._width;
        const y =
          (result._box._y + result._box._height / 2) /
          result._imageDims._height;

        // convert face position to point in x/y range
        this.eyePosition.x = (xRange.max - xRange.min) * x + xRange.min;
        this.eyePosition.y = (yRange.max - yRange.min) * y + yRange.min;

        // make width and height externally available
        this.boxDimensions.w = result._box._width;
        this.boxDimensions.h = result._box._height;

        this.debugCurrentEyePosition(result, x, y);
      }
    }

    setTimeout(() => this.detectFacePosition(), timeout);
  }

  // ---

  initDebug() {
    const debugBtn = document.querySelector("#debug-toggle");
    debugBtn.addEventListener("click", () => {
      const debugEl = document.querySelector("#debug-panel");
      debugEl.classList.toggle("open");
      debugBtn.classList.toggle("active");
      this.isDebugging = !this.isDebugging;
    });
  }

  debugCurrentEyePosition(result, x, y) {
    if (this.isDebugging) {
      const dims = faceapi.matchDimensions(this.canvas, this.videoEl, true);
      faceapi.draw.drawDetections(
        this.canvas,
        faceapi.resizeResults(result, dims)
      );

      this.debugBox.innerHTML = `
            X: ${result._box._x.toFixed(2)}<br>
            Y: ${result._box._y.toFixed(2)}<br>
            W: ${result._box._width.toFixed(2)}<br>
            H: ${result._box._height.toFixed(2)}<br>
            Box W: ${result._imageDims._width.toFixed(2)}<br>
            Box H: ${result._imageDims._height.toFixed(2)}<br>
            ---------------<br>
            X%: ${(x * 100).toFixed(2)}<br>
            Y%: ${(y * 100).toFixed(2)}<br>
            ---------------<br>
            Eyeball X: ${this.eyePosition.x}<br>
            Eyeball Y: ${this.eyePosition.y}
          `;
    }
  }
}
