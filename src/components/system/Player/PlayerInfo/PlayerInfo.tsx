'use client'

import Image from 'next/image'
import clsx from 'clsx'
import styles from './PlayerInfo.module.css'

import { useAudio } from '@/components/system/Player/audio/AudioContext'
import { useRadioUpNext } from '@/app/lib/shows/useRadioUpNext'
import { getNextAirLabel } from '@/app/lib/shows/getNextAirLabel'

type PlayerInfoProps = {
  expanded?: boolean
}

export function PlayerInfo({
  expanded = false,
}: PlayerInfoProps) {
  const audio = useAudio()
  const now = audio.nowPlaying

  const isPlaying =
    audio.currentTime > 0 &&
    audio.duration > 0 &&
    audio.currentTime < audio.duration

  const { live, upNext } = useRadioUpNext()
  const show = live ?? upNext

  const showText = (() => {
    if (!show) return 'WaveNation Live Radio'

    if (live) return `${show.radioShow.title}`

    const airsIn = getNextAirLabel(show._days)
    return `UP NEXT // ${show.radioShow.title}${airsIn ? ` // ${airsIn}` : ''}`
  })()

  const statusText = live ? 'LIVE' : 'RADIO'
  const isLive = !!live

  return (
    <div
      className={clsx(
        styles.root,
        expanded && styles.expanded,
        isPlaying && styles.isPlaying
      )}
    >
      {/* =========================================
          MEDIA CLUSTER (Artwork & EQ)
      ========================================= */}
      <div className={styles.mediaCluster}>
        <div className={styles.artworkShell}>
          {/* Subtle glow behind artwork */}
          <div className={styles.artworkGlow} aria-hidden="true" />
          
          <div className={styles.artwork}>
            {!now.artwork && (
              <div className={styles.artworkFallback}>
                <span className={styles.fallbackMark}>WN</span>
              </div>
            )}

            {now.artwork && (
              <Image
                src={now.artwork}
                alt={now.track}
                fill
                sizes="(max-width: 960px) 48px, 64px"
                className={styles.image}
                priority={false}
              />
            )}
          </div>

          {/* Equalizer Overlay (Visible when playing) */}
          <div
            className={clsx(
              styles.waveformWrap,
              isPlaying && styles.waveformWrapActive
            )}
            aria-hidden="true"
          >
            <div className={styles.waveform}>
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          TEXT BLOCK (Meta, Track, Artist)
      ========================================= */}
      <div className={styles.textBlock}>
        {/* Broadcast Meta Line */}
        <div className={styles.topline}>
          <div className={clsx(styles.statusBadge, isLive && styles.statusLive)}>
            {isLive && <span className={styles.pulseDot} />}
            {statusText}
          </div>
          
          <span className={styles.separator}>/</span>
          
          <span className={styles.showLabel} title={showText}>
            {showText}
          </span>
        </div>

        {/* Track Info */}
        <div className={styles.trackWrap}>
          <div className={styles.trackName} title={now.track}>
            {now.track}
          </div>
          <div className={styles.artistName} title={now.artist}>
            {now.artist}
          </div>
        </div>
      </div>
    </div>
  )
}