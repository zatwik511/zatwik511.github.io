/**
 * Shared content model for zatwik.com.
 *
 * This is the single source of truth consumed by BOTH modes:
 *  - the static cockpit (Phase 1) renders these entries as DOM, and
 *  - the future 3D ride (Phase 3) will walk the same entries to place planets.
 *
 * Keep this file free of any React / Three.js imports so it stays a pure
 * data contract that either renderer can read.
 */

export type EntryKind = 'education' | 'experience' | 'project'

/** A stable identifier; also used in the URL/3D scene-graph node name. */
export type EntryId = string

/** What happens when a social link is activated. */
export type SocialAction =
  /** Open a URL in a new tab (GitHub, LinkedIn). */
  | { kind: 'link'; url: string }
  /** Start an email to this address (mailto:). */
  | { kind: 'mailto'; address: string }
  /** Copy this value to the clipboard (phone number). */
  | { kind: 'copy'; value: string }

export interface SocialLink {
  /** Accessible label, e.g. "GitHub". */
  label: string
  /** Which icon to render. Extend as more links move into a mode. */
  icon: 'github' | 'linkedin' | 'phone' | 'email'
  /** Shown in the tooltip on hover (username, number, or address). */
  hint: string
  action: SocialAction
}

/**
 * Optional placement hint for the 3D universe (Phase 3). The static mode
 * ignores it; the renderer will group entries into galaxies/systems by it.
 * Declared here so the data file can be authored once, ride-ready.
 */
export interface UniversePlacement {
  /** Top-level category, becomes a galaxy. */
  galaxy: string
  /** Project group within a galaxy, becomes a star system. */
  system?: string
}

export interface ProjectMedia {
  type: 'video' | 'image'
  /** Asset URL. Optional while assets are still placeholders. */
  src?: string
  /** Caption / placeholder text shown until an asset is wired up. */
  caption: string
}

export interface ExternalLink {
  label: string
  url: string
}

interface EntryBase {
  id: EntryId
  kind: EntryKind
  /** Sort position within its section (from front-matter `order:`). */
  order?: number
  /** Short label for the cockpit nav button. */
  navLabel: string
  /** One-line description shown under the title on the nav button. */
  navBlurb: string
  /** Monospace HUD micro-label shown atop the windshield panel. */
  hudLabel: string
  /** Page attachments (photos / videos), authored by dropping files in the folder. */
  media?: ProjectMedia[]
  /** External links rendered as "label ↗" buttons on the page. */
  links?: ExternalLink[]
  universe?: UniversePlacement
}

export interface EducationEntry extends EntryBase {
  kind: 'education'
  /** Headline line, e.g. the degree. */
  title: string
  /** Secondary line, e.g. "University · years". */
  meta: string
  body: string
}

export interface ExperienceEntry extends EntryBase {
  kind: 'experience'
  title: string
  /** Secondary line, e.g. "Company · dates". */
  meta: string
  body: string
}

export interface ProjectEntry extends EntryBase {
  kind: 'project'
  title: string
  summary: string
  /** Feature description, rendered from the page's markdown body (HTML). */
  features: string
  /** Tech stack tags. */
  tech: string[]
  /** Demo video + landing screenshot, per the brief. */
  media: ProjectMedia[]
}

export type Entry = EducationEntry | ExperienceEntry | ProjectEntry

/** A titled cluster of nav buttons in the cockpit. */
export interface NavGroup {
  heading: string
  entries: Entry[]
}

/** A category of skills (e.g. "Languages", "AI Tools") for the skills board. */
export interface SkillGroup {
  heading: string
  items: string[]
}

export interface NowPlaying {
  track: string
  artist: string
  /** Album art image URL. Optional; a placeholder shows until it's set. */
  albumArt?: string
  /** Whether the track is currently playing (vs. most-recently played). */
  isPlaying?: boolean
  /** Spotify links — make the title / artist / art clickable when present. */
  trackUrl?: string
  artistUrl?: string
  albumUrl?: string
}

/** Everything the site needs to render. */
export interface Profile {
  name: string
  tagline: string
  /** Path to the downloadable CV PDF (lives in public/). */
  cvUrl: string
  /** Direct contact address for the email popup. */
  contactEmail: string
  socials: SocialLink[]
  /** Categorised skills shown on the cockpit's Skills board. */
  skillGroups: SkillGroup[]
  /** Fallback now-playing track until the Spotify function lands (Phase 4). */
  nowPlaying: NowPlaying
  groups: NavGroup[]
}
