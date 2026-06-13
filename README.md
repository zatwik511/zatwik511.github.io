# zatwik.com

A personal portfolio for **Satwik Bhatnagar**, built as a spaceship. See
[`DESIGN.md`](./DESIGN.md) for the full brief.

Two modes share **one content source** ([`src/content/`](./src/content/)):

- **`y` — static cockpit** (Phase 1, built): a fast, accessible split
  windshield/cockpit layout. Pure DOM/CSS, no WebGL.
- **`x` — 3D ride** (Phase 3, later): a React Three Fiber flight through a
  universe whose scene graph mirrors the content tree.

## Stack

Vite + React + TypeScript.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Project shape

```
src/
  content/         # single typed source of truth (feeds both modes)
    types.ts       # the data contract — no React/Three imports
    profile.ts     # the real content
    index.ts       # profile + helpers (allEntries, getEntry)
  components/       # static cockpit UI
    Windshield.tsx  Cockpit.tsx
    Starfield.tsx   SkillsTicker.tsx  NowPlaying.tsx
    LaunchButton.tsx  EntryContent.tsx
  styles/global.css
  App.tsx  main.tsx
```

Adding a project = adding one entry to the `Projects` group in
[`src/content/profile.ts`](./src/content/profile.ts); it shows up in the
cockpit automatically (and, later, as a planet in the ride).
