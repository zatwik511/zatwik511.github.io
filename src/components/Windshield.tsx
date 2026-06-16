import { useEffect, useRef, useState } from 'react'
import type { Entry, NowPlaying as NowPlayingData, SkillGroup } from '../content'
import { LaunchButton } from './LaunchButton'
import { NowPlaying } from './NowPlaying'
import { EntryContent } from './EntryContent'
import { SkillsBoard } from './SkillsBoard'

interface WindshieldProps {
  nowPlaying: NowPlayingData
  selected: Entry | null
  /** When true, the windshield shows the Skills board instead of an entry. */
  showSkills: boolean
  skillGroups: SkillGroup[]
  /** Increments on every cockpit button click; re-fills the triangle border. */
  pulse: number
  onLaunch?: () => void
}

/** Gap between triangles along the border (≈ their length, so tips touch). */
const TRI_GAP = 8
/** How long the glow takes to lap the border on a click, in ms. */
const SWEEP_MS = 600

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
  skillGroups,
  pulse,
  onLaunch,
}: WindshieldProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const comingTimer = useRef(0)
  // How many triangles fit around the border (recomputed from the panel size).
  const [count, setCount] = useState(1)
  // Brief "COMING SOON !" popup shown when Launch 3D is clicked.
  const [coming, setComing] = useState(false)

  // Reset scroll to the top whenever the displayed view changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [selected, showSkills])

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
  // class so the head returns to its resting pulse. Toggling with a reflow
  // restarts the CSS animation without remounting nodes.
  useEffect(() => {
    const el = borderRef.current
    if (!el || pulse === 0) return
    el.classList.remove('ws-sweep')
    void el.offsetWidth
    el.classList.add('ws-sweep')
    const t = window.setTimeout(() => el.classList.remove('ws-sweep'), SWEEP_MS + 40)
    return () => window.clearTimeout(t)
  }, [pulse])

  // Cancel any pending timers on unmount.
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(comingTimer.current)
    },
    [],
  )

  // Launch 3D isn't built yet — flash a "COMING SOON !" popup.
  const showComingSoon = () => {
    onLaunch?.()
    setComing(true)
    window.clearTimeout(comingTimer.current)
    comingTimer.current = window.setTimeout(() => setComing(false), 1800)
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
      className="windshield"
      aria-label="Flight deck display"
      ref={sectionRef}
      onMouseMove={moveCursor}
      onMouseLeave={hideCursor}
    >
      <div className="ws-glow" aria-hidden="true">
        <div className="ws-glow-img" />
      </div>

      {/* Dim triangle border (a finished HUD frame); a glow wave sweeps it on
          each click via the .ws-sweep class (toggled in an effect). */}
      <div className="ws-border" ref={borderRef} aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <i key={i} style={{ '--i': i } as React.CSSProperties} />
        ))}
        {/* The single glow that laps the frame on click. */}
        <span className="ws-spark" />
      </div>

      {/* Thin rule between the triangle road and the content; base + cursor glow. */}
      <div className="ws-rule" aria-hidden="true" />
      <div className="ws-rule ws-rule-glow" aria-hidden="true" />

      <div className="ws-np-corner">
        <NowPlaying {...nowPlaying} />
      </div>

      <div className="ws-scroll" ref={scrollRef} aria-live="polite">
        {/* reserves the top-right corner so headings wrap before the now-playing widget */}
        <div className="ws-widget-spacer" aria-hidden="true" />
        {showSkills ? (
          <SkillsBoard groups={skillGroups} />
        ) : (
          <EntryContent entry={selected} />
        )}
      </div>

      <div className="ws-launch-bar">
        <LaunchButton onLaunch={showComingSoon} />
      </div>

      {coming && (
        <div className="ws-toast" role="status">
          COMING SOON !
        </div>
      )}
    </section>
  )
}
