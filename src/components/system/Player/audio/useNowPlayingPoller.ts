'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'
import { NOW_PLAYING_POLL_MS } from './audio.constants'
import { extractNowPlaying, hasNowPlayingChanged } from './audio.nowPlaying'
import type { PlaybackMetadata } from './audio.types'

type UseNowPlayingPollerArgs = {
  nowPlayingUrl: string
  fallback: PlaybackMetadata
  onChange: (next: PlaybackMetadata) => void
  onError?: (message: string | null) => void
}

export function useNowPlayingPoller({
  nowPlayingUrl,
  fallback,
  onChange,
  onError,
}: UseNowPlayingPollerArgs) {
  const lastRef = useRef<PlaybackMetadata>(fallback)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(nowPlayingUrl, {
          cache: 'no-store',
          signal: abortController.signal
        })

        if (!res.ok) {
          onError?.(`now_playing_http_${res.status}`)
          return
        }

        const payload = await res.json()
        const next = extractNowPlaying(payload)

        // Prevent redundant state updates if song hasn't changed
        if (!hasNowPlayingChanged(lastRef.current, next)) {
          onError?.(null)
          return
        }

        lastRef.current = next
        onChange(next)
        onError?.(null)

        trackEvent('now_playing_updated', {
          track: next.track,
          artist: next.artist,
          live: next.isLive,
        })
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          onError?.('now_playing_fetch_failed')
        }
      }
    }

    // Initial fetch on mount
    fetchNowPlaying()
    
    // Fix: Using const here because it's never reassigned after this point
    const timerId = setInterval(fetchNowPlaying, NOW_PLAYING_POLL_MS)

    return () => {
      clearInterval(timerId)
      abortController.abort()
    }
  }, [nowPlayingUrl, onChange, onError])
}