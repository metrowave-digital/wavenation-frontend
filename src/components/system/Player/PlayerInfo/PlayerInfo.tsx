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

/* ======================================================
   COMPONENT
====================================================== */

export function PlayerInfo({
  expanded = false,
}: PlayerInfoProps) {
  const audio = useAudio()
  const now = audio.nowPlaying

  const isPlaying =
    audio.currentTime > 0 &&
    audio.duration > 0 &&
    audio.currentTime < audio.duration

  /* ================= SHOW STATE ================= */
  const { live, upNext } = useRadioUpNext()
  const show = live ?? upNext

  const showText = (() => {
    if (!show) return 'Live Radio'

    if (live) return `LIVE · ${show.radioShow.title}`

    const airsIn = getNextAirLabel(show._days)
    return `UP NEXT · ${show.radioShow.title}${
      airsIn ? ` · ${airsIn}` : ''
    }`
  })()

  const showStateClass = live ? styles.live : styles.upNext

  return (
    <div
      className={clsx(
        styles.playerInfo,
        expanded && styles.expanded
      )}
    >
      {/* ===== WAVEFORM ===== */}
      <div
        className={clsx(
          styles.waveform,
          isPlaying && styles.playing
        )}
        aria-hidden
      >
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* ===== ARTWORK ===== */}
      <div className={styles.artwork}>
        {!now.artwork && (
          <div className={styles.artworkSkeleton} />
        )}

        {now.artwork && (
          <Image
            src={now.artwork}
            alt={now.track}
            fill
            sizes="56px"
            className={styles.image}
          />
        )}
      </div>

      {/* ===== TEXT ===== */}
      <div className={styles.text}>
        <div className={styles.track} title={now.track}>
          {now.track}
        </div>

        <div className={styles.artist} title={now.artist}>
          {now.artist}
        </div>

        <div
          className={clsx(styles.showLabel, showStateClass)}
          title={showText}
        >
          {showText}
        </div>
      </div>
    </div>
  )
}