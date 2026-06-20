import { useEffect, useState } from 'react'
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
  | { kind: 'hobbies' }

/** Transient hover preview shown in the windshield (button label + blurb). */
export interface Preview {
  title: string
  blurb?: string
}

export function App() {
  const [view, setView] = useState<View>({ kind: 'home' })
  // Bumped on every cockpit button click; nudges the border triangles forward.
  const [pulse, setPulse] = useState(0)
  // Set while a cockpit button is hovered/focused; cleared on leave or click.
  const [preview, setPreview] = useState<Preview | null>(null)
  // True during the boot-up intro (cockpit powers on, then the windshield).
  const [booting, setBooting] = useState(true)
  // MOBILE ONLY: which panel is on screen. Desktop shows both side by side and
  // ignores this entirely (the CSS that reads it lives in the mobile media
  // query). The windshield is home base; a glowing cue summons the cockpit,
  // and tapping a cockpit control crossfades back to the windshield.
  const [mobilePanel, setMobilePanel] = useState<'windshield' | 'cockpit'>('windshield')
  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 4000)
    return () => window.clearTimeout(t)
  }, [])
  const show = (next: View) => {
    setView(next)
    setPulse((p) => p + 1)
    // Drop the hover preview so the freshly fetched page (and its warp-in)
    // shows immediately, even while the cursor is still on the button.
    setPreview(null)
    // On mobile, a cockpit control crossfades back to the windshield to reveal
    // the content it loaded. (No-op on desktop — both panels are always shown.)
    setMobilePanel('windshield')
  }

  // Resolved fresh every render (not memoised) so editing a page's markdown
  // hot-reloads into the windshield even while that page is open.
  const selected = view.kind === 'entry' ? getEntry(view.id) ?? null : null
  const showSkills = view.kind === 'skills'
  const showHobbies = view.kind === 'hobbies'
  // The entry id the cockpit should highlight (none while home/skills/hobbies).
  const selectedId = view.kind === 'entry' ? view.id : null

  // Live Spotify track (falls back to the static profile track until/if it loads).
  const livePlaying = useNowPlaying()
  const nowPlaying = livePlaying ?? profile.nowPlaying

  // Phase 3 will route this into the 3D ride. Until then it's a no-op
  // affordance so the cockpit stays self-contained.
  const handleLaunch = () => {
    // TODO(phase-3): navigate to the 3D ride (mode `x`).
  }

  const deckClass = [
    'deck',
    booting ? 'booting' : '',
    `panel-${mobilePanel}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={deckClass}>
      <CursorTrail />
      <Windshield
        nowPlaying={nowPlaying}
        selected={selected}
        showSkills={showSkills}
        showHobbies={showHobbies}
        skillGroups={profile.skillGroups}
        hobbyGroups={profile.hobbyGroups}
        pulse={pulse}
        preview={preview}
        onLaunch={handleLaunch}
        onOpenCockpit={() => setMobilePanel('cockpit')}
      />
      <Cockpit
        profile={profile}
        selectedId={selectedId}
        skillsActive={showSkills}
        hobbiesActive={showHobbies}
        onSelect={(id) => show({ kind: 'entry', id })}
        onSkills={() => show({ kind: 'skills' })}
        onHobbies={() => show({ kind: 'hobbies' })}
        onHome={() => show({ kind: 'home' })}
        onPreview={setPreview}
        onPreviewEnd={() => setPreview(null)}
        onCloseCockpit={() => setMobilePanel('windshield')}
      />
    </main>
  )
}
