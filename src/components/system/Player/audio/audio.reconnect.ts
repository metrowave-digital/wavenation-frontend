import {
  RECONNECT_BASE_MS,
  RECONNECT_JITTER_MS,
  RECONNECT_MAX_EXPONENT,
  RECONNECT_MAX_MS,
} from './audio.constants'

export function computeReconnectBackoffMs(attempt: number): number {
  const safeAttempt = Math.max(0, attempt)
  const base =
    RECONNECT_BASE_MS *
    Math.pow(2, Math.min(RECONNECT_MAX_EXPONENT, safeAttempt))
  const jitter = Math.floor(Math.random() * RECONNECT_JITTER_MS)

  return Math.min(RECONNECT_MAX_MS, base + jitter)
}

export function buildReloadedStreamUrl(streamUrl: string): string {
  const sep = streamUrl.includes('?') ? '&' : '?'
  return `${streamUrl}${sep}t=${Date.now()}`
}

export function hardReloadStreamSrc(
  audio: HTMLAudioElement,
  streamUrl: string
): string {
  const nextSrc = buildReloadedStreamUrl(streamUrl)

  try {
    audio.src = nextSrc
    audio.load()
  } catch {
    // ignore hard reload errors
  }

  return nextSrc
}

export function clearReconnectTimer(
  reconnectTimerRef: React.MutableRefObject<number | null>
) {
  if (reconnectTimerRef.current != null) {
    window.clearTimeout(reconnectTimerRef.current)
    reconnectTimerRef.current = null
  }
}