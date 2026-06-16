/**
 * Folder-driven content loader.
 *
 * Every page on the site is a folder under `pages/` (at the project root —
 * not to be confused with this `src/content/` code folder):
 *
 *   pages/
 *     Education/
 *       School/        School.md      + photos/videos
 *     Experience/
 *       Lingua Franca/ index.md       + photos/videos
 *     Projects/
 *       MediSync/      MediSync.md    01-demo.mp4  02-landing.png
 *
 * Each folder holds ONE markdown file (front-matter + body) plus any number of
 * image/video attachments dropped straight in. This module globs them at build
 * time and assembles the same `NavGroup[]` the cockpit and the future 3D ride
 * already consume — so authoring a new page never touches TypeScript.
 *
 * See pages/README.md for the front-matter fields.
 */

import { marked } from 'marked'
import { parseFrontmatter, type Frontmatter } from './frontmatter'
import type {
  Entry,
  EntryKind,
  ExternalLink,
  NavGroup,
  ProjectMedia,
  UniversePlacement,
} from './types'

marked.use({ gfm: true, breaks: true })

/** Section folders, in cockpit order, mapped to their entry kind. */
const SECTIONS: { dir: string; heading: string; kind: EntryKind }[] = [
  { dir: 'Education', heading: 'Education', kind: 'education' },
  { dir: 'Experience', heading: 'Experience', kind: 'experience' },
  { dir: 'Projects', heading: 'Projects', kind: 'project' },
]

const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'm4v', 'ogv'])

// Eagerly pull every page's markdown (as raw text) and every attachment (as a
// bundled asset URL). Globs must be string literals for Vite to statically
// analyse them.
const MD = import.meta.glob('/pages/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const MEDIA = import.meta.glob(
  '/pages/**/*.{png,jpg,jpeg,webp,avif,gif,svg,mp4,webm,mov,m4v,ogv}',
  { import: 'default', eager: true },
) as Record<string, string>

/** kebab-case slug used for the entry id, deep links, and 3D node names. */
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Split `/pages/Section/Item/file.ext` into its parts (forward slashes). */
function parts(path: string): { section: string; item: string; file: string } | null {
  const seg = path.split('/').filter(Boolean) // ['pages','Section','Item','file']
  if (seg.length !== 4 || seg[0] !== 'pages') return null
  return { section: seg[1], item: seg[2], file: seg[3] }
}

/** Pretty caption from a media filename: `02-admin-demo.png` -> `admin demo`. */
function captionFromFile(file: string): string {
  return file
    .replace(/\.[^.]+$/, '') // drop extension
    .replace(/^\d+[-_\s]*/, '') // drop ordering prefix
    .replace(/[-_]+/g, ' ')
    .trim()
}

/** Collect + order the attachments living in one item folder. */
function mediaFor(section: string, item: string): ProjectMedia[] {
  const prefix = `/pages/${section}/${item}/`
  return Object.keys(MEDIA)
    .filter((p) => p.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((p) => {
      const file = p.slice(prefix.length)
      const ext = file.split('.').pop()?.toLowerCase() ?? ''
      return {
        type: VIDEO_EXT.has(ext) ? 'video' : 'image',
        src: MEDIA[p],
        caption: captionFromFile(file),
      } satisfies ProjectMedia
    })
}

function str(data: Frontmatter, key: string): string | undefined {
  const v = data[key]
  return typeof v === 'string' ? v : v == null ? undefined : String(v)
}

/** Parse one `label | https://…` entry (or a bare URL). */
function parseOneLink(raw: string): ExternalLink | undefined {
  const t = raw.trim()
  if (!t) return undefined
  const [a, b] = t.split('|').map((s) => s.trim())
  return b ? { label: a, url: b } : { label: 'open', url: a }
}

/**
 * Collect the page's external links. Accepts a single `link:` line and/or a
 * `links:` line with several entries separated by `;`:
 *
 *   link: open MediSync | https://…
 *   links: GitHub | https://… ; Live demo | https://…
 */
function parseLinks(data: Frontmatter): ExternalLink[] {
  const out: ExternalLink[] = []
  const single = str(data, 'link')
  if (single) {
    const l = parseOneLink(single)
    if (l) out.push(l)
  }
  const many = str(data, 'links')
  if (many) {
    for (const part of many.split(';')) {
      const l = parseOneLink(part)
      if (l) out.push(l)
    }
  }
  return out
}

function parseUniverse(data: Frontmatter): UniversePlacement | undefined {
  const galaxy = str(data, 'galaxy')
  if (!galaxy) return undefined
  const system = str(data, 'system')
  return system ? { galaxy, system } : { galaxy }
}

function techList(data: Frontmatter): string[] {
  const v = data['tech']
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v) return v.split(',').map((s) => s.trim())
  return []
}

/** Build one Entry from a page folder, or null if it lacks a markdown file. */
function buildEntry(section: string, item: string, kind: EntryKind): Entry | null {
  const mdPath = Object.keys(MD).find((p) => {
    const pp = parts(p)
    return pp?.section === section && pp.item === item && !/readme/i.test(pp.file)
  })
  if (!mdPath) return null

  const { data, body } = parseFrontmatter(MD[mdPath])
  const navLabel = str(data, 'navLabel') ?? item
  const navBlurb = str(data, 'navBlurb') ?? ''
  const hudLabel = str(data, 'hudLabel') ?? navLabel.toUpperCase()
  const title = str(data, 'title') ?? item
  const html = body ? (marked.parse(body) as string) : ''
  const media = mediaFor(section, item)
  const links = parseLinks(data)
  const universe = parseUniverse(data)
  const id = str(data, 'id') ?? slug(item)

  const orderRaw = data['order']
  const base = {
    id,
    ...(typeof orderRaw === 'number' ? { order: orderRaw } : {}),
    navLabel,
    navBlurb,
    hudLabel,
    title,
    ...(media.length ? { media } : {}),
    ...(links.length ? { links } : {}),
    ...(universe ? { universe } : {}),
  }

  if (kind === 'project') {
    return {
      ...base,
      kind: 'project',
      summary: str(data, 'summary') ?? '',
      features: html,
      tech: techList(data),
      media,
    }
  }

  return {
    ...base,
    kind,
    meta: str(data, 'meta') ?? '',
    body: html,
  }
}

/** Discover the item folders inside a section, preserving discovery. */
function itemsIn(section: string): string[] {
  const seen = new Set<string>()
  for (const p of [...Object.keys(MD), ...Object.keys(MEDIA)]) {
    const pp = parts(p)
    if (pp?.section === section) seen.add(pp.item)
  }
  return [...seen]
}

/** Numeric `order` front-matter, falling back to a large number (sorts last). */
function orderOf(entry: Entry): number {
  return typeof entry.order === 'number' ? entry.order : Number.MAX_SAFE_INTEGER
}

/** Assemble the cockpit nav groups straight from the content folders. */
export function loadGroups(): NavGroup[] {
  return SECTIONS.map(({ dir, heading, kind }) => {
    const entries = itemsIn(dir)
      .map((item) => buildEntry(dir, item, kind))
      .filter((e): e is Entry => e !== null)
      .sort((a, b) => orderOf(a) - orderOf(b) || a.navLabel.localeCompare(b.navLabel))
    return { heading, entries }
  }).filter((g) => g.entries.length > 0)
}
