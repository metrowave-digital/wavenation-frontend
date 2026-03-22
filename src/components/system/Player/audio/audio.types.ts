export type FlatNowPlaying = {
  title?: string | null
  track?: string | null
  artist?: string | null
  album?: string | null
  artwork?: string | null | { url?: string | null }
  cover?: string | null
  isLive?: boolean | null
}

export type WrappedNowPlaying = {
  nowPlaying?: FlatNowPlaying | null
}

export type AzuraCastNowPlaying = {
  is_online?: boolean
  now_playing?: {
    is_live?: boolean
    song?: {
      title?: string | null
      artist?: string | null
      art?: string | null
    } | null
  } | null
}

export type NowPlayingPayload =
  | FlatNowPlaying
  | WrappedNowPlaying
  | AzuraCastNowPlaying
  | null

export type ExtractedNowPlaying = {
  title: string
  artist: string
  album: string
  artwork: string | null
  isLive: boolean
}

export type ScheduleNowPayload = {
  showTitle?: string | null
  hosts?: string | null
  startTime?: string | null
  endTime?: string | null
  timezone?: string | null
  description?: string | null
  artwork?: string | null
}

export interface RadioScheduleItem {
  title?: string | null
  hosts?: string | null
  startTime?: string | null
  endTime?: string | null
  description?: string | null
  artwork?: string | { url?: string | null } | null
}

export interface AudioState {
  playing: boolean
  isLive: boolean

  muted: boolean
  volume: number

  currentTime: number
  duration: number

  autoplayBlocked: boolean
  showUnmuteToast: boolean
  dismissUnmuteToast: () => void

  nowPlaying: {
    track: string
    artist: string
    artwork: string | null
  }

  isBuffering: boolean
  isReconnecting: boolean
  streamHealthy: boolean
  lastError: string | null
  hasInteracted: boolean

  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
}

export type AppleAutoplayConstraints = {
  isSafari: boolean
  isIOS: boolean
}

export type MediaSessionMetadataArgs = {
  title: string
  artist: string
  album: string
  artworkUrl: string | null
}