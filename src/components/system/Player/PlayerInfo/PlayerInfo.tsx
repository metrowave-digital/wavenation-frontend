'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import styles from './PlayerInfo.module.css'

import { useNowPlaying } from '@/components/system/Player/NowPlayingContext'
import { useAudio } from '@/components/system/Player/audio/AudioContext'
import { normalizeNowPlaying } from '@/app/utils/normalizeNowPlaying'

import { useRadioUpNext } from '@/app/lib/shows/useRadioUpNext'
import { getNextAirLabel } from '@/app/lib/shows/getNextAirLabel'

/* ======================================================
   Component
====================================================== */

export function PlayerInfo() {
  /* ================= MUSIC ================= */
  const rawNow = useNowPlaying()
  const now = useMemo(() => normalizeNowPlaying(rawNow), [rawNow])

  /* ================= AUDIO STATE ================= */
  const audio = useAudio()
  const isPlaying =
    typeof audio.currentTime === 'number' &&
    typeof audio.duration === 'number' &&
    audio.currentTime > 0 &&
    audio.currentTime < audio.duration

  /* ================= SHOW STATE ================= */
  const { live, upNext } = useRadioUpNext()
  const show = live ?? upNext

  const showText = useMemo(() => {
    if (!show) return 'Live Radio'

    if (live) {
      return `LIVE · ${show.radioShow.title}`
    }

    const airsIn = getNextAirLabel(show._days)
    return `UP NEXT · ${show.radioShow.title}${
      airsIn ? ` · ${airsIn}` : ''
    }`
  }, [show, live])

  const showStateClass = live
    ? styles.live
    : styles.upNext

  /* ======================================================
     Render
  ===================================================== */

  return (
    <div className={styles.playerInfo}>
      {/* ===== Waveform ===== */}
      <div
        className={`${styles.waveform} ${
          isPlaying ? styles.playing : ''
        }`}
        aria-hidden
      >
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* ===== Artwork ===== */}
      <div className={styles.artwork}>
        {!now.artwork && (
          <div className={styles.artworkSkeleton} />
        )}

        {now.artwork && (
          <Image
            src={now.artwork}
            alt={now.track ?? 'Now playing'}
            fill
            sizes="40px"
            className={styles.image}
          />
        )}
      </div>

      {/* ===== Text ===== */}
      <div className={styles.text}>
        <div className={styles.track} title={now.track}>
          {now.track || 'Live Radio'}
        </div>

        <div className={styles.artist} title={now.artist}>
          {now.artist || 'WaveNation'}
        </div>

        <div
          className={`${styles.showLabel} ${showStateClass}`}
          title={showText}
        >
          {showText}
        </div>
      </div>
    </div>
  )
}
