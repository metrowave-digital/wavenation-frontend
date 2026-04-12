import { PlaybackMetadata } from './audio.types'

/**
 * Updates the browser tab title to show the current song.
 */
export function formatDocumentTitle(nowPlaying: PlaybackMetadata): string {
  if (!nowPlaying.track || nowPlaying.track === 'WaveNation FM') {
    return 'WaveNation FM | Live'
  }
  return `${nowPlaying.track} - ${nowPlaying.artist} | WaveNation FM`
}

/**
 * Translates various audio engine booleans into a single status string.
 */
// src/components/system/Player/audio/audio.helpers.ts

export function getPlaybackStatus(
  playing: boolean,
  buffering: boolean,
  reconnecting: boolean,
  error: string | null
): 'error' | 'playing' | 'stalled' | 'buffering' | 'reconnecting' | 'idle' {
  if (error) return 'error';
  if (reconnecting) return 'reconnecting';
  if (buffering) return 'buffering';
  if (playing) return 'playing';
  return 'idle'; // Radio apps use 'idle' instead of 'paused' for state types
}
/**
 * Calculates a 0-100 percentage for progress bars.
 */
export function calculateProgress(current: number, duration: number): number {
  if (!duration || duration === Infinity) return 0
  return Math.min(100, Math.max(0, (current / duration) * 100))
}