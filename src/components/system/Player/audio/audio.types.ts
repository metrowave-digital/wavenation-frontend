/**
 * WAVENATION AUDIO TYPES
 * Strictly typed for broadcast reliability
 */

/* ======================================================
   Shared Utility Types
====================================================== */

/**
 * Unified Artwork structure to handle CMS (object) vs Direct (string) sources
 */
export type MediaArtwork = string | { url?: string | null } | null;

export type StreamQuality = 'auto' | 'high' | 'low';

/* ======================================================
   Metadata: Incoming Payloads (Raw)
====================================================== */

export type FlatNowPlaying = {
  title?: string | null;
  track?: string | null;
  artist?: string | null;
  album?: string | null;
  artwork?: MediaArtwork;
  cover?: string | null;
  isLive?: boolean | null;
}

export type WrappedNowPlaying = {
  nowPlaying?: FlatNowPlaying | null;
}

export type AzuraCastNowPlaying = {
  is_online?: boolean;
  now_playing?: {
    is_live?: boolean;
    song?: {
      title?: string | null;
      artist?: string | null;
      art?: string | null;
    } | null;
  } | null;
}

export type NowPlayingPayload =
  | FlatNowPlaying
  | WrappedNowPlaying
  | AzuraCastNowPlaying
  | null;

/* ======================================================
   Metadata: Internal Use (Cleaned)
====================================================== */

export interface PlaybackMetadata {
  track: string;
  artist: string;
  album: string;
  artwork: string | null;
  isLive: boolean;
}

export interface RadioShowMeta {
  title: string;
  hosts: string | null;
  startTime: string | null;
  endTime: string | null;
  description: string | null;
  artwork: string | null;
}

/* ======================================================
   Audio Engine State
====================================================== */

export interface AudioState {
  // Core Playback
  playing: boolean;
  isLive: boolean;
  currentTime: number;
  duration: number;
  
  // Volume Control
  muted: boolean;
  volume: number;
  
  // Autoplay & Interaction
  autoplayBlocked: boolean;
  showUnmuteToast: boolean;
  hasInteracted: boolean;

  // Metadata
  nowPlaying: PlaybackMetadata;
  currentShow: RadioShowMeta | null;
  
  // Connectivity & Health
  status: 'idle' | 'playing' | 'buffering' | 'stalled' | 'reconnecting' | 'error';
  isBuffering: boolean;
  isReconnecting: boolean;
  streamHealthy: boolean;
  quality: StreamQuality;
  lastError: string | null;

  // Actions
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setQuality: (q: StreamQuality) => void;
  dismissUnmuteToast: () => void;
}

/* ======================================================
   Platform Specifics
====================================================== */

export type AppleAutoplayConstraints = {
  isSafari: boolean;
  isIOS: boolean;
}

export type MediaSessionMetadataArgs = {
  title: string;
  artist: string;
  album: string;
  artworkUrl: string | null;
}

/* ... keep other types ... */

/**
 * RAW Schedule Item from CMS/API
 */
export interface RadioScheduleItem {
  title?: string | null;
  hosts?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  description?: string | null;
  artwork?: MediaArtwork; // Uses the helper we created earlier
}

/**
 * CLEANED Show Metadata for UI
 */
export interface RadioShowMeta {
  title: string;
  hosts: string | null;
  startTime: string | null;
  endTime: string | null;
  description: string | null;
  artwork: string | null;
}

/* ... keep other types ... */