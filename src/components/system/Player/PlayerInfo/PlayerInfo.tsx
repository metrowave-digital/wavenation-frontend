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

    if (live) return `LIVE NOW · ${show.radioShow.title}`

    const airsIn = getNextAirLabel(show._days)
    return `UP NEXT · ${show.radioShow.title}${airsIn ? ` · ${airsIn}` : ''}`
  })()

  const statusText = live ? 'On Air' : 'Radio'
  const showStateClass = live ? styles.live : styles.upNext

  return (
    <div
      className={clsx(
        styles.playerInfo,
        expanded && styles.expanded,
        isPlaying && styles.isPlaying
      )}
    >
      <div className={styles.mediaCluster}>
        <div
          className={clsx(
            styles.waveformWrap,
            isPlaying && styles.waveformWrapActive
          )}
          aria-hidden="true"
        >
          <div className={styles.waveform}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.artworkShell}>
          <div className={styles.artworkGlow} aria-hidden="true" />
          <div className={styles.artwork}>
            {!now.artwork && (
              <div className={styles.artworkFallback}>
                <div className={styles.artworkSkeleton} />
                <span className={styles.fallbackMark}>WN</span>
              </div>
            )}

            {now.artwork && (
              <Image
                src={now.artwork}
                alt={now.track}
                fill
                sizes="72px"
                className={styles.image}
                priority={false}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.textBlock}>
        <div className={styles.topline}>
          <span className={styles.statusPill}>{statusText}</span>
          <span
            className={clsx(styles.showLabel, showStateClass)}
            title={showText}
          >
            {showText}
          </span>
        </div>

        <div className={styles.trackWrap}>
          <div className={styles.track} title={now.track}>
            {now.track}
          </div>

          <div className={styles.artist} title={now.artist}>
            {now.artist}
          </div>
        </div>
      </div>
    </div>
  )
}