'use client'

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { trackEvent } from '@/lib/analytics'

import { AudioContext } from './AudioContext'
import {
  DEFAULT_MUTED,
  DEFAULT_VOLUME,
  DEFAULT_WANTS_PLAY,
  FADE_IN_DEFAULT_MS,
  FADE_IN_QUICK_MS,
  LS_MUTED,
  LS_VOLUME,
} from './audio.constants'
import { detectAppleAutoplayConstraints } from './audio.detect'
import { createFadeController } from './audio.fade'
import {
  buildMediaSessionAlbumLine,
  safeSetActionHandler,
  setMediaSessionMetadata,
  setMediaSessionPlaybackState,
  supportsMediaSession,
} from './audio.mediaSession'
import {
  clearReconnectTimer,
  computeReconnectBackoffMs,
  hardReloadStreamSrc,
} from './audio.reconnect'
import {
  readPersistedAudioSettings,
  persistMuted,
  persistVolume,
  persistWantsPlay,
} from './audio.storage'
import type {
  AudioState,
  ExtractedNowPlaying,
  ScheduleNowPayload,
} from './audio.types'
import { useAudioElement } from './useAudioElement'
import { useNowPlayingPoller } from './useNowPlayingPoller'
import { useSchedulePoller } from './useSchedulePoller'

type AudioProviderProps = {
  streamUrl: string
  children: React.ReactNode
  nowPlayingUrl?: string
  scheduleUrl?: string
}

const DEFAULT_NOW_PLAYING: ExtractedNowPlaying = {
  title: 'WaveNation Live',
  artist: 'WaveNation FM',
  album: 'Live Radio',
  artwork: null,
  isLive: true,
}

export function AudioProvider({
  streamUrl,
  children,
  nowPlayingUrl = '/api/now-playing',
  scheduleUrl = '/api/radioSchedule/now',
}: AudioProviderProps) {
  const fadeRafRef = useRef<number | null>(null)
  const reconnectTimerRef = useRef<number | null>(null)
  const reconnectAttemptRef = useRef(0)
  const lastSrcRef = useRef<string | null>(null)
  const wantsPlayRef = useRef<boolean>(DEFAULT_WANTS_PLAY)

  const { isSafari, isIOS } = useMemo(() => detectAppleAutoplayConstraints(), [])
  const fade = useMemo(() => createFadeController(fadeRafRef), [])

  // Hydration-safe defaults
  const [volume, setVolumeState] = useState<number>(DEFAULT_VOLUME)
  const [muted, setMuted] = useState<boolean>(DEFAULT_MUTED)
  const [hasHydratedSettings, setHasHydratedSettings] = useState(false)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [showUnmuteToast, setShowUnmuteToast] = useState(false)

  const [npTitle, setNpTitle] = useState(DEFAULT_NOW_PLAYING.title)
  const [npArtist, setNpArtist] = useState(DEFAULT_NOW_PLAYING.artist)
  const [npAlbum, setNpAlbum] = useState(DEFAULT_NOW_PLAYING.album)
  const [npArtwork, setNpArtwork] = useState<string | null>(DEFAULT_NOW_PLAYING.artwork)

  const [nowShow, setNowShow] = useState<ScheduleNowPayload | null>(null)

  const [isBuffering, setIsBuffering] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [streamHealthy, setStreamHealthy] = useState(true)
  const [lastError, setLastError] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const isLive = true

  const markUserInteracted = useCallback(() => {
    setHasInteracted(true)
  }, [])

  const setWantsPlay = useCallback((next: boolean) => {
    wantsPlayRef.current = next
    persistWantsPlay(next)
  }, [])

  const onTimeUpdate = useCallback((audio: HTMLAudioElement) => {
    setCurrentTime(audio.currentTime)
  }, [])

  const onLoadedMetadata = useCallback((audio: HTMLAudioElement) => {
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
  }, [])

  const onPlaying = useCallback(() => {
    setPlaying(true)
    setIsBuffering(false)
    setIsReconnecting(false)
    setStreamHealthy(true)
    setLastError(null)
    setMediaSessionPlaybackState('playing')
    reconnectAttemptRef.current = 0
    clearReconnectTimer(reconnectTimerRef)
  }, [])

  const onPause = useCallback(() => {
    setPlaying(false)
    setMediaSessionPlaybackState('paused')
  }, [])

  const onLoadStart = useCallback(() => {
    setIsBuffering(true)
  }, [])

  const scheduleReconnect = useCallback(
    (reason: string, audio?: HTMLAudioElement | null) => {
      if (!wantsPlayRef.current) return

      const activeAudio = audio
      if (!activeAudio) return

      clearReconnectTimer(reconnectTimerRef)

      const attempt = reconnectAttemptRef.current
      const wait = computeReconnectBackoffMs(attempt)

      reconnectAttemptRef.current = attempt + 1
      setIsReconnecting(true)
      setStreamHealthy(false)
      setLastError(`reconnect_${reason}`)

      trackEvent('player_reconnect_scheduled', {
        reason,
        attempt: reconnectAttemptRef.current,
        waitMs: wait,
        placement: 'sticky_player',
        live: true,
      })

      reconnectTimerRef.current = window.setTimeout(() => {
        const latestAudio = activeAudio
        if (!latestAudio) return

        if (!latestAudio.paused) {
          reconnectAttemptRef.current = 0
          clearReconnectTimer(reconnectTimerRef)
          setIsReconnecting(false)
          setStreamHealthy(true)
          setLastError(null)
          return
        }

        lastSrcRef.current = hardReloadStreamSrc(latestAudio, streamUrl)

        latestAudio
          .play()
          .then(() => {
            reconnectAttemptRef.current = 0
            clearReconnectTimer(reconnectTimerRef)
            setIsReconnecting(false)
            setStreamHealthy(true)
            setIsBuffering(false)
            setLastError(null)

            trackEvent('player_reconnect_success', {
              placement: 'sticky_player',
              live: true,
            })
          })
          .catch(() => {
            setAutoplayBlocked(true)
            setShowUnmuteToast(true)
            setIsReconnecting(true)
            setStreamHealthy(false)
            setLastError('player_reconnect_failed')

            trackEvent('player_reconnect_failed', {
              placement: 'sticky_player',
              live: true,
            })

            scheduleReconnect('retry', latestAudio)
          })
      }, wait)
    },
    [streamUrl]
  )

  const { audioRef, ensureAudio, destroyAudio } = useAudioElement({
    streamUrl,
    volume,
    muted,
    onTimeUpdate,
    onLoadedMetadata,
    onPlaying,
    onPause,
    onLoadStart,
    onWaiting: () => {
      setIsBuffering(true)
      setStreamHealthy(false)
      setLastError('stream_waiting')
      scheduleReconnect('waiting', audioRef.current)
    },
    onCanPlay: () => {
      setIsBuffering(false)
      setStreamHealthy(true)
    },
    onStalled: () => {
      setIsBuffering(true)
      setStreamHealthy(false)
      setLastError('stream_stalled')
      scheduleReconnect('stalled', audioRef.current)
    },
    onError: () => {
      setIsBuffering(false)
      setStreamHealthy(false)
      setLastError('audio_error')
      scheduleReconnect('error', audioRef.current)
    },
    onEnded: () => {
      setStreamHealthy(false)
      setLastError('stream_ended')
      scheduleReconnect('ended', audioRef.current)
    },
  })

  // Hydrate persisted settings AFTER mount
  useEffect(() => {
    const persisted = readPersistedAudioSettings()

    setVolumeState(persisted.volume)
    setMuted(persisted.muted)
    wantsPlayRef.current = persisted.wantsPlay
    setHasHydratedSettings(true)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage) return
      if (e.key !== LS_VOLUME && e.key !== LS_MUTED) return

      if (e.key === LS_VOLUME) {
        const raw = e.newValue
        if (raw == null) return

        const nextVolume = Number(raw)
        if (Number.isNaN(nextVolume)) return

        const safeVolume = Math.min(1, Math.max(0, nextVolume))
        setVolumeState(safeVolume)

        const audio = audioRef.current
        if (audio) {
          audio.volume = safeVolume
          if (safeVolume === 0) audio.muted = true
        }
      }

      if (e.key === LS_MUTED) {
        const nextMuted = e.newValue === 'true'
        setMuted(nextMuted)

        const audio = audioRef.current
        if (audio) {
          audio.muted = nextMuted
        }
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [audioRef])

  useEffect(() => {
    const onOnline = () => {
      if (!wantsPlayRef.current) return

      const audio = audioRef.current
      if (!audio) return
      if (!audio.paused) return

      trackEvent('player_online_reconnect', {
        placement: 'sticky_player',
        live: true,
      })

      scheduleReconnect('online', audio)
    }

    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [audioRef, scheduleReconnect])

  useNowPlayingPoller({
    nowPlayingUrl,
    fallback: DEFAULT_NOW_PLAYING,
    onChange: (next) => {
      setNpTitle(next.title)
      setNpArtist(next.artist)
      setNpAlbum(next.album)
      setNpArtwork(next.artwork)
    },
    onError: (message) => {
      if (message) {
        setLastError((prev) => prev ?? message)
      }
    },
  })

  useSchedulePoller({
    scheduleUrl,
    onChange: setNowShow,
    onError: (message) => {
      if (message) {
        setLastError((prev) => prev ?? message)
      }
    },
  })

  useEffect(() => {
    if (!supportsMediaSession()) return

    const title = (npTitle || DEFAULT_NOW_PLAYING.title).trim()
    const artist = (npArtist || nowShow?.hosts || DEFAULT_NOW_PLAYING.artist).trim()
    const album = buildMediaSessionAlbumLine({
      show: nowShow,
      playing,
      fallback: npAlbum || DEFAULT_NOW_PLAYING.album,
    })
    const artworkUrl = npArtwork || nowShow?.artwork || null

    setMediaSessionMetadata({
      title,
      artist,
      album,
      artworkUrl,
    })
  }, [nowShow, npAlbum, npArtist, npArtwork, npTitle, playing])

  // Only attempt autoplay once persisted settings are hydrated
  useEffect(() => {
    if (!hasHydratedSettings) return
    if (!wantsPlayRef.current) return

    const audio = ensureAudio()
    if (!audio.paused) return

    const preferMuted = isSafari || isIOS

    const attemptAutoplay = async () => {
      try {
        if (!preferMuted) {
          audio.muted = false
          audio.volume = muted ? 0 : volume
          await audio.play()

          trackEvent('player_play', {
            source: 'autoplay_audible',
            placement: 'sticky_player',
            live: true,
          })
          return
        }

        throw new Error('force-muted')
      } catch {
        try {
          audio.muted = true
          audio.volume = 0

          setMuted(true)
          persistMuted(true)

          await audio.play()

          setAutoplayBlocked(true)
          setShowUnmuteToast(true)
          setLastError('autoplay_muted_fallback')

          trackEvent('player_play', {
            source: 'autoplay_muted_fallback',
            placement: 'sticky_player',
            live: true,
          })
        } catch {
          setAutoplayBlocked(true)
          setShowUnmuteToast(true)
          setStreamHealthy(false)
          setLastError('player_play_failed')

          trackEvent('player_play_failed', {
            placement: 'sticky_player',
            live: true,
          })
        }
      }
    }

    void attemptAutoplay()
  }, [ensureAudio, hasHydratedSettings, isIOS, isSafari, muted, volume])

  useEffect(() => {
    if (!autoplayBlocked) return

    const unlock = () => {
      const audio = audioRef.current
      if (!audio) return

      markUserInteracted()
      setWantsPlay(true)

      audio
        .play()
        .then(() => {
          setAutoplayBlocked(false)
          setShowUnmuteToast(false)
          setLastError(null)
          setStreamHealthy(true)

          fade.fadeInTo(audio, volume, FADE_IN_DEFAULT_MS)

          trackEvent('player_play', {
            source: 'unlock_fadein',
            placement: 'sticky_player',
            live: true,
          })
        })
        .catch(() => {
          setAutoplayBlocked(true)
          setShowUnmuteToast(true)
          setStreamHealthy(false)
          setLastError('unlock_play_failed')
        })
    }

    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [audioRef, autoplayBlocked, fade, markUserInteracted, setWantsPlay, volume])

  const play = useCallback(async () => {
    const audio = ensureAudio()

    try {
      markUserInteracted()
      setWantsPlay(true)

      audio.muted = false
      setMuted(false)
      persistMuted(false)

      if (audio.paused && audio.src) {
        lastSrcRef.current = hardReloadStreamSrc(audio, streamUrl)
      }

      await audio.play()

      setAutoplayBlocked(false)
      setShowUnmuteToast(false)
      setStreamHealthy(true)
      setLastError(null)

      fade.fadeInTo(audio, volume, FADE_IN_QUICK_MS)

      trackEvent('player_play', {
        placement: 'sticky_player',
        live: true,
      })
    } catch {
      setAutoplayBlocked(true)
      setShowUnmuteToast(true)
      setStreamHealthy(false)
      setLastError('player_play_failed')

      trackEvent('player_play_failed', {
        placement: 'sticky_player',
        live: true,
      })
    }
  }, [ensureAudio, fade, markUserInteracted, setWantsPlay, streamUrl, volume])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    fade.stop()
    audio.pause()

    setCurrentTime(0)
    setDuration(0)
    setIsBuffering(false)
    setWantsPlay(false)
    setMediaSessionPlaybackState('paused')

    trackEvent('player_pause', {
      placement: 'sticky_player',
      live: true,
      behavior: 'leave_live',
    })
  }, [audioRef, fade, setWantsPlay])

  useEffect(() => {
    if (!supportsMediaSession()) return

    safeSetActionHandler('play', () => {
      trackEvent('media_session_play', {
        source: 'lockscreen',
        placement: 'sticky_player',
        live: true,
      })
      void play()
    })

    safeSetActionHandler('pause', () => {
      trackEvent('media_session_pause', {
        source: 'lockscreen',
        placement: 'sticky_player',
        live: true,
      })
      pause()
    })

    safeSetActionHandler('stop', () => {
      trackEvent('media_session_stop', {
        source: 'lockscreen',
        placement: 'sticky_player',
        live: true,
      })
      pause()
    })

    safeSetActionHandler('seekto', null)
    safeSetActionHandler('seekbackward', null)
    safeSetActionHandler('seekforward', null)

    return () => {
      safeSetActionHandler('play', null)
      safeSetActionHandler('pause', null)
      safeSetActionHandler('stop', null)
    }
  }, [pause, play])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return

    audio.currentTime = time
    setCurrentTime(time)
  }, [audioRef])

  const setVolume = useCallback(
    (v: number) => {
      const nextVolume = Math.min(1, Math.max(0, v))
      const audio = ensureAudio()

      markUserInteracted()
      fade.stop()

      audio.volume = nextVolume
      audio.muted = nextVolume === 0

      setVolumeState(nextVolume)
      setMuted(nextVolume === 0)

      persistVolume(nextVolume)
      persistMuted(nextVolume === 0)

      trackEvent('volume_change', {
        volume: Math.round(nextVolume * 100),
        placement: 'sticky_player',
      })
    },
    [ensureAudio, fade, markUserInteracted]
  )

  const toggleMute = useCallback(() => {
    const audio = ensureAudio()

    markUserInteracted()
    fade.stop()

    const nextMuted = !audio.muted
    audio.muted = nextMuted

    setMuted(nextMuted)
    persistMuted(nextMuted)

    if (!nextMuted && playing) {
      fade.fadeInTo(audio, volume, FADE_IN_QUICK_MS)
    }

    trackEvent('mute_toggle', {
      muted: nextMuted,
      placement: 'sticky_player',
    })
  }, [ensureAudio, fade, markUserInteracted, playing, volume])

  const dismissUnmuteToast = useCallback(() => {
    setShowUnmuteToast(false)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = muted
  }, [audioRef, muted, volume])

  useEffect(() => {
    return () => {
      fade.stop()
      clearReconnectTimer(reconnectTimerRef)
      destroyAudio()
    }
  }, [destroyAudio, fade])

  const value = useMemo<AudioState>(
    () => ({
      playing,
      isLive,
      muted,
      volume,
      currentTime,
      duration,
      autoplayBlocked,
      showUnmuteToast,
      dismissUnmuteToast,
      nowPlaying: {
        track: npTitle,
        artist: npArtist,
        artwork: npArtwork,
      },
      isBuffering,
      isReconnecting,
      streamHealthy,
      lastError,
      hasInteracted,
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
    }),
    [
      autoplayBlocked,
      currentTime,
      dismissUnmuteToast,
      duration,
      hasInteracted,
      isBuffering,
      isLive,
      isReconnecting,
      lastError,
      muted,
      npArtist,
      npArtwork,
      npTitle,
      pause,
      play,
      playing,
      seek,
      setVolume,
      showUnmuteToast,
      streamHealthy,
      toggleMute,
      volume,
    ]
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}