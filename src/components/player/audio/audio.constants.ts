/**
 * WAVENATION AUDIO ENGINE CONSTANTS
 * Optimized for High-Fidelity Broadcast Streaming
 */

/* ======================================================
   LocalStorage Persistence Keys
====================================================== */
export const LS_VOLUME = 'wn_player_volume'
export const LS_MUTED = 'wn_player_muted'
export const LS_WANTS_PLAY = 'wn_player_wants_play'
export const LS_QUALITY = 'wn_player_quality_pref' // New: HD vs Data Saver

/* ======================================================
   Default State & Preferences
====================================================== */
export const DEFAULT_VOLUME = 0.7
export const DEFAULT_MUTED = false
export const DEFAULT_WANTS_PLAY = true
export const DEFAULT_QUALITY = 'auto' // 'auto' | 'high' | 'low'

/* ======================================================
   Polling & Metadata Sync
====================================================== */
export const NOW_PLAYING_POLL_MS = 15_000
export const SCHEDULE_POLL_MS = 30_000
export const METADATA_RETRY_LIMIT = 3 // Stop hammering API if it fails

/* ======================================================
   Audio Engine: Fading & Transitions
   (Prevents "Clicking" sounds when starting/stopping)
====================================================== */
export const FADE_IN_DEFAULT_MS = 650
export const FADE_OUT_DEFAULT_MS = 800
export const FADE_IN_QUICK_MS = 320

/* ======================================================
   Stream Health & Connectivity
====================================================== */
export const RECONNECT_BASE_MS = 1000
export const RECONNECT_MAX_MS = 30_000
export const RECONNECT_MAX_EXPONENT = 6
export const RECONNECT_JITTER_MS = 500

// Thresholds for the "Weak Signal" UI badge
export const STALL_THRESHOLD_MS = 3500 // Time spent buffering before showing "Signal" error
export const LATENCY_MAX_ALLOWED_SEC = 25 // How far behind 'Live' edge before we force a resync

/* ======================================================
   HLS / Native Engine Configuration
====================================================== */
export const HLS_CONFIG = {
  maxBufferLength: 30,         // seconds
  maxMaxBufferLength: 60,      // seconds
  liveSyncDurationCount: 3,    // Keep 3 segments behind live for stability
  manifestLoadingMaxRetry: 4,
} as const

/* ======================================================
   Media Assets & UI Fallbacks
====================================================== */
export const MEDIA_ARTWORK_FALLBACK = '/images/player/artwork-512.png'
export const MEDIA_TITLE_DEFAULT = 'WaveNation FM'
export const MEDIA_ARTIST_DEFAULT = 'Live Broadcast'

/* ======================================================
   Visual Sync (JS to CSS sync)
====================================================== */
// Match these to the transition durations in your .module.css files
export const UI_TRANSITION_SLOW = 400
export const UI_TRANSITION_FAST = 200
export const SHARE_TOAST_RESET_MS = 2200