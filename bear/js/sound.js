export default class Sound {
  constructor() {
    this.soundOn = false;
    this.isSpeaking = false;
    this.lastSpoke = Date.now();
    this.btn = document.querySelector("#sound-toggle");
  }

  async init() {
    this.btn.addEventListener("click", this.toggleSound.bind(this));

    speechSynthesis.addEventListener(
      "voiceschanged",
      this.selectVoice.bind(this)
    );
    this.selectVoice();
  }

  toggleSound() {
    this.soundOn = !this.soundOn;
    this.btn.classList.toggle("on");

    if (this.soundOn) {
      const turnOn = "You turned me on";
      this.say(turnOn);
    }
  }

  selectVoice() {
    const voices = window.speechSynthesis.getVoices();
    this.voice = voices.find(
      (voice) => voice.name.includes("Sandy") && voice.lang.includes("GB")
    );
    if (!this.voice) {
      this.voice = voices.find((voice) => voice.default);
    }
  }

  say(words) {
    if (this.voice && !this.isSpeaking) {
      this.isSpeaking = true;

      const msg = new SpeechSynthesisUtterance();
      msg.voice = this.voice;
      msg.volume = 1;
      msg.rate = 1;
      msg.pitch = 1;
      msg.text = words;
      window.speechSynthesis.speak(msg);

      msg.addEventListener("end", () => {
        this.isSpeaking = false;
        this.lastSpoke = Date.now();
      });
    }
  }

  checkBoxSize(boxDimensions) {
    if (!this.soundOn) return;

    // don't speak too often
    if (Date.now() - this.lastSpoke < 5000) return;

    // decide what to say
    if (boxDimensions.w < 150 && boxDimensions.h < 150) {
      this.say("Come closer and let me see you properly");
    } else if (boxDimensions.w > 250 && boxDimensions.h > 250) {
      this.say("No, that's too close. Although you do smell nice");
    }
  }
}
