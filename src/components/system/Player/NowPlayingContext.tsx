'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
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

const NowPlayingContext = createContext<NowPlaying | null>(null)

/* ======================================================
   Provider
====================================================== */

export function NowPlayingProvider({ children }: { children: ReactNode }) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchNowPlaying() {
      try {
        const res = await fetch('/api/now-playing', {
          cache: 'no-store',
          signal: abortController.signal,
        })

        if (!res.ok) return

        const json = (await res.json()) as {
          nowPlaying?: {
            title?: string
            artist?: string
            artwork?: string | null
          }
        }

        const data = json?.nowPlaying
        if (!data?.title || !data?.artist) return

        setNowPlaying((prev) => {
          if (
            prev?.track === data.title &&
            prev?.artist === data.artist &&
            prev?.artwork === (data.artwork ?? null)
          ) {
            return prev
          }

          return {
            track: data.title!,
            artist: data.artist!,
            artwork: data.artwork ?? null,
          }
        })
      } catch (error: unknown) {
        // Fix: Use 'unknown' and check error name to avoid 'any' lint error
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn('NowPlaying polling failed:', error.message)
        }
      }
    }

    fetchNowPlaying()
    
    // Fix: Declare as const since it is never reassigned
    const intervalId = setInterval(fetchNowPlaying, 15_000)

    return () => {
      clearInterval(intervalId)
      abortController.abort()
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