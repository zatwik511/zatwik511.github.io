/**
 * News-style horizontal crawl of skill names pinned to the top of the
 * windshield. The list is duplicated so the -50% keyframe loops seamlessly.
 * The animation is paused under prefers-reduced-motion (see global.css).
 */
export function SkillsTicker({ skills }: { skills: string[] }) {
  const run = [...skills, ...skills]
  return (
    <div className="tick-wrap" aria-hidden="true">
      <div className="tick-track">
        {run.map((skill, i) => (
          <span key={i}>
            {skill}
            <b> // </b>
          </span>
        ))}
      </div>
    </div>
  )
}
