import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import type { EntryId, Profile, SocialLink } from '../content'

const ICONS = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
} as const

function SocialIcon({ link }: { link: SocialLink }) {
  const Icon = ICONS[link.icon]
  return (
    <a
      className="iclink"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
    >
      <Icon size={19} aria-hidden="true" />
    </a>
  )
}

interface CockpitProps {
  profile: Profile
  selectedId: EntryId | null
  onSelect: (id: EntryId) => void
}

/**
 * The controls panel (right on PC, bottom on phone): identity + social links
 * at the top, then grouped, clickable navigation that loads detail into the
 * windshield.
 */
export function Cockpit({ profile, selectedId, onSelect }: CockpitProps) {
  return (
    <nav className="cockpit" aria-label="Cockpit controls">
      <div className="cp-header">
        <span className="cp-name">{profile.name}</span>
        {profile.socials.map((link) => (
          <SocialIcon key={link.label} link={link} />
        ))}
      </div>
      <div className="cp-tagline">{profile.tagline}</div>

      {profile.groups.map((group) => (
        <div className="nav-group" key={group.heading}>
          <span className="ml nav-group-heading">
            {group.heading.toUpperCase()}
          </span>
          {group.entries.map((entry) => {
            const on = entry.id === selectedId
            return (
              <button
                key={entry.id}
                type="button"
                className={on ? 'navitem on' : 'navitem'}
                aria-pressed={on}
                onClick={() => onSelect(entry.id)}
              >
                {entry.navLabel}
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
