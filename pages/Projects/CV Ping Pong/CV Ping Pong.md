---
order: 4
navLabel: CV Ping Pong
navBlurb: Hand-tracked 3D pong
title: CV Ping Pong
summary: Hand-tracked 3D pong, played with your bare hand.
tech: [MediaPipe, Three.js, Vite, TypeScript]
link: Play it | https://example.com/cv-ping-pong
links: Source on GitHub | https://github.com/zatwik511/cv-ping-pong ; Demo video | https://youtu.be/example
galaxy: Creative
system: Games
---

A browser game with **no controller**: your webcam *is* the controller. A
computer-vision model finds your hand in real time and maps it to the paddle in
a 3D scene, so you play pong by waving at the screen.

**How it works**

- **MediaPipe** tracks 21 hand landmarks straight from the webcam feed.
- The wrist position is smoothed and projected onto the paddle in a **Three.js**
  scene, so the paddle follows your hand with almost no lag.
- Ball physics, scoring, and increasing speed run in a small TypeScript game
  loop, bundled with **Vite**.

The whole thing runs **entirely client-side**, so nothing leaves your machine, and
it starts the moment the page loads.
