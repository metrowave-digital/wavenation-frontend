'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './PlayerControls.module.css'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useAudio } from '@/components/system/Player/audio/AudioContext'

interface PlayerControlsProps {
  placement?: 'sticky_player' | 'fullscreen_player'
}

export function PlayerControls({
  placement = 'sticky_player',
}: PlayerControlsProps) {
  const {
    playing,
    volume,
    muted,
    play,
    pause,
    setVolume,
  } = useAudio()

  const [showVolume, setShowVolume] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const hasUnlockedAudio = useRef(false)

  const volumePercent = Math.round(volume * 100)

  const volumeIcon = useMemo(() => {
    if (muted || volume === 0) return <VolumeX size={18} />
    if (volume <= 0.45) return <Volume1 size={18} />
    return <Volume2 size={18} />
  }, [muted, volume])

  useEffect(() => {
    function unlockAudio() {
      if (hasUnlockedAudio.current) return

      hasUnlockedAudio.current = true
      play()

      trackEvent('player_play', {
        placement,
        source: 'gesture_autoplay',
      })

      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio)

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [play, placement])

  useEffect(() => {
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowVolume(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowVolume(false)
      }
    }

    if (!showVolume) return

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown, { passive: true })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showVolume])

  function togglePlay() {
    if (playing) {
      pause()
      trackEvent('player_pause', {
        placement,
        source: 'player_controls',
      })
      return
    }

    play()
    trackEvent('player_play', {
      placement,
      source: 'player_controls',
    })
  }

  function toggleMute() {
    const nextVolume = volume === 0 ? 0.6 : 0
    setVolume(nextVolume)

    trackEvent('volume_change', {
      placement,
      volume: Math.round(nextVolume * 100),
      muted: nextVolume === 0,
      source: 'mute_toggle',
    })
  }

  function handleVolumeChange(value: number) {
    const normalized = value / 100
    setVolume(normalized)

    trackEvent('volume_change', {
      placement,
      volume: value,
      muted: value === 0,
      source: 'volume_slider',
    })
  }

  function handlePrevious() {
    trackEvent('player_previous_click', {
      placement,
      source: 'player_controls',
    })
  }

  function handleNext() {
    trackEvent('player_next_click', {
      placement,
      source: 'player_controls',
    })
  }

  return (
    <div
      className={clsx(
        styles.controls,
        placement === 'fullscreen_player' && styles.isFullscreen
      )}
      role="group"
      aria-label="Player controls"
    >
      <div className={styles.transportCluster}>
        <button
          type="button"
          className={clsx(styles.controlButton, styles.secondaryButton)}
          aria-label="Previous track"
          onClick={handlePrevious}
        >
          <span className={styles.buttonGlow} aria-hidden="true" />
          <span className={styles.buttonIcon} aria-hidden="true">
            <SkipBack size={18} />
          </span>
        </button>

        <button
          type="button"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
          aria-pressed={playing}
          onClick={togglePlay}
          className={clsx(styles.controlButton, styles.playButton)}
        >
          <span className={styles.buttonGlow} aria-hidden="true" />
          <span className={styles.buttonRing} aria-hidden="true" />
          <span className={styles.buttonIcon} aria-hidden="true">
            {playing ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className={styles.playIcon} />
            )}
          </span>
        </button>

        <button
          type="button"
          className={clsx(styles.controlButton, styles.secondaryButton)}
          aria-label="Next track"
          onClick={handleNext}
        >
          <span className={styles.buttonGlow} aria-hidden="true" />
          <span className={styles.buttonIcon} aria-hidden="true">
            <SkipForward size={18} />
          </span>
        </button>
      </div>

      <div className={styles.volumeWrap} ref={popoverRef}>
        <button
          type="button"
          aria-label={muted || volume === 0 ? 'Unmute audio' : 'Adjust volume'}
          aria-expanded={showVolume}
          aria-haspopup="dialog"
          onClick={() => setShowVolume(v => !v)}
          onContextMenu={e => {
            e.preventDefault()
            toggleMute()
          }}
          className={clsx(styles.controlButton, styles.volumeButton)}
        >
          <span className={styles.buttonGlow} aria-hidden="true" />
          <span className={styles.buttonIcon} aria-hidden="true">
            {volumeIcon}
          </span>
        </button>

        <div
          className={clsx(
            styles.volumePopover,
            showVolume && styles.volumePopoverOpen
          )}
          role="dialog"
          aria-label="Volume controls"
          aria-hidden={!showVolume}
        >
          <div className={styles.volumePopoverInner}>
            <button
              type="button"
              className={styles.muteButton}
              onClick={toggleMute}
              aria-label={muted || volume === 0 ? 'Unmute audio' : 'Mute audio'}
            >
              {volumeIcon}
            </button>

            <div className={styles.volumeSliderWrap}>
              <input
                type="range"
                min={0}
                max={100}
                value={volumePercent}
                onChange={e => handleVolumeChange(Number(e.target.value))}
                className={styles.volumeSlider}
                aria-label="Volume slider"
                style={
                  {
                    '--volume-progress': `${volumePercent}%`,
                  } as React.CSSProperties
                }
              />
            </div>

            <span className={styles.volumeValue}>
              {volumePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}