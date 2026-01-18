'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

/* ======================================================
   Types
====================================================== */

export interface NowPlaying {
  track: string
  artist: string
  artwork: string | null
}

/* ======================================================
   Context
====================================================== */

const NowPlayingContext =
  createContext<NowPlaying | null>(null)

/* ======================================================
   Provider
====================================================== */

export function NowPlayingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [nowPlaying, setNowPlaying] =
    useState<NowPlaying | null>(null)

  useEffect(() => {
    let alive = true

    async function fetchNowPlaying() {
      try {
        const res = await fetch('/api/now-playing', {
          cache: 'no-store',
        })

        if (!res.ok) return

        const data = (await res.json()) as
          | {
              track?: string
              title?: string
              artist?: string
              artwork?: string | null
            }
          | null

        if (!alive || !data) return

        const track =
          typeof data.track === 'string'
            ? data.track
            : typeof data.title === 'string'
              ? data.title
              : null

        if (!track || !data.artist) return

        setNowPlaying({
          track,
          artist: data.artist,
          artwork: data.artwork ?? null,
        })
      } catch {
        // silent fail
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 15_000)

    return () => {
      alive = false
      clearInterval(interval)
    }
  }, [])

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      {children}
    </NowPlayingContext.Provider>
  )
}

/* ======================================================
   Hook
====================================================== */

export function useNowPlaying() {
  return useContext(NowPlayingContext)
}
