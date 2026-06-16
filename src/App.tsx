import { useState } from 'react'
import { profile, getEntry, type EntryId } from './content'
import { Windshield } from './components/Windshield'
import { Cockpit } from './components/Cockpit'
import { CursorTrail } from './components/CursorTrail'
import { useNowPlaying } from './hooks/useNowPlaying'

/** What the windshield is currently showing. */
type View =
  | { kind: 'home' }
  | { kind: 'entry'; id: EntryId }
  | { kind: 'skills' }

export function App() {
  const [view, setView] = useState<View>({ kind: 'home' })
  // Bumped on every cockpit button click; nudges the border triangles forward.
  const [pulse, setPulse] = useState(0)
  const show = (next: View) => {
    setView(next)
    setPulse((p) => p + 1)
  }

  // Resolved fresh every render (not memoised) so editing a page's markdown
  // hot-reloads into the windshield even while that page is open.
  const selected = view.kind === 'entry' ? getEntry(view.id) ?? null : null
  const showSkills = view.kind === 'skills'
  // The entry id the cockpit should highlight (none while home/skills).
  const selectedId = view.kind === 'entry' ? view.id : null

  // Live Spotify track (falls back to the static profile track until/if it loads).
  const livePlaying = useNowPlaying()
  const nowPlaying = livePlaying ?? profile.nowPlaying

  // Phase 3 will route this into the 3D ride. Until then it's a no-op
  // affordance so the cockpit stays self-contained.
  const handleLaunch = () => {
    // TODO(phase-3): navigate to the 3D ride (mode `x`).
  }

  return (
    <main className="deck">
      <CursorTrail />
      <Windshield
        nowPlaying={nowPlaying}
        selected={selected}
        showSkills={showSkills}
        skillGroups={profile.skillGroups}
        pulse={pulse}
        onLaunch={handleLaunch}
      />
      <Cockpit
        profile={profile}
        selectedId={selectedId}
        skillsActive={showSkills}
        onSelect={(id) => show({ kind: 'entry', id })}
        onSkills={() => show({ kind: 'skills' })}
        onHome={() => show({ kind: 'home' })}
      />
    </main>
  )
}
