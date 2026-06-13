import { skillUrl } from '../content'

/**
 * News-style horizontal crawl of skill names pinned to the top of the
 * windshield. The list is duplicated so the -50% keyframe loops seamlessly.
 * The crawl pauses on hover, and each skill links to its official site.
 * Paused under prefers-reduced-motion (see global.css).
 */
export function SkillsTicker({ skills }: { skills: string[] }) {
  const run = [...skills, ...skills]
  return (
    <div className="tick-wrap" aria-hidden="true">
      <div className="tick-track">
        {run.map((skill, i) => {
          const url = skillUrl(skill)
          return (
            <span key={i}>
              {url ? (
                <a
                  className="tick-skill"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                >
                  {skill}
                </a>
              ) : (
                skill
              )}
              <b> ◀ </b>
            </span>
          )
        })}
      </div>
    </div>
  )
}
