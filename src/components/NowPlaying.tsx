import { useEffect, useRef, useState } from 'react'
import { IconBrandSpotify } from '@tabler/icons-react'
import type { NowPlaying as NowPlayingData } from '../content'

/**
 * Now-playing widget. Three lines (label / song / artist). The song title
 * scrolls (ping-pong) only when it's too long to fit; otherwise it sits still.
 */
export function NowPlaying({
  track,
  artist,
  albumArt,
  isPlaying = true,
}: NowPlayingData) {
  const clipRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [scroll, setScroll] = useState(false)

  // Reset to a single copy on track change so we can re-measure overflow.
  useEffect(() => {
    setScroll(false)
  }, [track])

  useEffect(() => {
    if (scroll) return
    const clip = clipRef.current
    const text = textRef.current
    if (!clip || !text) return
    if (text.scrollWidth > clip.clientWidth + 1) setScroll(true)
  }, [track, scroll])

  return (
    <div className="np">
      <div className="np-info">
        <div className="ml np-label">
          <IconBrandSpotify
            className="np-spot"
            size={19}
            stroke={1.6}
            aria-hidden="true"
          />
          {isPlaying ? 'PLAYING' : 'PLAYED'}
        </div>
        <div className="np-title" ref={clipRef}>
          {scroll ? (
            <div className="np-loop">
              <span>{track}</span>
              <span aria-hidden="true">{track}</span>
            </div>
          ) : (
            <span ref={textRef}>{track}</span>
          )}
        </div>
        <div className="np-artist">{artist}</div>
      </div>
      <div className="np-art">
        {albumArt && <img className="np-cover" src={albumArt} alt="" />}
        <span className="np-scrim" aria-hidden="true" />
        <span className={isPlaying ? 'eq' : 'eq eq-paused'} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  )
}
