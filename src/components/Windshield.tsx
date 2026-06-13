import { useEffect, useRef } from 'react'
import type { Entry, NowPlaying as NowPlayingData } from '../content'
import { Starfield } from './Starfield'
import { SkillsTicker } from './SkillsTicker'
import { LaunchButton } from './LaunchButton'
import { NowPlaying } from './NowPlaying'
import { EntryContent } from './EntryContent'

interface WindshieldProps {
  skills: string[]
  nowPlaying: NowPlayingData
  selected: Entry | null
  onLaunch?: () => void
}

/**
 * The display panel (left on PC, top on phone): painted starfield, skills
 * ticker, a scrollable content area, the launch button, and now-playing.
 */
export function Windshield({
  skills,
  nowPlaying,
  selected,
  onLaunch,
}: WindshieldProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset scroll to the top whenever a new entry loads.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [selected])

  return (
    <section className="windshield" aria-label="Flight deck display">
      <Starfield />
      <SkillsTicker skills={skills} />
      <LaunchButton onLaunch={onLaunch} />

      <div className="ws-scroll" ref={scrollRef} aria-live="polite">
        <EntryContent entry={selected} />
      </div>

      <NowPlaying {...nowPlaying} />
    </section>
  )
}
