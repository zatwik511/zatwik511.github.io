import type { Entry, ProjectEntry } from '../content'

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

function ProjectDetail({ entry }: { entry: ProjectEntry }) {
  return (
    <>
      <span className="ml ws-hud">{entry.hudLabel}</span>
      <div className="ws-summary">{entry.summary}</div>

      <div className="media-row">
        {entry.media.map((m, i) => (
          <div className="ph" key={i}>
            {m.type === 'video' ? '► ' : ''}
            {m.caption}
          </div>
        ))}
      </div>

      {entry.link && (
        <a
          className="openlnk"
          href={entry.link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {entry.link.label} ↗
        </a>
      )}

      <div className="ws-body">{entry.features}</div>

      {entry.tech.length > 0 && (
        <div className="tech-row" aria-label="Tech stack">
          {entry.tech.map((t) => (
            <span className="tech-tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

/** Renders whatever entry is currently selected into the windshield. */
export function EntryContent({ entry }: { entry: Entry | null }) {
  if (!entry) return <FlightDeck />

  if (entry.kind === 'project') return <ProjectDetail entry={entry} />

  // education / experience — simple text.
  return (
    <>
      <span className="ml ws-hud">{entry.hudLabel}</span>
      <div className="ws-head">{entry.title}</div>
      {entry.meta && <div className="ws-meta">{entry.meta}</div>}
      <div className="ws-body">{entry.body}</div>
    </>
  )
}
