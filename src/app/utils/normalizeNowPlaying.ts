export interface NormalizedNowPlaying {
  track: string
  artist: string
  artwork: string | null
}

/**
 * Normalize Now Playing metadata from multiple sources:
 * - NowPlayingContext ({ track, artist, artwork })
 * - AudioContext ({ title, artist, artwork })
 * - Defensive against partial / unknown payloads
 */
export function normalizeNowPlaying(
  value: unknown
): NormalizedNowPlaying {
  if (typeof value !== 'object' || value === null) {
    return {
      track: 'Live Radio',
      artist: 'WaveNation',
      artwork: null,
    }
  }

  const record = value as Record<string, unknown>

  // ✅ Accept BOTH `track` and `title`
  const track =
    typeof record.track === 'string'
      ? record.track
      : typeof record.title === 'string'
        ? record.title
        : 'Live Radio'

  const artist =
    typeof record.artist === 'string'
      ? record.artist
      : 'WaveNation'

  const artwork =
    typeof record.artwork === 'string'
      ? record.artwork
      : null

  return { track, artist, artwork }
}
