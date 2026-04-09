import { MEDIA_ARTWORK_FALLBACK, MEDIA_TITLE_DEFAULT } from './audio.constants'
import type {
  MediaSessionMetadataArgs,
  RadioShowMeta, // Fix: Updated to match new exported type
} from './audio.types'

/**
 * Checks if the browser supports the Media Session API.
 */
export function supportsMediaSession(): boolean {
  return typeof navigator !== 'undefined' && 'mediaSession' in navigator
}

/**
 * Safely sets an action handler.
 */
export function safeSetActionHandler(
  action: MediaSessionAction,
  handler: MediaSessionActionHandler | null
) {
  if (!supportsMediaSession()) return

  try {
    navigator.mediaSession.setActionHandler(action, handler)
  } catch {
    // Fix: Removed 'err' to satisfy ESLint
  }
}

/**
 * Updates OS-level metadata (Lock screen, dynamic island).
 */
export function setMediaSessionMetadata({
  title,
  artist,
  album,
  artworkUrl,
}: MediaSessionMetadataArgs) {
  if (!supportsMediaSession()) return
  if (typeof window === 'undefined' || typeof MediaMetadata === 'undefined') return

  const src = artworkUrl || MEDIA_ARTWORK_FALLBACK

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || MEDIA_TITLE_DEFAULT,
      artist: artist || 'WaveNation FM',
      album: album || 'Live Broadcast',
      artwork: [
        { src, sizes: '96x96', type: 'image/png' },
        { src, sizes: '192x192', type: 'image/png' },
        { src, sizes: '512x512', type: 'image/png' },
      ],
    })
  } catch {
    // Fix: Removed unused 'err'
  }
}

/**
 * Updates 'playing' vs 'paused' status.
 */
export function setMediaSessionPlaybackState(
  state: MediaSessionPlaybackState
) {
  if (!supportsMediaSession()) return

  try {
    navigator.mediaSession.playbackState = state
  } catch {
    // Fix: Removed unused 'err'
  }
}

/**
 * Updates the progress bar for non-live content.
 */
export function updatePositionState(
  duration: number,
  playbackRate: number,
  position: number
) {
  if (!supportsMediaSession() || !navigator.mediaSession.setPositionState) return
  if (!Number.isFinite(duration) || duration <= 0) return

  try {
    navigator.mediaSession.setPositionState({
      duration: Math.max(0, duration),
      playbackRate: playbackRate || 1.0,
      position: Math.max(0, position),
    })
  } catch {
    // Fix: Removed unused 'err'
  }
}

/**
 * Clears the session.
 */
export function clearMediaSession() {
  if (!supportsMediaSession()) return
  navigator.mediaSession.metadata = null
  navigator.mediaSession.playbackState = 'none'
}

/* ======================================================
   LOCKSCREEN DISPLAY HELPERS
====================================================== */

export function formatTimeForLockscreen(value?: string | null): string | null {
  if (!value) return null

  if (/\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  if (/^\d{1,2}:\d{2}$/.test(value)) return value

  return null
}

export function buildShowLine(show: RadioShowMeta | null): string | null {
  if (!show) return null

  // Fix: Adjusted property names to match RadioShowMeta (title instead of showTitle)
  const title = (show.title ?? '').trim()
  const start = formatTimeForLockscreen(show.startTime)
  const end = formatTimeForLockscreen(show.endTime)

  const timeLabel =
    start && end ? `${start}–${end}` : start ? `from ${start}` : null

  if (title && timeLabel) return `${title} [${timeLabel}]`
  if (title) return title
  
  return null
}

/**
 * Creates a cinematic "Album" field for the lockscreen.
 */
export function buildMediaSessionAlbumLine(args: {
  show: RadioShowMeta | null
  isLive: boolean
  fallback?: string
}): string {
  const { show, isLive, fallback = 'WaveNation FM' } = args

  const showLine = buildShowLine(show)
  const base = showLine || fallback

  return isLive ? `${base} • LIVE` : base
}