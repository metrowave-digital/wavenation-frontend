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

  const bufferedPercent = useMemo(() => {
    if (isLive || safeDuration <= 0) return 100
    return Math.min(100, Math.max(percent, percent + 12))
  }, [isLive, safeDuration, percent])

  const remaining = useMemo(() => {
    if (isLive || safeDuration <= 0) return 0
    return Math.max(0, safeDuration - safeCurrentTime)
  }, [isLive, safeCurrentTime, safeDuration])

  const progressStyle = {
    '--progress': `${percent}%`,
    '--buffered': `${bufferedPercent}%`,
  } as CSSProperties

  return (
    <section
      className={clsx(styles.root, isLive && styles.live)}
      aria-label={isLive ? 'Live playback status' : 'Playback progress'}
    >
      <div className={styles.topRow}>
        <div className={styles.leftMeta}>
          {isLive ? (
            <span className={styles.livePill}>
              <span className={styles.liveDot} aria-hidden="true" />
              LIVE
            </span>
          ) : (
            <span className={styles.timeCurrent}>{formatTime(safeCurrentTime)}</span>
          )}
        </div>

        <div className={styles.centerMeta}>
          {isLive ? (
            <span className={styles.liveText}>On air now</span>
          ) : (
            <span className={styles.progressLabel}>{Math.round(percent)}%</span>
          )}
        </div>

        <div className={styles.rightMeta}>
          {isLive ? (
            <span className={styles.liveTextMuted}>Continuous stream</span>
          ) : (
            <span className={styles.timeRemaining}>-{formatTime(remaining)}</span>
          )}
        </div>
      </div>

      <div className={styles.trackFrame}>
        <div className={styles.trackAura} aria-hidden="true" />

        <div
          className={styles.track}
          style={progressStyle}
          aria-hidden="true"
        >
          <div className={styles.trackBase} />
          <div className={styles.trackBuffered} />
          <div className={styles.trackProgress} />
          <div className={styles.trackGlass} />
          {!isLive && <div className={styles.trackThumb} />}
        </div>

        {!isLive && (
          <input
            type="range"
            min={0}
            max={safeDuration}
            step={0.1}
            value={safeCurrentTime}
            onChange={e => seek(Number(e.target.value))}
            className={styles.scrubber}
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={safeDuration}
            aria-valuenow={safeCurrentTime}
            aria-valuetext={`${formatTime(safeCurrentTime)} elapsed of ${formatTime(safeDuration)}`}
            style={
              {
                '--progress': `${percent}%`,
              } as CSSProperties
            }
          />
        )}
      </div>
    </section>
  )
}