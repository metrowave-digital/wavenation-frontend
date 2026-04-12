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
  FADE_IN_QUICK_MS,
  FADE_IN_DEFAULT_MS,
  LS_MUTED,
  LS_VOLUME,
  MEDIA_TITLE_DEFAULT,
  MEDIA_ARTIST_DEFAULT,
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
  persistQuality,
} from './audio.storage'
import { getPlaybackStatus } from './audio.helpers'
import type {
  AudioState,
  PlaybackMetadata,
  RadioShowMeta,
  StreamQuality,
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

const INITIAL_METADATA: PlaybackMetadata = {
  track: MEDIA_TITLE_DEFAULT,
  artist: MEDIA_ARTIST_DEFAULT,
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
  const wantsPlayRef = useRef<boolean>(DEFAULT_WANTS_PLAY)

  const { isSafari, isIOS } = useMemo(() => detectAppleAutoplayConstraints(), [])
  const fade = useMemo(() => createFadeController(fadeRafRef), [])

  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState<number>(DEFAULT_VOLUME)
  const [muted, setMuted] = useState<boolean>(DEFAULT_MUTED)
  const [quality, setQualityState] = useState<StreamQuality>('auto')
  const [hasHydratedSettings, setHasHydratedSettings] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [nowPlaying, setNowPlaying] = useState<PlaybackMetadata>(INITIAL_METADATA)
  const [currentShow, setCurrentShow] = useState<RadioShowMeta | null>(null)

  const [isBuffering, setIsBuffering] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [streamHealthy, setStreamHealthy] = useState(true)
  const [lastError, setLastError] = useState<string | null>(null)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [showUnmuteToast, setShowUnmuteToast] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const scheduleReconnect = useCallback(function reconnect(
    reason: string, 
    audio?: HTMLAudioElement | null
  ) {
    if (!wantsPlayRef.current || !audio) return

    clearReconnectTimer(reconnectTimerRef)
    const wait = computeReconnectBackoffMs(reconnectAttemptRef.current)
    reconnectAttemptRef.current++

    setIsReconnecting(true)
    setStreamHealthy(false)
    setLastError(`reconnect_${reason}`)

    reconnectTimerRef.current = window.setTimeout(() => {
      if (!audio.paused) {
        reconnectAttemptRef.current = 0
        setIsReconnecting(false)
        setStreamHealthy(true)
        return
      }

      hardReloadStreamSrc(audio, streamUrl)
      audio.play().catch(() => {
        setAutoplayBlocked(true)
        setShowUnmuteToast(true)
        reconnect('retry', audio)
      })
    }, wait)
  }, [streamUrl])

  const { audioRef, ensureAudio, destroyAudio } = useAudioElement({
    streamUrl,
    volume,
    muted,
    onTimeUpdate: (a) => setCurrentTime(a.currentTime),
    onLoadedMetadata: (a) => setDuration(Number.isFinite(a.duration) ? a.duration : 0),
    onPlaying: () => {
      setPlaying(true)
      setIsBuffering(false)
      setIsReconnecting(false)
      setStreamHealthy(true)
      reconnectAttemptRef.current = 0
      setMediaSessionPlaybackState('playing')
      clearReconnectTimer(reconnectTimerRef)
    },
    onPause: () => {
      setPlaying(false)
      setMediaSessionPlaybackState('paused')
    },
    onLoadStart: () => setIsBuffering(true),
    onWaiting: () => {
      setIsBuffering(true)
      scheduleReconnect('waiting', audioRef.current)
    },
    onCanPlay: () => setIsBuffering(false),
    onStalled: () => scheduleReconnect('stalled', audioRef.current),
    onError: () => scheduleReconnect('error', audioRef.current),
    onEnded: () => scheduleReconnect('ended', audioRef.current),
  })

  useEffect(() => {
    const persisted = readPersistedAudioSettings()
    setVolumeState(persisted.volume)
    setMuted(persisted.muted)
    setQualityState(persisted.quality)
    wantsPlayRef.current = persisted.wantsPlay
    setHasHydratedSettings(true)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage || !audioRef.current) return
      if (e.key === LS_VOLUME && e.newValue) {
        const v = Math.min(1, Math.max(0, Number(e.newValue)))
        setVolumeState(v)
        audioRef.current.volume = v
      }
      if (e.key === LS_MUTED) {
        const m = e.newValue === 'true'
        setMuted(m)
        audioRef.current.muted = m
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [audioRef])

  useNowPlayingPoller({
    nowPlayingUrl,
    fallback: INITIAL_METADATA,
    onChange: setNowPlaying,
  })

  useSchedulePoller({
    scheduleUrl,
    onChange: setCurrentShow,
  })

  /* ======================================================
     Playback Actions
  ====================================================== */
  const play = useCallback(async () => {
    const audio = ensureAudio()
    try {
      setHasInteracted(true)
      wantsPlayRef.current = true
      persistWantsPlay(true)
      audio.muted = false
      setMuted(false)
      
      if (audio.paused && audio.src) {
        hardReloadStreamSrc(audio, streamUrl)
      }

      await audio.play()
      setAutoplayBlocked(false)
      setShowUnmuteToast(false)
      await fade.fadeTo(audio, volume, FADE_IN_QUICK_MS)
      
      trackEvent('player_play', { placement: 'sticky_player' })
    } catch {
      setAutoplayBlocked(true)
      setShowUnmuteToast(true)
    }
  }, [ensureAudio, fade, streamUrl, volume])

  const pause = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    fade.stop()
    audio.pause()
    wantsPlayRef.current = false
    persistWantsPlay(false)
  }, [audioRef, fade])

  /* ======================================================
     Media Session Sync (Deps fixed)
  ====================================================== */
  useEffect(() => {
    if (!supportsMediaSession()) return
    
    setMediaSessionMetadata({
      title: nowPlaying.track,
      artist: nowPlaying.artist || currentShow?.hosts || MEDIA_ARTIST_DEFAULT,
      album: buildMediaSessionAlbumLine({ show: currentShow, isLive: nowPlaying.isLive }),
      artworkUrl: nowPlaying.artwork || currentShow?.artwork || null,
    })

    safeSetActionHandler('play', () => { void play() })
    safeSetActionHandler('pause', pause)
    safeSetActionHandler('stop', pause)

    return () => {
      safeSetActionHandler('play', null)
      safeSetActionHandler('pause', null)
      safeSetActionHandler('stop', null)
    }
  }, [nowPlaying, currentShow, playing, play, pause]) // deps fixed

  /* ======================================================
     Autoplay Logic (Unused vars fixed)
  ====================================================== */
  useEffect(() => {
    if (!hasHydratedSettings || !wantsPlayRef.current) return

    const audio = ensureAudio()
    if (!audio.paused) return

    const attemptAutoplay = async () => {
      try {
        // iOS/Safari usually require a muted start for autoplay
        if (isSafari || isIOS) {
          audio.muted = true
          setMuted(true)
        } else {
          audio.muted = muted
        }

        await audio.play()
        
        if (audio.muted) {
          setAutoplayBlocked(true)
          setShowUnmuteToast(true)
        }
      } catch {
        setAutoplayBlocked(true)
        setShowUnmuteToast(true)
      }
    }

    void attemptAutoplay()
  }, [hasHydratedSettings, ensureAudio, isSafari, isIOS, muted])

  const toggleMute = useCallback(() => {
    const audio = ensureAudio()
    const nextMuted = !audio.muted
    audio.muted = nextMuted
    setMuted(nextMuted)
    persistMuted(nextMuted)
  }, [ensureAudio])

  const setVolume = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v))
    const audio = ensureAudio()
    audio.volume = next
    setVolumeState(next)
    persistVolume(next)
  }, [ensureAudio])

  useEffect(() => {
    if (!autoplayBlocked) return

    const unlock = async () => {
      const audio = audioRef.current
      if (!audio) return
      setHasInteracted(true)
      try {
        audio.muted = false
        setMuted(false)
        await audio.play()
        setAutoplayBlocked(false)
        setShowUnmuteToast(false)
        await fade.fadeTo(audio, volume, FADE_IN_DEFAULT_MS)
      } catch { /* Still blocked */ }
    }

    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [audioRef, autoplayBlocked, fade, volume])

  const status = getPlaybackStatus(playing, isBuffering, isReconnecting, lastError)

  const value = useMemo<AudioState>(() => ({
    playing,
    isLive: nowPlaying.isLive,
    muted,
    volume,
    currentTime,
    duration,
    autoplayBlocked,
    showUnmuteToast,
    dismissUnmuteToast: () => setShowUnmuteToast(false),
    nowPlaying,
    currentShow,
    isBuffering,
    isReconnecting,
    streamHealthy,
    lastError,
    hasInteracted,
    status,
    play,
    pause,
    seek: (t) => {
      const a = audioRef.current;
      if (a) a.currentTime = t;
    },
    setVolume,
    toggleMute,
    setQuality: (q) => { setQualityState(q); persistQuality(q); },
    quality
  }), [playing, nowPlaying, muted, volume, currentTime, duration, autoplayBlocked, showUnmuteToast, isBuffering, isReconnecting, streamHealthy, lastError, hasInteracted, status, play, pause, setVolume, toggleMute, currentShow, quality, audioRef])

  useEffect(() => {
    return () => {
      fade.stop()
      clearReconnectTimer(reconnectTimerRef)
      destroyAudio()
    }
  }, [destroyAudio, fade])

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}