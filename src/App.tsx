import { useMemo, useState } from 'react'
import { profile, getEntry, type EntryId } from './content'
import { Windshield } from './components/Windshield'
import { Cockpit } from './components/Cockpit'

export function App() {
  const [selectedId, setSelectedId] = useState<EntryId | null>(null)
  const selected = useMemo(
    () => (selectedId ? getEntry(selectedId) ?? null : null),
    [selectedId],
  )

  // Phase 3 will route this into the 3D ride. Until then it's a no-op
  // affordance so the cockpit stays self-contained.
  const handleLaunch = () => {
    // TODO(phase-3): navigate to the 3D ride (mode `x`).
  }

  return (
    <main className="deck">
      <Windshield
        skills={profile.skills}
        nowPlaying={profile.nowPlaying}
        selected={selected}
        onLaunch={handleLaunch}
      />
      <Cockpit profile={profile} selectedId={selectedId} onSelect={setSelectedId} />
    </main>
  )
}
