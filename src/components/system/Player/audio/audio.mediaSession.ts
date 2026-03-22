import { MEDIA_ARTWORK_FALLBACK } from './audio.constants'
import type {
  MediaSessionMetadataArgs,
  ScheduleNowPayload,
} from './audio.types'

export function supportsMediaSession(): boolean {
  return typeof navigator !== 'undefined' && 'mediaSession' in navigator
}

export function safeSetActionHandler(
  action: MediaSessionAction,
  handler: MediaSessionActionHandler | null
) {
  if (!supportsMediaSession()) return

  try {
    navigator.mediaSession.setActionHandler(action, handler)
  } catch {
    // Some browsers throw for unsupported actions.
  }
}

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
      title,
      artist,
      album,
      artwork: [
        { src, sizes: '96x96', type: 'image/png' },
        { src, sizes: '128x128', type: 'image/png' },
        { src, sizes: '192x192', type: 'image/png' },
        { src, sizes: '256x256', type: 'image/png' },
        { src, sizes: '512x512', type: 'image/png' },
      ],
    })
  } catch {
    // Fail silently on browsers with partial Media Session support.
  }
}

export function setMediaSessionPlaybackState(
  state: MediaSessionPlaybackState
) {
  if (!supportsMediaSession()) return

  try {
    navigator.mediaSession.playbackState = state
  } catch {
    // Ignore unsupported playback state writes.
  }
}

/* ======================================================
   LOCKSCREEN SHOW / TIME HELPERS
====================================================== */

export function isISODateString(value: string): boolean {
  return /\d{4}-\d{2}-\d{2}T/.test(value)
}

export function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`
}

export function formatTimeForLockscreen(value?: string | null): string | null {
  if (!value) return null

  // Accept HH:mm directly
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    return value
  }

  // Accept ISO string
  if (isISODateString(value)) {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return null
    }

    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
  }

  return null
}

export function buildShowLine(show: ScheduleNowPayload | null): string | null {
  if (!show) return null

  const title = (show.showTitle ?? '').trim()
  const start = formatTimeForLockscreen(show.startTime)
  const end = formatTimeForLockscreen(show.endTime)

  const timeLabel =
    start && end ? `${start}–${end}` : start ? `from ${start}` : null

  if (title && timeLabel) return `${title} • ${timeLabel}`
  if (title) return title
  if (timeLabel) return timeLabel

  return null
}

export function buildMediaSessionAlbumLine(args: {
  show: ScheduleNowPayload | null
  playing: boolean
  fallback?: string
}): string {
  const { show, playing, fallback = 'Live Radio' } = args

  const showLine = buildShowLine(show)
  const base = showLine || fallback

  return playing ? `${base} • LIVE` : `${base} • Paused`
}