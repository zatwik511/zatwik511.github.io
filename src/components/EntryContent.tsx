import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { skillUrl, type Entry, type ProjectMedia } from '../content'

/** Default greeting shown in the windshield before anything is selected. */
function FlightDeck() {
  return (
    <>
      <span className="ml ws-hud">FLIGHT DECK</span>
      <div className="ws-head">Welcome aboard.</div>
      <div className="ws-meta">
        Pick an instrument from the cockpit — it loads here, and long entries
        scroll.
      </div>
    </>
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

/** The "open ↗" link buttons, shared by every page kind. */
function Links({ entry }: { entry: Entry }) {
  if (!entry.links || entry.links.length === 0) return null
  return (
    <div className="link-row">
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
        <span className="ml ws-hud">{entry.summary}</span>
        <div className="ws-head">{entry.title}</div>

        <MediaRow entry={entry} onPreview={setPreview} />
        <Links entry={entry} />

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
    // education / experience: small photo floated into the top-right, text wraps.
    content = (
      <>
        {entry.media && entry.media.length > 0 && (
          <div className="ws-figure">
            {entry.media.map((m, i) => (
              <PlainMedia m={m} key={i} />
            ))}
          </div>
        )}
        <span className="ml ws-hud">{entry.hudLabel}</span>
        <div className="ws-head">{entry.title}</div>
        {entry.meta && <div className="ws-meta">{entry.meta}</div>}
        <Links entry={entry} />
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
