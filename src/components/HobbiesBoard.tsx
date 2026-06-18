import type { SkillGroup } from '../content'

/**
 * The Hobbies board shown in the windshield when the cockpit's Hobbies button
 * is active. Mirrors the Skills board layout — each category is a row of chips
 * — but hobbies are personal, so the chips are plain (non-clickable) tags.
 */
export function HobbiesBoard({ groups }: { groups: SkillGroup[] }) {
  return (
    <>
      <span className="ml ws-hud">OFF DUTY</span>
      <div className="ws-head">Hobbies</div>

      <div className="skills-board">
        {groups.map((group) => (
          <div className="skill-cat" key={group.heading}>
            <span className="ml skill-cat-head">{group.heading}</span>
            <div className="tech-row" aria-label={group.heading}>
              {group.items.map((h) => (
                <span className="tech-tag" key={h}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
