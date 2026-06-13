import { IconBrandSpotify } from '@tabler/icons-react'
import type { NowPlaying as NowPlayingData } from '../content'

/**
 * Now-playing strip pinned to the bottom of the windshield. Currently shows a
 * fixed fallback track; Phase 4 swaps in the live Spotify endpoint.
 */
export function NowPlaying({ track, artist }: NowPlayingData) {
  return (
    <div className="np">
      <IconBrandSpotify size={20} color="var(--spotify)" aria-hidden="true" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ml" style={{ color: 'var(--spotify)' }}>
          NOW PLAYING
        </div>
        <div className="np-track">
          {track} · {artist}
        </div>
      </div>
      <span className="eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}
