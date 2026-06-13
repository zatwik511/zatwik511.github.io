# zatwik.com — Design Brief & Build Spec

A personal portfolio for **Satwik Bhatnagar**, built as a spaceship. This document
is the single source of truth for the rebuild. A visual reference of the static
layout lives next to it in `reference-mockup.html` (open it in a browser).

---

## 1. Concept

The whole site is a spaceship. There are **two modes**, reached from one landing screen:

- **`y` (static, 2D)** — the *cockpit*. A fast, accessible, single-page portfolio with
  a spaceship theme. This is what a recruiter sees in 40 seconds. Strictly 2D — no WebGL.
- **`x` (3D)** — the *ride*. A third-person flight through a universe of planets/stars.
  The ambitious, memorable mode. Built later.

Both are powered by **one shared content data source** (education, experience, projects),
so adding a project updates both modes. Think "Peter Parker / Spider-Man": `y` is the
practical everyday view, `x` is the spectacular one.

A **QR code** (sticker on the back of a phone) is the primary distribution channel. It
should link **directly into the static cockpit** (e.g. `zatwik.com/?view=cockpit`),
bypassing the landing screen, so a scan is zero-click content.

---

## 2. Landing screen

Black background, two red triangles (matches the hand-drawn concept):

- **Top triangle, pointing up = `x`** → the 3D ride. Label idea: "LAUNCH / the 3D ride".
- **Bottom triangle, pointing down = `y`** → the static cockpit. Label idea: "BOARD / view my work".

Each triangle needs a **thematic word + a tiny plain-language hint** so a recruiter is
never confused about which one shows the work. The QR link skips this screen.

---

## 3. Static cockpit (`y`) — PHASE 1, build this first

### Layout: split the viewport along its aspect ratio
- **PC (16:9):** windshield on the **left** (~60%), cockpit on the **right** (~40%),
  divided by a clean vertical seam line.
- **Phone (9:16):** same two panels, rotated — windshield on **top**, cockpit on **bottom**,
  divided by a horizontal seam.
- Both panels are large; both scroll independently.

### Windshield (the display) — left on PC / top on phone
Black background with white stars (a painted starfield — flat 2D, nothing rendered).
The black + stars are meant to *pop* against the red hull. Contains:
- **Skills ticker** pinned along the top — a news-style horizontal crawl of skill names
  (TypeScript, Python, C++, React, Node, PostgreSQL, Three.js, …). Pause on `prefers-reduced-motion`.
- **Scrollable content area** in the middle — this is where clicked items load. Entries can
  be long (a project detail), so it scrolls.
- **Now-playing (Spotify)** pinned along the bottom — shows the currently/recently playing track.
- **LAUNCH 3D button** in a corner (top-right) — small, with a subtle pulse, enticing the user
  into mode `x`. (Mode `x` is also reachable from the landing screen.)

### Cockpit (the controls) — right on PC / bottom on phone
Red hull (the dominant colour). Contains:
- **Name + intro + GitHub & LinkedIn icon links**, together at the top.
  (YouTube and other links are saved for the 3D mode, not shown here.)
- **Grouped, clickable navigation.** Clicking any item loads its detail into the windshield:
  - **Education** → School, Bachelor's, Master's (each clickable).
  - **Experience** → one clickable item per job.
  - **Projects** → one clickable item per project.

### Content behaviour in the windshield
- **Education / Experience items:** simple text.
- **Project items:** a demo video + a screenshot of the landing page + a link to open the
  live project. (e.g. MediSync shows its admin demo video, a landing-page screenshot, and
  an "open" link.)

### Style notes (to be finalised in Claude Code)
- **Red is the main colour**, not an accent — the whole hull/dashboard is red. Pure `#ff0000`
  is an option but vibrates over large areas; a slightly deepened red (~`#cf2424`) reads more
  premium. Final red is Satwik's call.
- Windshield is near-black (`#07070a` used in the mock) with white stars; seam line in a
  lighter red.
- HUD micro-labels in monospace; body text in a clean sans.
- Open forks to decide: how far to push windshield art (subtle stars vs a painted planet/nebula),
  and the exact red.

### Non-negotiables for the static mode
- **Real DOM text** for all content (crawlable for SEO, readable by screen readers).
- **Keyboard navigable**; all motion (ticker, equaliser, pulse) respects `prefers-reduced-motion`.
- **Recruiter fast-path:** core info (project names + direct links, skills) should be reachable
  without depending on clicking the right control. The windshield interaction *enhances*; it
  must not be the only door to the work.
- Same content on PC and phone — nothing disappears on mobile, it just re-stacks.

---

## 4. The 3D ride (`x`) — LATER PHASE

### Camera & ship
- **Third-person chase camera** (like seeing the back of a car in GTA). No cockpit/windshield
  rendered in 3D — you see the back of the ship. The ship is **red**.
- Movement: WASD-to-fly and/or click-a-target-to-autopilot. Camera springs/lerps behind the ship.

### The universe = a nested scene graph
The content hierarchy and the 3D scene graph are the same tree:
- **Universe** (root scene)
  - **Galaxies** = top-level categories (e.g. Engineering, Research, Creative)
    - **Star systems** = project groups
      - **Planets** = individual projects
- **Black holes = wormholes** for fast-travel between galaxies.

This maps 1:1 onto Three.js's parent/child `Object3D` graph. **Drive it from data:** define
the universe as a nested TypeScript tree (same source that feeds the static mode); the renderer
walks the tree to place objects. Adding a project = adding one node.

- Prefer **hand-authored** placement (each project lives somewhere meaningful) with
  **procedural decoration** (background stars, drifting debris).
- Need **LOD / fade** so distant things don't tank performance; instancing for star fields;
  one **bloom** post-process pass is what makes space look cinematic.

---

## 5. Recommended stack

- **Build:** Vite + TypeScript.
- **3D:** React Three Fiber (R3F) + `@react-three/drei` (camera rigs, `<Html>` overlays,
  instancing, loaders) + `@react-three/postprocessing` (bloom). R3F keeps the recursive
  galaxy→system→planet tree maintainable vs. raw imperative Three.js.
- **Static cockpit:** same React + TS app; the cockpit is plain DOM/CSS (no WebGL) for speed,
  SEO, and accessibility.
- **Shared:** a single `content/` data module (TS) describing education, experience, projects,
  and the universe layout — consumed by both modes.

---

## 6. Spotify "now playing"

The embed iframe only shows a *fixed* track. For true live now-playing, use Spotify's Web API
"currently playing" endpoint, which needs an OAuth token that expires hourly — so it requires a
**tiny serverless function** (Vercel/Netlify function or a small Render endpoint) holding a refresh
token. A common, nearly-as-good fallback is showing the **most recently played** track (same API).

---

## 7. Distribution / deploy

- Custom domain **zatwik.com** (cleaner QR than the github.io path).
- The static cockpit + the desktop 3D ride both run in a normal browser (incl. mobile browsers).
- Mobile 3D as an installable **PWA** is the recommended "download the app" path (web tech, no
  app-store gatekeeping). An **Android APK** can be a bonus download, but it's Android-only and
  has "unknown sources" friction; iOS can't sideload APKs. Keep the browser ride as the universal
  fallback so no one is *forced* to install anything to see the work.
- Vite builds to `dist/`; deploy to GitHub Pages via a GitHub Actions workflow, then attach the
  custom domain.

---

## 8. Build order

1. **Phase 1 — Static cockpit (`y`):** the split windshield/cockpit layout, content data module,
   real content, final colours. Ship this first; it's the recruiter-facing site.
2. **Phase 2 — Landing screen:** the two triangles + QR-direct routing.
3. **Phase 3 — 3D ride (`x`):** starfield + a few planets + free camera → spaceship + chase cam →
   nested galaxy/system/planet hierarchy + LOD → wormholes + bloom + polish.
4. **Phase 4 — Spotify serverless, PWA install, deploy + custom domain.**
