'use client'

import { useMemo } from 'react'
import clsx from 'clsx'
import type { CSSProperties } from 'react'
import styles from './PlayerProgress.module.css'
import { useAudio } from '@/components/system/Player/audio/AudioContext'

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerProgress() {
  const { currentTime, duration, seek } = useAudio()

  const isLive = !Number.isFinite(duration) || duration <= 0

  const safeCurrentTime = Number.isFinite(currentTime) ? Math.max(0, currentTime) : 0
  const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0

  const percent = useMemo(() => {
    if (isLive || safeDuration <= 0) return 100
    return Math.min(100, Math.max(0, (safeCurrentTime / safeDuration) * 100))
  }, [isLive, safeCurrentTime, safeDuration])

  const progressStyle = {
    '--progress': `${percent}%`,
  } as CSSProperties

  return (
    <section
      className={clsx(styles.root, isLive && styles.isLive)}
      aria-label={isLive ? 'Live playback status' : 'Playback progress'}
    >
      {/* Top Meta Data */}
      <div className={styles.metaRow}>
        <div className={styles.timeLabel}>
          {isLive ? 'LIVE' : formatTime(safeCurrentTime)}
        </div>
        <div className={styles.timeLabel}>
          {isLive ? 'ON AIR' : `-${formatTime(Math.max(0, safeDuration - safeCurrentTime))}`}
        </div>
      </div>

      {/* Scrubber Frame */}
      <div className={styles.trackFrame}>
        {/* Decorative Glow */}
        <div className={styles.trackGlow} style={progressStyle} aria-hidden="true" />
        
        {/* The Visual Bar */}
        <div className={styles.trackVisual} style={progressStyle} aria-hidden="true">
          <div className={styles.trackBase} />
          <div className={styles.trackFill} />
        </div>

        {/* The Native Input Layer */}
        {!isLive && (
          <input
            type="range"
            min={0}
            max={safeDuration}
            step={0.1}
            value={safeCurrentTime}
            onChange={e => seek(Number(e.target.value))}
            className={styles.scrubberInput}
            aria-label="Playback progress"
            style={progressStyle}
          />
        )}
      </div>
    </section>
  )
}