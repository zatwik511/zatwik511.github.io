---
order: 5
navLabel: zatwik.com
navBlurb: This spaceship portfolio
title: zatwik.com
summary: A spaceship-themed portfolio.
tech: [React, TypeScript, Vite, CSS, Vercel, Spotify API, Gmail API, marked]
link: Source on GitHub | https://github.com/zatwik511/zatwik511.github.io
galaxy: Creative
system: Web
---

The site you are looking at right now: a spaceship cockpit where the windshield is the display and the panel on the right is the controls. Every page is authored as a folder of markdown plus dropped-in media, and the whole HUD is hand-built in CSS with no animation library.

- **Folder-driven content:** each page is a folder under pages/ holding one markdown file plus any photos, videos, or installers dropped in; the site assembles them at build time, so adding a page never touches TypeScript.
- **The cockpit HUD:** a real night-sky windshield with a cursor star-flare, an orbiting triangle border that pulses and sweeps on every click, hover previews, and crossfading page transitions, all driven by CSS motion paths and blend modes.
- **Live data:** a Spotify now-playing widget and a working contact form, both powered by Vercel serverless functions so no secrets ever touch the client.
- **Built for a sequel:** the same typed content model is meant to feed a planned 3D ride mode, so everything is authored once and ride-ready.
