# Pages

Every page on the site is a **folder** in here. Drop a folder in, and a button
for it appears in the cockpit automatically — no code to touch. (This folder is
read by `src/content/loader.ts`; the `src/content/` code is separate.)

```
pages/
  Education/
    School/            School.md      grad.jpg
  Experience/
    Lingua Franca/     index.md       team.jpg  shift.mp4
  Projects/
    MediSync/          MediSync.md    01-demo.mp4  02-landing.png
```

## The three sections

`Education`, `Experience`, `Projects` — these folder names are fixed and decide
which list a page shows up in. Put one folder per item inside them.

## Each page folder

1. **One markdown file** — name it anything (e.g. `School.md` or `index.md`).
   It has a front-matter header (between the `---` lines) and a body.
2. **Any photos / videos** — just drop the files in the same folder. They show
   up on the page in filename order. Prefix with numbers to control the order:
   `01-demo.mp4`, `02-landing.png`. The caption is taken from the filename
   (the number prefix is stripped), so `02-admin-panel.png` reads "admin panel".

   Supported: `png jpg jpeg webp avif gif svg` and `mp4 webm mov m4v ogv`.

## Front-matter fields

```markdown
---
order: 1                 # position in its section (lower = first)
navLabel: MediSync       # the cockpit button title
navBlurb: Hospital system  # one line under the button title
title: MediSync          # big headline on the page
hudLabel: MEDISYNC       # optional; defaults to navLabel in CAPS
meta: Company · 2024     # optional secondary line (Education / Experience)
summary: Full-stack...   # optional micro-line (Projects)
tech: [TypeScript, Node.js, PostgreSQL]   # optional tags (Projects)
link: Live demo | https://example.com     # optional button (single link)
galaxy: Engineering      # optional, for the future 3D ride
system: Web apps         # optional, groups within a galaxy
---

Write the page content here in **markdown**. Lists, **bold**, _italics_, and
[links](https://example.com) all work. This becomes the body of the page.
```

Only `navLabel`, `navBlurb`, and `title` really matter — everything else is
optional. If a value contains a colon, wrap it in quotes: `title: "A: B"`.

## Adding links

Two ways, use whichever fits:

1. **Inline, inside a sentence** — plain markdown in the body:
   `I studied at [Kingston University](https://www.kingston.ac.uk).`

2. **As buttons** under the page — in the front-matter. Format is
   `Label | URL`. For one button use `link:`; for several use `links:` with
   each separated by a semicolon `;`:

   ```markdown
   link: GitHub repo | https://github.com/you/medisync
   links: Company website | https://acme.com ; College | https://uni.edu
   ```

   (You can use both lines together — they all stack as buttons.)
