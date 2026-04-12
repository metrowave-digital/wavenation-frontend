import type {
  AzuraCastNowPlaying,
  PlaybackMetadata, // Fix: Updated from ExtractedNowPlaying
  FlatNowPlaying,
  NowPlayingPayload,
  WrappedNowPlaying,
} from './audio.types'

/**
 * Ensures artwork is always a string URL or null.
 * Handles both direct strings and CMS-style object nested URLs.
 */
export function normalizeArtworkUrl(
  artwork: string | { url?: string | null } | null | undefined
): string | null {
  if (!artwork) return null
  if (typeof artwork === 'string') return artwork.trim() || null
  if (typeof artwork === 'object' && artwork.url) return artwork.url.trim() || null
  return null
}

/**
 * Type Guard: Check if payload is Wrapped (e.g., { nowPlaying: { ... } })
 */
export function hasWrappedNowPlaying(
  payload: NowPlayingPayload
): payload is WrappedNowPlaying {
  return typeof payload === 'object' && payload !== null && 'nowPlaying' in payload
}

/**
 * Type Guard: Check if payload is from an AzuraCast API
 */
export function hasAzuraCastNowPlaying(
  payload: NowPlayingPayload
): payload is AzuraCastNowPlaying {
  return typeof payload === 'object' && payload !== null && 'now_playing' in payload
}

/**
 * The Central Normalizer.
 * Converts various messy API payloads into a clean PlaybackMetadata object.
 */
export function extractNowPlaying(payload: NowPlayingPayload): PlaybackMetadata {
  // 1. Setup Defaults
  const defaults: PlaybackMetadata = {
    track: 'WaveNation FM',
    artist: 'Live Broadcast',
    album: '',
    artwork: null,
    isLive: true, // Default to true for a radio app
  }

  if (!payload) return defaults

  // 2. Handle Wrapped Payloads
  if (hasWrappedNowPlaying(payload)) {
    const np = payload.nowPlaying
    if (!np) return defaults

    return {
      track: (np.title ?? np.track ?? defaults.track).trim(),
      artist: (np.artist ?? defaults.artist).trim(),
      album: (np.album ?? '').trim(),
      artwork: normalizeArtworkUrl(np.artwork) ?? normalizeArtworkUrl(np.cover),
      isLive: np.isLive ?? true,
    }
  }

  // 3. Handle AzuraCast Payloads
  if (hasAzuraCastNowPlaying(payload)) {
    const song = payload.now_playing?.song
    return {
      track: (song?.title ?? defaults.track).trim(),
      artist: (song?.artist ?? defaults.artist).trim(),
      album: '', // AzuraCast usually doesn't provide album at top-level
      artwork: normalizeArtworkUrl(song?.art),
      isLive: Boolean(payload.is_online) && Boolean(payload.now_playing?.is_live),
    }
  }

  // 4. Handle Flat Payloads (Default Case)
  const flat = payload as FlatNowPlaying
  return {
    track: (flat.title ?? flat.track ?? defaults.track).trim(),
    artist: (flat.artist ?? defaults.artist).trim(),
    album: (flat.album ?? '').trim(),
    artwork: normalizeArtworkUrl(flat.artwork) ?? normalizeArtworkUrl(flat.cover),
    isLive: flat.isLive ?? true,
  }
}

/**
 * Checks if the song has actually changed to prevent 
 * redundant UI updates or Re-renders.
 */
export function hasNowPlayingChanged(
  prev: PlaybackMetadata | null,
  next: PlaybackMetadata | null
): boolean {
  if (!prev || !next) return prev !== next
  
  return (
    prev.track !== next.track ||
    prev.artist !== next.artist ||
    prev.artwork !== next.artwork ||
    prev.isLive !== next.isLive
  )
}