import { useState } from 'react'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconPhone,
  IconMail,
} from '@tabler/icons-react'
import type { Preview } from '../App'
import type { EntryId, NavGroup, Profile, SocialLink } from '../content'
import { EmailModal } from './EmailModal'
import { HullDecor } from './HullDecor'

const ICONS = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  phone: IconPhone,
  email: IconMail,
} as const

function SocialIcon({ link }: { link: SocialLink }) {
  const [copied, setCopied] = useState(false)
  const Icon = ICONS[link.icon]
  const hint = copied ? 'Copied!' : link.hint

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.action.kind === 'copy' ? link.action.value : '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // Clipboard blocked (e.g. insecure context) — leave the hint as-is.
    }
  }

  const inner = <Icon size={24} aria-hidden="true" />

  let trigger
  if (link.action.kind === 'copy') {
    trigger = (
      <button type="button" className="iclink" aria-label={link.label} onClick={copy}>
        {inner}
      </button>
    )
  } else {
    let href = '#'
    if (link.action.kind === 'mailto') href = `mailto:${link.action.address}`
    else if (link.action.kind === 'tel') href = `tel:${link.action.number}`
    else if (link.action.kind === 'link') href = link.action.url
    const external = link.action.kind === 'link'
    trigger = (
      <a
        className="iclink"
        href={href}
        aria-label={link.label}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return (
    <span className="social">
      {trigger}
      <span className="social-hint" role="tooltip">
        {hint}
      </span>
    </span>
  )
}

interface CockpitProps {
  profile: Profile
  selectedId: EntryId | null
  /** Whether the Skills board is the active view. */
  skillsActive: boolean
  /** Whether the Hobbies board is the active view. */
  hobbiesActive: boolean
  onSelect: (id: EntryId) => void
  /** Open the Skills board in the windshield. */
  onSkills: () => void
  /** Open the Hobbies board in the windshield. */
  onHobbies: () => void
  /** Clear the selection and return the windshield to the welcome screen. */
  onHome: () => void
  /** Show a transient label preview in the windshield (button hover/focus). */
  onPreview: (p: Preview) => void
  /** Clear the hover preview (button leave/blur). */
  onPreviewEnd: () => void
  /** MOBILE ONLY: dismiss the cockpit and return to the windshield. */
  onCloseCockpit?: () => void
}

const PAGE_SIZE = 3

interface NavSectionProps {
  group: NavGroup
  selectedId: EntryId | null
  onSelect: (id: EntryId) => void
  onPreview: (p: Preview) => void
  onPreviewEnd: () => void
}

/**
 * One cockpit section. Shows a single page of PAGE_SIZE entries at a time;
 * the red triangles either side of the heading page through the rest, so a
 * section can hold any number of entries (more projects, jobs, certificates).
 */
function NavSection({
  group,
  selectedId,
  onSelect,
  onPreview,
  onPreviewEnd,
}: NavSectionProps) {
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState<'next' | 'prev'>('next')

  const pageCount = Math.max(1, Math.ceil(group.entries.length / PAGE_SIZE))
  // `page` is unbounded; wrap it so both triangles always cycle through.
  const current = ((page % pageCount) + pageCount) % pageCount
  const start = current * PAGE_SIZE
  const visible = group.entries.slice(start, start + PAGE_SIZE)

  const go = (delta: 1 | -1) => {
    setDir(delta === 1 ? 'next' : 'prev')
    setPage((p) => p + delta)
  }

  const goTo = (i: number) => {
    setDir(i > current ? 'next' : 'prev')
    setPage(i)
  }

  return (
    <div className="nav-group">
      <div className="nav-head">
        <button
          type="button"
          className="nav-pager"
          aria-label={`Previous ${group.heading}`}
          onClick={() => go(-1)}
        >
          <span className="tri tri-left" aria-hidden="true" />
        </button>
        <span className="ml nav-group-heading">{group.heading.toUpperCase()}</span>
        <button
          type="button"
          className="nav-pager"
          aria-label={`More ${group.heading}`}
          onClick={() => go(1)}
        >
          <span className="tri tri-right" aria-hidden="true" />
        </button>
      </div>
      {/* key={current} remounts the row so the warp-in animation replays. */}
      <div className={`nav-items dir-${dir}`} key={current}>
        {visible.map((entry) => {
          const on = entry.id === selectedId
          return (
            <button
              key={entry.id}
              type="button"
              className={on ? 'navitem on' : 'navitem'}
              aria-pressed={on}
              onClick={() => onSelect(entry.id)}
              onMouseEnter={() =>
                on || onPreview({ title: entry.navLabel, blurb: entry.navBlurb })
              }
              onMouseLeave={onPreviewEnd}
              onFocus={() =>
                on || onPreview({ title: entry.navLabel, blurb: entry.navBlurb })
              }
              onBlur={onPreviewEnd}
            >
              <span className="navitem-title">{entry.navLabel}</span>
              <span className="navitem-blurb">{entry.navBlurb}</span>
            </button>
          )
        })}
      </div>
      {pageCount > 1 && (
        <div className="nav-dots" aria-label={`${group.heading} pages`}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? 'nav-dot on' : 'nav-dot'}
              aria-label={`${group.heading} page ${i + 1} of ${pageCount}`}
              aria-current={i === current}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * The controls panel (right on PC, bottom on phone): identity + social links
 * at the top, then grouped, clickable navigation that loads detail into the
 * windshield.
 */
export function Cockpit({
  profile,
  selectedId,
  skillsActive,
  hobbiesActive,
  onSelect,
  onSkills,
  onHobbies,
  onHome,
  onPreview,
  onPreviewEnd,
  onCloseCockpit,
}: CockpitProps) {
  const [emailOpen, setEmailOpen] = useState(false)
  const homeActive = selectedId === null && !skillsActive && !hobbiesActive

  return (
    <nav className="cockpit" aria-label="Cockpit controls">
      <HullDecor />
      {/* Boot-up: the touch-display screen powering on. */}
      <div className="cp-screen" aria-hidden="true" />

      {/* MOBILE ONLY: a white glowing triangle pointing UP — back to the
          windshield display. Mirrors the red down-triangle in the windshield
          that opens the cockpit. (Hidden on desktop, where both panels show.) */}
      <button
        type="button"
        className="cp-back"
        onClick={onCloseCockpit}
        aria-label="Back to the display"
      >
        <span className="cp-back-tri" aria-hidden="true" />
      </button>
      <div className="cp-header">
        <div className="cp-name-row">
          <button
            type="button"
            className="cp-flank cp-flank-left"
            aria-label="Send me a message"
            onClick={() => setEmailOpen(true)}
          >
            <svg className="flank-tri" viewBox="0 0 96 114" aria-hidden="true">
              {/* triangle + label box as one clean outline */}
              <polygon
                points="88,4 88,108 8,108 8,84"
                fill="var(--red)"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* divider between triangle and label box */}
              <line x1="8" y1="84" x2="88" y2="84" stroke="#fff" strokeWidth="2.5" />
              <text
                x="48"
                y="96"
                className="flank-word"
                textAnchor="middle"
                dominantBaseline="central"
              >
                MESSAGE
              </text>
            </svg>
          </button>

          <button
            type="button"
            className={homeActive ? 'cp-name on' : 'cp-name'}
            aria-pressed={homeActive}
            onClick={onHome}
            onMouseEnter={() => homeActive || onPreview({ title: 'About Me' })}
            onMouseLeave={onPreviewEnd}
            onFocus={() => homeActive || onPreview({ title: 'About Me' })}
            onBlur={onPreviewEnd}
            aria-label={`${profile.name} — back to welcome screen`}
          >
            {profile.name}
          </button>

          <a
            className="cp-flank cp-flank-right"
            href={profile.cvUrl}
            download="Satwik_Bhatnagar_CV.pdf"
            aria-label="Download my CV (PDF)"
          >
            <svg className="flank-tri" viewBox="0 0 96 114" aria-hidden="true">
              {/* label box + triangle as one clean outline */}
              <polygon
                points="8,6 88,6 88,30 8,110"
                fill="var(--red)"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* divider between label box and triangle */}
              <line x1="8" y1="30" x2="88" y2="30" stroke="#fff" strokeWidth="2.5" />
              <text
                x="48"
                y="18"
                className="flank-word"
                textAnchor="middle"
                dominantBaseline="central"
              >
                CV
              </text>
            </svg>
          </a>
        </div>

        <div className="cp-socials">
          {profile.socials.map((link) => (
            <SocialIcon key={link.label} link={link} />
          ))}
        </div>
      </div>

      <EmailModal open={emailOpen} onClose={() => setEmailOpen(false)} />

      {/* Skills (left) and Hobbies (right) flank the tagline, sitting over the
          circuit pockets either side. */}
      <div className="cp-controls">
        <button
          type="button"
          className={skillsActive ? 'cp-tab on' : 'cp-tab'}
          aria-pressed={skillsActive}
          onClick={onSkills}
          onMouseEnter={() =>
            skillsActive || onPreview({ title: 'Skills', blurb: 'Flight systems' })
          }
          onMouseLeave={onPreviewEnd}
          onFocus={() =>
            skillsActive || onPreview({ title: 'Skills', blurb: 'Flight systems' })
          }
          onBlur={onPreviewEnd}
        >
          Skills
        </button>
        <div className="cp-tagline">{profile.tagline}</div>
        <button
          type="button"
          className={hobbiesActive ? 'cp-tab on' : 'cp-tab'}
          aria-pressed={hobbiesActive}
          onClick={onHobbies}
          onMouseEnter={() =>
            hobbiesActive || onPreview({ title: 'Hobbies', blurb: 'Off duty' })
          }
          onMouseLeave={onPreviewEnd}
          onFocus={() =>
            hobbiesActive || onPreview({ title: 'Hobbies', blurb: 'Off duty' })
          }
          onBlur={onPreviewEnd}
        >
          Hobbies
        </button>
      </div>

      <div className="nav-deck">
        {profile.groups.map((group) => (
          <NavSection
            key={group.heading}
            group={group}
            selectedId={selectedId}
            onSelect={onSelect}
            onPreview={onPreview}
            onPreviewEnd={onPreviewEnd}
          />
        ))}
      </div>
    </nav>
  )
}
