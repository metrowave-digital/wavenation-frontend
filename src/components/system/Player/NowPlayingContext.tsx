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

interface NowPlaying {
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

        const data = await res.json()

        if (
          alive &&
          data?.track &&
          data?.artist
        ) {
          setNowPlaying(data)
        }
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
