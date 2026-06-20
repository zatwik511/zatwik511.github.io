import { useEffect, useRef, useState } from 'react'
import { IconBrandSpotify } from '@tabler/icons-react'
import type { Preview } from '../App'
import type { Entry, NowPlaying as NowPlayingData, SkillGroup } from '../content'
import { LaunchButton } from './LaunchButton'
import { NowPlaying } from './NowPlaying'
import { EntryContent } from './EntryContent'
import { SkillsBoard } from './SkillsBoard'
import { HobbiesBoard } from './HobbiesBoard'

interface WindshieldProps {
  nowPlaying: NowPlayingData
  selected: Entry | null
  /** When true, the windshield shows the Skills board instead of an entry. */
  showSkills: boolean
  /** When true, the windshield shows the Hobbies board instead of an entry. */
  showHobbies: boolean
  skillGroups: SkillGroup[]
  hobbyGroups: SkillGroup[]
  /** Increments on every cockpit button click; re-fills the triangle border. */
  pulse: number
  /** Transient label preview shown while a cockpit button is hovered/focused. */
  preview: Preview | null
  onLaunch?: () => void
  /** MOBILE ONLY: summon the cockpit panel (glowing cue tap). */
  onOpenCockpit?: () => void
}

/** Gap between triangles along the border (≈ their length, so tips touch). */
const TRI_GAP = 8
/** How long the glow takes to lap the border on a click, in ms. */
const SWEEP_MS = 600
/** How long a hover preview takes to crossfade in, in ms. */
const PREVIEW_ENTER_MS = 260

/**
 * The display panel (left on PC, top on phone): painted drifting starfield, a
 * dim triangle border (a finished HUD frame) that a glow wave sweeps around on
 * each button click, a scrollable content area, the launch button, and
 * now-playing.
 *
 * The motion-path and cursor variables (--track / --mx / --my) are set on the
 * <section> so every layer that needs them inherits one value.
 */
export function Windshield({
  nowPlaying,
  selected,
  showSkills,
  showHobbies,
  skillGroups,
  hobbyGroups,
  pulse,
  preview,
  onLaunch,
  onOpenCockpit,
}: WindshieldProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const comingTimer = useRef(0)
  const litTimer = useRef(0)
  const openTimer = useRef(0)
  // How many triangles fit around the border (recomputed from the panel size).
  const [count, setCount] = useState(1)
  // Brief "COMING SOON !" popup shown when Launch 3D is clicked.
  const [coming, setComing] = useState(false)
  // MOBILE: tapping Launch 3D floods the triangle border red briefly (the
  // hover-flood from desktop, made tap-driven). Harmless on desktop — the CSS
  // that reads `.launch-lit` lives in the mobile media query.
  const [lit, setLit] = useState(false)
  // MOBILE: the now-playing corner collapses to just the Spotify logo; tapping
  // it expands the full widget as a popup (tapping elsewhere collapses it).
  // Ignored on desktop, where the widget is always shown (logo hidden via CSS).
  const [npOpen, setNpOpen] = useState(false)
  // The preview kept mounted locally so it can crossfade in and out (the prop
  // clears instantly on click/leave). `ov` is the overlay's opacity target and
  // the transition duration to reach it.
  const [shownPreview, setShownPreview] = useState<Preview | null>(null)
  const [ov, setOv] = useState<{ opacity: number; ms: number }>({ opacity: 0, ms: 0 })
  const shownRef = useRef<Preview | null>(null)
  const prevPulse = useRef(pulse)
  const exitTimer = useRef(0)
  const leaveTimer = useRef(0)
  const enterRaf = useRef(0)

  // Reset scroll to the top whenever the displayed view changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [selected, showSkills, showHobbies])

  // Build the rectangular motion path the triangles sit on, count how many fit
  // around it, and keep both in sync with the panel size.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.style.setProperty('--spark-ms', `${SWEEP_MS}ms`)
    const pad = 12 // path centre, inset from the edge
    const update = () => {
      const x2 = el.clientWidth - pad
      const y2 = el.clientHeight - pad
      const cx = el.clientWidth / 2 // bottom-centre, just below the now-playing widget
      // Start the loop at the bottom-centre so the glow starts there.
      el.style.setProperty(
        '--track',
        `path('M ${cx} ${y2} L ${pad} ${y2} L ${pad} ${pad} L ${x2} ${pad} L ${x2} ${y2} Z')`,
      )
      const perimeter = 2 * (x2 - pad) + 2 * (y2 - pad)
      setCount(Math.max(1, Math.floor(perimeter / TRI_GAP)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // On each button click, run the glow sweep around the border, then drop the
  // class so the head returns to its resting pulse. The class lives on the
  // <section>. Toggling with a reflow restarts the CSS animation without
  // remounting nodes.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || pulse === 0) return
    el.classList.remove('ws-sweep')
    void el.offsetWidth
    el.classList.add('ws-sweep')
    const t = window.setTimeout(() => el.classList.remove('ws-sweep'), SWEEP_MS + 40)
    return () => window.clearTimeout(t)
  }, [pulse])

  // Mirror the preview prop into local state so it can crossfade. A fresh
  // preview fades the overlay in; switching between previews keeps the overlay
  // opaque (the inner text crossfades via its keyed remount); clearing fades
  // it out — slowly on a click (in step with the page fade-in), fast on leave.
  useEffect(() => {
    if (preview) {
      window.clearTimeout(leaveTimer.current)
      window.clearTimeout(exitTimer.current)
      cancelAnimationFrame(enterRaf.current)
      const fresh = shownRef.current === null
      shownRef.current = preview
      setShownPreview(preview)
      prevPulse.current = pulse
      if (fresh) {
        // Appearing over a page/other view: crossfade the whole overlay in.
        setOv({ opacity: 0, ms: 0 })
        enterRaf.current = requestAnimationFrame(() =>
          setOv({ opacity: 1, ms: PREVIEW_ENTER_MS }),
        )
      } else {
        // Swapping previews: keep the overlay opaque (no page flash).
        setOv({ opacity: 1, ms: PREVIEW_ENTER_MS })
      }
      return
    }
    if (!shownRef.current) return

    const finishExit = (ms: number) => {
      setOv({ opacity: 0, ms })
      window.clearTimeout(exitTimer.current)
      exitTimer.current = window.setTimeout(() => {
        shownRef.current = null
        setShownPreview(null)
      }, ms)
    }

    window.clearTimeout(leaveTimer.current)
    if (pulse !== prevPulse.current) {
      // Click: crossfade out in step with the page fade-in.
      prevPulse.current = pulse
      finishExit(SWEEP_MS)
    } else {
      // Mouse leave: hold briefly in case the cursor is just crossing to
      // another button (which re-shows the preview and cancels this), then
      // fade out quickly. The hold stops the page flashing between buttons.
      leaveTimer.current = window.setTimeout(() => finishExit(160), 90)
    }
  }, [preview, pulse])

  // Cancel any pending timers on unmount.
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(enterRaf.current)
      clearTimeout(comingTimer.current)
      clearTimeout(exitTimer.current)
      clearTimeout(leaveTimer.current)
      clearTimeout(litTimer.current)
      clearTimeout(openTimer.current)
    },
    [],
  )

  // Launch 3D isn't built yet — flash a "COMING SOON !" popup. On mobile this
  // also floods the triangle border red for a beat (the desktop hover effect,
  // made tap-driven).
  const showComingSoon = () => {
    onLaunch?.()
    setComing(true)
    window.clearTimeout(comingTimer.current)
    comingTimer.current = window.setTimeout(() => setComing(false), 1800)
    setLit(true)
    window.clearTimeout(litTimer.current)
    litTimer.current = window.setTimeout(() => setLit(false), 750)
  }

  // MOBILE: the glowing triangle below the launch area. Tapping it flashes the
  // triangle border (like clicking Launch 3D on PC), then summons the cockpit a
  // beat later so the flash is visible before the crossfade.
  const enterCockpit = () => {
    setLit(true)
    window.clearTimeout(litTimer.current)
    litTimer.current = window.setTimeout(() => setLit(false), 800)
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => onOpenCockpit?.(), 300)
  }

  // Track the cursor (throttled to one frame): drives the star flare and the
  // inner rule's hover glow.
  const moveCursor = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    })
  }

  // Park the cursor spotlight off-screen when it leaves the windshield.
  const hideCursor = () => {
    const el = sectionRef.current
    if (!el) return
    el.style.setProperty('--mx', '-9999px')
    el.style.setProperty('--my', '-9999px')
  }

  return (
    <section
      className={lit ? 'windshield launch-lit' : 'windshield'}
      aria-label="Flight deck display"
      ref={sectionRef}
      onMouseMove={moveCursor}
      onMouseLeave={hideCursor}
    >
      <div className="ws-glow" aria-hidden="true">
        <div className="ws-glow-img" />
      </div>

      {/* Boot-up: black panel that powers off to reveal the starfield. */}
      <div className="ws-screen" aria-hidden="true" />

      {/* Dim triangle border (a finished HUD frame); a glow wave sweeps it on
          each click via the .ws-sweep class (toggled on the <section>). */}
      <div className="ws-border" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <i key={i} style={{ '--i': i } as React.CSSProperties} />
        ))}
        {/* The single glow that laps the frame on click. */}
        <span className="ws-spark" />
      </div>

      {/* Thin rule between the triangle road and the content; base + cursor glow. */}
      <div className="ws-rule" aria-hidden="true" />
      <div className="ws-rule ws-rule-glow" aria-hidden="true" />

      {/* MOBILE: a full-screen catcher behind the open popup — tapping anywhere
          off the widget collapses it back to the logo. */}
      {npOpen && (
        <div
          className="np-backdrop"
          onClick={() => setNpOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={npOpen ? 'ws-np-corner np-open' : 'ws-np-corner'}>
        {/* MOBILE-ONLY collapsed state: just the Spotify logo (hidden on
            desktop, where the full widget always shows). */}
        <button
          type="button"
          className="np-logo"
          onClick={() => setNpOpen((o) => !o)}
          aria-label="Show what's playing"
          aria-expanded={npOpen}
        >
          <IconBrandSpotify size={30} stroke={1.7} aria-hidden="true" />
        </button>
        <NowPlaying {...nowPlaying} />
      </div>

      <div className="ws-scroll" ref={scrollRef} aria-live="polite">
        {/* reserves the top-right corner so headings wrap before the now-playing
            widget — not needed on the centred home screen. */}
        {!(selected === null && !showSkills && !showHobbies) && (
          <div className="ws-widget-spacer" aria-hidden="true" />
        )}
        {/* key={pulse} remounts on each click so the warp-in transition replays.
            data-entry / data-kind expose the current page for per-page and
            per-kind CSS tweaks. */}
        <div
          className="ws-page"
          key={pulse}
          data-entry={selected?.id}
          data-kind={selected?.kind}
        >
          {showSkills ? (
            <SkillsBoard groups={skillGroups} />
          ) : showHobbies ? (
            <HobbiesBoard groups={hobbyGroups} />
          ) : (
            <EntryContent entry={selected} />
          )}
        </div>
      </div>

      {/* Transient hover preview: the button's label + blurb over the page.
          The overlay opacity crossfades in/out; the inner text remounts (keyed)
          so it crossfades when switching from one preview to another. */}
      {shownPreview && (
        <div
          className="ws-preview"
          style={{ opacity: ov.opacity, transitionDuration: `${ov.ms}ms` }}
          aria-hidden="true"
        >
          <div
            className="ws-preview-text"
            key={`${shownPreview.title}|${shownPreview.blurb ?? ''}`}
          >
            <div className="ws-head">{shownPreview.title}</div>
            {shownPreview.blurb && <div className="ws-meta">{shownPreview.blurb}</div>}
          </div>
        </div>
      )}

      <div className="ws-launch-bar">
        <LaunchButton onLaunch={showComingSoon} />
      </div>

      {/* MOBILE ONLY: a glowing, downward-pointing triangle (the Launch 3D
          triangle, flipped) that summons the cockpit. No label — it just
          pulses, waiting for a tap. Hidden on desktop, where both panels show. */}
      <button
        type="button"
        className="ws-enter"
        onClick={enterCockpit}
        aria-label="Open the cockpit controls"
      >
        <span className="ws-enter-tri" aria-hidden="true" />
      </button>

      {coming && (
        <div className="ws-toast" role="status">
          COMING SOON !
        </div>
      )}
    </section>
  )
}
