'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'
import { NOW_PLAYING_POLL_MS } from './audio.constants'
import { extractNowPlaying, hasNowPlayingChanged } from './audio.nowPlaying'
import type { ExtractedNowPlaying } from './audio.types'

type UseNowPlayingPollerArgs = {
  nowPlayingUrl: string
  fallback: ExtractedNowPlaying
  onChange: (next: ExtractedNowPlaying) => void
  onError?: (message: string | null) => void
}

export function useNowPlayingPoller({
  nowPlayingUrl,
  fallback,
  onChange,
  onError,
}: UseNowPlayingPollerArgs) {
  const lastRef = useRef<ExtractedNowPlaying>(fallback)

  useEffect(() => {
    let alive = true
    let timerId: number | null = null

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(nowPlayingUrl, {
          cache: 'no-store',
        })

        if (!res.ok) {
          onError?.(`now_playing_http_${res.status}`)
          return
        }

        const payload = await res.json()
        if (!alive) return

        const extracted = extractNowPlaying(payload)

        const next: ExtractedNowPlaying = {
          title: extracted.title || fallback.title,
          artist: extracted.artist || fallback.artist,
          album: extracted.album || fallback.album,
          artwork: extracted.artwork,
          isLive: extracted.isLive,
        }

        const changed = hasNowPlayingChanged(lastRef.current, next)

        if (!changed) {
          onError?.(null)
          return
        }

        lastRef.current = next
        onChange(next)
        onError?.(null)

        trackEvent('now_playing_updated', {
          placement: 'sticky_player',
          track: next.title,
          artist: next.artist,
          live: next.isLive,
        })
      } catch {
        onError?.('now_playing_fetch_failed')
      }
    }

    void fetchNowPlaying()
    timerId = window.setInterval(fetchNowPlaying, NOW_PLAYING_POLL_MS)

    return () => {
      alive = false
      if (timerId != null) {
        window.clearInterval(timerId)
      }
    }
  }, [fallback, nowPlayingUrl, onChange, onError])
}