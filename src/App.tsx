import { useMemo, useState } from 'react'
import { profile, getEntry, type EntryId } from './content'
import { Windshield } from './components/Windshield'
import { Cockpit } from './components/Cockpit'
import { CursorTrail } from './components/CursorTrail'
import { useNowPlaying } from './hooks/useNowPlaying'

export function App() {
  const [selectedId, setSelectedId] = useState<EntryId | null>(null)
  const selected = useMemo(
    () => (selectedId ? getEntry(selectedId) ?? null : null),
    [selectedId],
  )

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
        skills={profile.skills}
        nowPlaying={nowPlaying}
        selected={selected}
        onLaunch={handleLaunch}
      />
      <Cockpit
        profile={profile}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onHome={() => setSelectedId(null)}
      />
    </main>
  )
}
