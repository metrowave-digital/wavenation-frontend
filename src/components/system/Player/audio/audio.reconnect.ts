import { type MutableRefObject } from 'react'
import {
  RECONNECT_BASE_MS,
  RECONNECT_JITTER_MS,
  RECONNECT_MAX_EXPONENT,
  RECONNECT_MAX_MS,
} from './audio.constants'

/**
 * Calculates exponential backoff with jitter.
 * This prevents "thundering herd" issues on your metadata server.
 */
export function computeReconnectBackoffMs(attempt: number): number {
  const safeAttempt = Math.max(0, attempt)
  const power = Math.min(RECONNECT_MAX_EXPONENT, safeAttempt)
  const base = RECONNECT_BASE_MS * Math.pow(2, power)
  const jitter = Math.floor(Math.random() * RECONNECT_JITTER_MS)

  return Math.min(RECONNECT_MAX_MS, base + jitter)
}

/**
 * Appends a high-resolution timestamp to the stream URL.
 * This forces the browser/HLS to bypass the cache and grab a fresh segment.
 */
export function buildReloadedStreamUrl(streamUrl: string): string {
  const url = new URL(streamUrl)
  url.searchParams.set('t', Date.now().toString())
  return url.toString()
}

/**
 * Forces the audio element to drop its current buffer and reconnect.
 */
export function hardReloadStreamSrc(
  audio: HTMLAudioElement,
  streamUrl: string
): string {
  const nextSrc = buildReloadedStreamUrl(streamUrl)

  try {
    audio.pause()
    audio.src = nextSrc
    audio.load()
  } catch {
    // Fail silently
  }

  return nextSrc
}

export function clearReconnectTimer(
  reconnectTimerRef: MutableRefObject<number | null>
) {
  if (reconnectTimerRef.current !== null) {
    window.clearTimeout(reconnectTimerRef.current)
    reconnectTimerRef.current = null
  }
}