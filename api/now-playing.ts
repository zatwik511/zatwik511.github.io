import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Spotify "now playing" for zatwik.com.
 *
 * Uses a stored refresh token (server-side only) to mint an access token, then
 * returns the currently-playing track — or, if nothing is playing, the most
 * recently played one (isPlaying: false). Deployed as a Vercel Function; the
 * GitHub Pages frontend fetches it cross-origin (see the CORS allowlist).
 *
 * Required environment variables (set in the Vercel project):
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REFRESH_TOKEN
 */

const ALLOWED_ORIGINS = [
  'https://zatwik511.github.io',
  'https://zatwik.com',
  'https://www.zatwik.com',
  'http://localhost:5173',
]

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

interface Track {
  track: string
  artist: string
  albumArt: string | null
  trackUrl: string | null
  artistUrl: string | null
  albumUrl: string | null
  isPlaying: boolean
}

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN
  if (!id || !secret || !refresh) return null

  const basic = Buffer.from(`${id}:${secret}`).toString('base64')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { access_token?: string }
  return data.access_token ?? null
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toTrack(item: any, isPlaying: boolean): Track | null {
  if (!item) return null
  const artistList = Array.isArray(item.artists) ? item.artists : []
  const artists = artistList.length
    ? artistList.map((a: any) => a.name).join(', ')
    : (item.show?.name ?? '') // podcast episodes
  const images = item.album?.images ?? item.images ?? []
  return {
    track: item.name ?? '',
    artist: artists,
    albumArt: images[0]?.url ?? null,
    trackUrl: item.external_urls?.spotify ?? null,
    artistUrl:
      artistList[0]?.external_urls?.spotify ??
      item.show?.external_urls?.spotify ??
      null,
    albumUrl: item.album?.external_urls?.spotify ?? null,
    isPlaying,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const token = await getAccessToken()
    if (!token) {
      res.status(500).json({ ok: false, error: 'Spotify not configured' })
      return
    }
    const auth = { Authorization: `Bearer ${token}` }

    // 1) Currently playing.
    const nowRes = await fetch(NOW_PLAYING_URL, { headers: auth })
    if (nowRes.status === 200) {
      const data = (await nowRes.json()) as { is_playing?: boolean; item?: unknown }
      const track = toTrack(data.item, Boolean(data.is_playing))
      if (track) {
        // Cache briefly at the edge so we don't hammer Spotify.
        res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=40')
        res.status(200).json({ ok: true, ...track })
        return
      }
    }

    // 2) Fall back to most recently played.
    const recentRes = await fetch(RECENT_URL, { headers: auth })
    if (recentRes.ok) {
      const data = (await recentRes.json()) as { items?: { track?: unknown }[] }
      const track = toTrack(data.items?.[0]?.track, false)
      if (track) {
        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
        res.status(200).json({ ok: true, ...track })
        return
      }
    }

    res.status(200).json({ ok: false, error: 'No track available' })
  } catch (err) {
    console.error('now-playing failed', err)
    res.status(502).json({ ok: false, error: 'Spotify request failed' })
  }
}
