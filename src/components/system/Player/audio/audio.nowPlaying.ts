import type {
  AzuraCastNowPlaying,
  ExtractedNowPlaying,
  FlatNowPlaying,
  NowPlayingPayload,
  WrappedNowPlaying,
} from './audio.types'

export function normalizeArtworkUrl(
  artwork: string | { url?: string | null } | null | undefined
): string | null {
  if (!artwork) return null
  if (typeof artwork === 'string') return artwork
  if (typeof artwork === 'object' && artwork.url) return artwork.url
  return null
}

export function hasWrappedNowPlaying(
  payload: NowPlayingPayload
): payload is WrappedNowPlaying {
  return typeof payload === 'object' && payload !== null && 'nowPlaying' in payload
}

export function hasAzuraCastNowPlaying(
  payload: NowPlayingPayload
): payload is AzuraCastNowPlaying {
  return typeof payload === 'object' && payload !== null && 'now_playing' in payload
}

export function extractNowPlaying(payload: NowPlayingPayload): ExtractedNowPlaying {
  let title = ''
  let artist = ''
  let album = ''
  let artwork: string | null = null
  let isLive = false

  if (!payload) {
    return { title, artist, album, artwork, isLive }
  }

  if (hasWrappedNowPlaying(payload)) {
    const np = payload.nowPlaying

    if (!np) {
      return { title, artist, album, artwork, isLive }
    }

    title = (np.title ?? np.track ?? '').trim()
    artist = (np.artist ?? '').trim()
    album = (np.album ?? '').trim()
    artwork = normalizeArtworkUrl(np.artwork) ?? normalizeArtworkUrl(np.cover)
    isLive = Boolean(np.isLive)

    return { title, artist, album, artwork, isLive }
  }

  if (hasAzuraCastNowPlaying(payload)) {
    const song = payload.now_playing?.song

    if (song) {
      title = (song.title ?? '').trim()
      artist = (song.artist ?? '').trim()
      artwork = normalizeArtworkUrl(song.art)
    }

    isLive = Boolean(payload.is_online) && Boolean(payload.now_playing?.is_live)

    return { title, artist, album, artwork, isLive }
  }

  const flatPayload = payload as FlatNowPlaying

  title = (flatPayload.title ?? flatPayload.track ?? '').trim()
  artist = (flatPayload.artist ?? '').trim()
  album = (flatPayload.album ?? '').trim()
  artwork =
    normalizeArtworkUrl(flatPayload.artwork) ?? normalizeArtworkUrl(flatPayload.cover)
  isLive = Boolean(flatPayload.isLive)

  return { title, artist, album, artwork, isLive }
}

export function hasNowPlayingChanged(
  prev: ExtractedNowPlaying,
  next: ExtractedNowPlaying
): boolean {
  return (
    prev.title !== next.title ||
    prev.artist !== next.artist ||
    prev.album !== next.album ||
    prev.artwork !== next.artwork ||
    prev.isLive !== next.isLive
  )
}