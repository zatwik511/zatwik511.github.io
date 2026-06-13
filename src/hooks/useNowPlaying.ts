import { useEffect, useState } from 'react'
import type { NowPlaying } from '../content'

// Absolute URL of the deployed function for the GitHub Pages build; falls back
// to same-origin for `vercel dev`. See .env.example.
const ENDPOINT = import.meta.env.VITE_NOWPLAYING_ENDPOINT || '/api/now-playing'

interface NowPlayingResponse {
  ok?: boolean
  track?: string
  artist?: string
  albumArt?: string | null
  isPlaying?: boolean
}

/**
 * Polls the Spotify now-playing function. Returns the live track, or null if it
 * hasn't loaded / failed (callers fall back to the static profile track).
 */
export function useNowPlaying(): NowPlaying | null {
  const [data, setData] = useState<NowPlaying | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT)
        const d = (await res.json()) as NowPlayingResponse
        if (active && d?.ok && d.track) {
          setData({
            track: d.track,
            artist: d.artist ?? '',
            albumArt: d.albumArt ?? undefined,
            isPlaying: Boolean(d.isPlaying),
          })
        }
      } catch {
        // Network/CORS error — keep the static fallback.
      }
    }

    load()
    const id = window.setInterval(load, 60_000) // refresh every minute
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return data
}
