import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  homeContent,
  homePhotos,
  site,
  skillUrl,
  type Entry,
  type ProjectMedia,
} from '../content'

/** Welcome screen shown in the windshield before anything is selected. The
 *  heading and paragraph are authored in the markdown file in pages/Home/
 *  (falling back to site.home). The photo(s) come from pages/Home/ too: a
 *  `primary` and `secondary` image enable the Time Travel crossfade; otherwise
 *  the first image (or home.photo) is shown. */
function FlightDeck() {
  const { photo } = site.home
  const heading = homeContent?.heading || site.home.heading
  const introHtml = homeContent?.introHtml
  const [traveled, setTraveled] = useState(false)

  const primary =
    homePhotos.find((p) => p.name.includes('primary'))?.src ??
    homePhotos[0]?.src ??
    photo
  const secondary =
    homePhotos.find((p) => p.name.includes('secondary'))?.src ?? homePhotos[1]?.src

  const canTravel = Boolean(primary && secondary && primary !== secondary)

  return (
    <div className="ws-home">
      <span className="ml ws-hud">FLIGHT DECK</span>
      <div className="ws-head">{heading}</div>

      <div className="ws-home-photo">
        {primary ? (
          <>
            <img
              className="ws-home-img"
              src={primary}
              alt=""
              style={{ opacity: traveled ? 0 : 1 }}
            />
            {secondary && (
              <img
                className="ws-home-img"
                src={secondary}
                alt=""
                style={{ opacity: traveled ? 1 : 0 }}
              />
            )}
          </>
        ) : (
          <span className="ws-home-ph">
            1:1 square photo
            <small>drop one in pages/Home/</small>
          </span>
        )}

        {canTravel && (
          <button
            type="button"
            className="ws-travel"
            onClick={() => setTraveled((t) => !t)}
            aria-pressed={traveled}
          >
            Time Travel
          </button>
        )}
      </div>

      {introHtml ? (
        <div
          className="ws-home-intro"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : (
        <p className="ws-home-intro">{site.home.intro}</p>
      )}
    </div>
  )
}

/** A plain attachment (used by the small Education / Experience figure). */
function PlainMedia({ m }: { m: ProjectMedia }) {
  if (m.src && m.type === 'image') {
    return <img className="media-img" src={m.src} alt={m.caption} loading="lazy" />
  }
  if (m.src && m.type === 'video') {
    return <video className="media-vid" src={m.src} controls preload="metadata" />
  }
  return (
    <div className="ph">
      {m.type === 'video' ? '► ' : ''}
      {m.caption}
    </div>
  )
}

/** A clickable media thumbnail that opens the lightbox (project pages). */
function MediaThumb({
  m,
  onPreview,
}: {
  m: ProjectMedia
  onPreview: (m: ProjectMedia) => void
}) {
  if (!m.src) {
    return (
      <div className="ph">
        {m.type === 'video' ? '► ' : ''}
        {m.caption}
      </div>
    )
  }
  return (
    <button
      type="button"
      className="media-thumb"
      onClick={() => onPreview(m)}
      aria-label={`${m.type === 'video' ? 'Play' : 'Preview'} ${m.caption}`}
    >
      {m.type === 'video' ? (
        <>
          <video src={m.src} muted preload="metadata" tabIndex={-1} />
          <span className="media-play" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <polygon points="8,5 19,12 8,19" />
            </svg>
          </span>
        </>
      ) : (
        <>
          <img src={m.src} alt={m.caption} loading="lazy" />
          <span className="media-badge">Click to preview</span>
        </>
      )}
    </button>
  )
}

/** Fullscreen popup that shows the full image or plays the video. */
function Lightbox({ media, onClose }: { media: ProjectMedia; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lightbox-x"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>
        {media.type === 'video' ? (
          <video className="lightbox-media" src={media.src} controls autoPlay />
        ) : (
          <img className="lightbox-media" src={media.src} alt={media.caption} />
        )}
      </div>
    </div>,
    document.body,
  )
}

/** Project demo video + landing shot, as clickable thumbnails. */
function MediaRow({
  entry,
  onPreview,
}: {
  entry: Entry
  onPreview: (m: ProjectMedia) => void
}) {
  if (!entry.media || entry.media.length === 0) return null
  return (
    <div className="media-row">
      {entry.media.map((m, i) => (
        <MediaThumb m={m} key={i} onPreview={onPreview} />
      ))}
    </div>
  )
}

/** Download buttons for files dropped in the page folder (e.g. installers). */
function Downloads({ entry }: { entry: Entry }) {
  if (!entry.downloads || entry.downloads.length === 0) return null
  return (
    <div className="dl-row">
      {entry.downloads.map((d, i) => (
        <a className="dllnk" key={i} href={d.url} download={d.filename}>
          {d.label} ↓
        </a>
      ))}
    </div>
  )
}

/** Small framed box with a button that opens the certificate PDF in a new tab. */
function CertCard({ url }: { url: string }) {
  return (
    <div className="cert-card">
      <svg className="cert-card-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2.5h8L18 6.5V21.5H6Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.5 2.5V7H18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="9" y1="15.5" x2="15" y2="15.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="cert-card-title">Certificate</span>
      <a className="cert-view" href={url} target="_blank" rel="noopener noreferrer">
        View Certificate ↗
      </a>
    </div>
  )
}

/** The "open ↗" link buttons, shared by every page kind. The optional
 *  className lets the same links render as an overlay inside the photo on
 *  mobile (see the `link-fig` copy in the education/experience branch). */
function Links({ entry, className = '' }: { entry: Entry; className?: string }) {
  if (!entry.links || entry.links.length === 0) return null
  return (
    <div className={`link-row ${className}`.trim()}>
      {entry.links.map((l, i) => (
        <a
          className="openlnk"
          key={i}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  )
}

/** Renders whatever entry is currently selected into the windshield. */
export function EntryContent({ entry }: { entry: Entry | null }) {
  const [preview, setPreview] = useState<ProjectMedia | null>(null)
  // Close any open preview when the selected page changes (id is stable).
  useEffect(() => setPreview(null), [entry ? entry.id : null])

  let content
  if (!entry) {
    content = <FlightDeck />
  } else if (entry.kind === 'project') {
    content = (
      <>
        <span className="ml ws-hud ws-hud-intro">{entry.summary}</span>
        <div className="ws-head">{entry.title}</div>

        <MediaRow entry={entry} onPreview={setPreview} />
        <Links entry={entry} />
        <Downloads entry={entry} />

        <div
          className="ws-body"
          dangerouslySetInnerHTML={{ __html: entry.features }}
        />

        {entry.tech.length > 0 && (
          <div className="tech-row" aria-label="Tech stack">
            {entry.tech.map((t) => {
              const url = skillUrl(t)
              return url ? (
                <a
                  className="tech-tag"
                  key={t}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t}
                </a>
              ) : (
                <span className="tech-tag" key={t}>
                  {t}
                </span>
              )
            })}
          </div>
        )}
      </>
    )
  } else {
    // education / experience: small photo (or certificate box) floated into the
    // top-right, text wraps around it.
    content = (
      <>
        {entry.media && entry.media.length > 0 && (
          <div className="ws-figure">
            {entry.media.map((m, i) => (
              <PlainMedia m={m} key={i} />
            ))}
            {/* MOBILE ONLY, EDUCATION ONLY: links overlaid in the photo's corner
                (hidden on desktop; the normal link-row below is hidden on mobile
                only on these pages). Experience pages keep the link below. */}
            {entry.kind === 'education' && (
              <Links entry={entry} className="link-fig" />
            )}
          </div>
        )}
        {(!entry.media || entry.media.length === 0) && entry.certificateUrl && (
          <CertCard url={entry.certificateUrl} />
        )}
        <span className="ml ws-hud">{entry.hudLabel}</span>
        <div className="ws-head">{entry.title}</div>
        {entry.meta && <div className="ws-meta">{entry.meta}</div>}
        <Links entry={entry} />
        <Downloads entry={entry} />
        <div className="ws-body" dangerouslySetInnerHTML={{ __html: entry.body }} />
      </>
    )
  }

  return (
    <>
      {content}
      {preview && <Lightbox media={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
