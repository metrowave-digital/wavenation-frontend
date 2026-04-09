import {
  DEFAULT_MUTED,
  DEFAULT_VOLUME,
  DEFAULT_WANTS_PLAY,
  DEFAULT_QUALITY,
  LS_MUTED,
  LS_VOLUME,
  LS_WANTS_PLAY,
  LS_QUALITY,
} from './audio.constants'
import { StreamQuality } from './audio.types'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function safeGetLocalStorage(key: string): string | null {
  if (!canUseStorage()) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSetLocalStorage(key: string, value: string) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage errors (e.g., Private Browsing mode)
  }
}

/**
 * Loads the user's saved audio environment on boot.
 */
export function readPersistedAudioSettings() {
  const rawVolume = safeGetLocalStorage(LS_VOLUME)
  const rawMuted = safeGetLocalStorage(LS_MUTED)
  const rawWantsPlay = safeGetLocalStorage(LS_WANTS_PLAY)
  const rawQuality = safeGetLocalStorage(LS_QUALITY)

  const volume =
    rawVolume !== null && !Number.isNaN(Number(rawVolume))
      ? Math.min(1, Math.max(0, Number(rawVolume)))
      : DEFAULT_VOLUME

  const muted = rawMuted === 'true' ? true : DEFAULT_MUTED
  const wantsPlay = rawWantsPlay === null ? DEFAULT_WANTS_PLAY : rawWantsPlay !== 'false'
  const quality = (rawQuality as StreamQuality) || DEFAULT_QUALITY

  return {
    volume,
    muted,
    wantsPlay,
    quality,
  }
}

export function persistVolume(volume: number) {
  const next = Math.min(1, Math.max(0, volume))
  safeSetLocalStorage(LS_VOLUME, String(next))
}

export function persistMuted(muted: boolean) {
  safeSetLocalStorage(LS_MUTED, String(muted))
}

export function persistWantsPlay(wantsPlay: boolean) {
  safeSetLocalStorage(LS_WANTS_PLAY, String(wantsPlay))
}

export function persistQuality(quality: StreamQuality) {
  safeSetLocalStorage(LS_QUALITY, quality)
}