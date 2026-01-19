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

        const json = (await res.json()) as {
          nowPlaying?: {
            title?: string
            artist?: string
            artwork?: string | null
          }
        }

        if (!alive || !json?.nowPlaying) return

        const { title, artist, artwork } = json.nowPlaying

        if (!title || !artist) return

        setNowPlaying({
          track: title,
          artist,
          artwork: artwork ?? null,
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
