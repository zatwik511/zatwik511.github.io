import { useState } from 'react'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconPhone,
  IconMail,
} from '@tabler/icons-react'
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
    const href =
      link.action.kind === 'mailto'
        ? `mailto:${link.action.address}`
        : link.action.url
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
  onSelect: (id: EntryId) => void
  /** Clear the selection and return the windshield to the welcome screen. */
  onHome: () => void
}

const PAGE_SIZE = 3

interface NavSectionProps {
  group: NavGroup
  selectedId: EntryId | null
  onSelect: (id: EntryId) => void
}

/**
 * One cockpit section. Shows a single page of PAGE_SIZE entries at a time;
 * the red triangles either side of the heading page through the rest, so a
 * section can hold any number of entries (more projects, jobs, certificates).
 */
function NavSection({ group, selectedId, onSelect }: NavSectionProps) {
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
export function Cockpit({ profile, selectedId, onSelect, onHome }: CockpitProps) {
  const [emailOpen, setEmailOpen] = useState(false)

  return (
    <nav className="cockpit" aria-label="Cockpit controls">
      <HullDecor />
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
            className={selectedId === null ? 'cp-name on' : 'cp-name'}
            aria-pressed={selectedId === null}
            onClick={onHome}
            aria-label={`${profile.name} — back to welcome screen`}
          >
            {profile.name}
          </button>

          <a
            className="cp-flank cp-flank-right"
            href={profile.cvUrl}
            download
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
      <div className="cp-tagline">{profile.tagline}</div>

      <div className="nav-deck">
        {profile.groups.map((group) => (
          <NavSection
            key={group.heading}
            group={group}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  )
}
