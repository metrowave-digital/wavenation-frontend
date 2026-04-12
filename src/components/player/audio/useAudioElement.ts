'use client'

import { useCallback, useRef } from 'react'

type UseAudioElementArgs = {
  streamUrl: string
  volume: number
  muted: boolean
  onTimeUpdate: (audio: HTMLAudioElement) => void
  onLoadedMetadata: (audio: HTMLAudioElement) => void
  onPlaying: () => void
  onPause: () => void
  onLoadStart: () => void
  onWaiting: () => void
  onCanPlay: () => void
  onStalled: () => void
  onError: () => void
  onEnded: () => void
}

type CleanupFn = () => void

export function useAudioElement({
  streamUrl,
  volume,
  muted,
  onTimeUpdate,
  onLoadedMetadata,
  onPlaying,
  onPause,
  onLoadStart,
  onWaiting,
  onCanPlay,
  onStalled,
  onError,
  onEnded,
}: UseAudioElementArgs) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cleanupRef = useRef<CleanupFn | null>(null)

  const destroyAudio = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null

    const audio = audioRef.current
    if (!audio) return

    try {
      audio.pause()
      audio.src = ''
      audio.load() // Forces immediate release of resources
    } catch {
      // Ignore cleanup errors
    }

    audioRef.current = null
  }, [])

  const ensureAudio = useCallback(() => {
    let audio = audioRef.current

    if (audio) {
      // If the URL changed (e.g., quality switch), update the source
      if (audio.src && !audio.src.includes(streamUrl)) {
        audio.src = streamUrl
        audio.load()
      }

      audio.volume = volume
      audio.muted = muted
      return audio
    }

    // Initialize New Audio Instance
    audio = new Audio(streamUrl)
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    
    // Critical for iOS/Safari background play
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')

    audio.volume = volume
    audio.muted = muted

    // Event Handlers
    const handleTimeUpdate = () => onTimeUpdate(audio!)
    const handleLoadedMetadata = () => onLoadedMetadata(audio!)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('loadstart', onLoadStart)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('stalled', onStalled)
    audio.addEventListener('error', onError)
    audio.addEventListener('ended', onEnded)

    cleanupRef.current = () => {
      audio?.removeEventListener('timeupdate', handleTimeUpdate)
      audio?.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio?.removeEventListener('playing', onPlaying)
      audio?.removeEventListener('pause', onPause)
      audio?.removeEventListener('loadstart', onLoadStart)
      audio?.removeEventListener('waiting', onWaiting)
      audio?.removeEventListener('canplay', onCanPlay)
      audio?.removeEventListener('stalled', onStalled)
      audio?.removeEventListener('error', onError)
      audio?.removeEventListener('ended', onEnded)
    }

    audioRef.current = audio
    return audio
  }, [muted, onCanPlay, onEnded, onError, onLoadStart, onLoadedMetadata, onPause, onPlaying, onStalled, onTimeUpdate, onWaiting, streamUrl, volume])

  return {
    audioRef,
    ensureAudio,
    destroyAudio,
  }
}