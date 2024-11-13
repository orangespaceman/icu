# I C U

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

Two experiments with `getUserMedia`, Face detection and `speechSynthesis`.

The 'eye' experiment was the first to be developed. It tracks faces from a webcam, and manipulates an SVG accordingly.

The 'bear' experiment also tracks a face and manipulates an SVG. It also generates speech depending on how close or far away the face is located.


## Dependencies

There are no dependencies to install, everything needed to run the experiment is stored locally.

The following external libraries have been used:

- [Face API](https://justadudewhohacks.github.io/face-api.js/docs/) - for face detection
- [Tween.js](https://tweenjs.github.io/tween.js/) - for animating SVGs

The mute, sound and pointer icons are from [https://www.svgrepo.com/](https://www.svgrepo.com/)

The bear picture was generated by Chatty Jeeps.

The eye SVGs were manually created by hand.


## Demos

The two web pages (eye and bear) need to be run through a web server in order to access the webcam.

To fire up a simple webserver on macOS, run the following command from the relevant directory:

```sh
python3 -m http.server
```

Demos are available here:

- [https://orangespaceman.github.io/icu/bear](https://orangespaceman.github.io/icu/bear)
- [https://orangespaceman.github.io/icu/eye](https://orangespaceman.github.io/icu/eye)

---

![](./bear/img/screenshot.png)

---

 DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.