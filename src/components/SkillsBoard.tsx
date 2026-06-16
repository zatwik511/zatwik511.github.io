import { skillUrl, type SkillGroup } from '../content'

/**
 * The Skills board shown in the windshield when the cockpit's Skills button is
 * active. Each category is a row of chips; chips with a known official URL
 * (see skills.ts) are clickable, the rest render as plain tags.
 */
export function SkillsBoard({ groups }: { groups: SkillGroup[] }) {
  return (
    <>
      <span className="ml ws-hud">FLIGHT SYSTEMS</span>
      <div className="ws-head">Skills</div>

      <div className="skills-board">
        {groups.map((group) => (
          <div className="skill-cat" key={group.heading}>
            <span className="ml skill-cat-head">{group.heading}</span>
            <div className="tech-row" aria-label={group.heading}>
              {group.items.map((s) => {
                const url = skillUrl(s)
                return url ? (
                  <a
                    className="tech-tag"
                    key={s}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s}
                  </a>
                ) : (
                  <span className="tech-tag" key={s}>
                    {s}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
