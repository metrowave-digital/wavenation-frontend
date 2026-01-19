'use client'

import Image from 'next/image'
import React, { useEffect, useMemo } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import styles from './DesktopPlayerPopup.module.css'

import { useAudio } from '@/components/system/Player/audio/AudioContext'
import { useRadioUpNext } from '@/app/lib/shows/useRadioUpNext'
import { formatHHmm } from '@/lib/time'

/* ======================================================
   MOTION
====================================================== */

const fadeSwap: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

const listItem: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
}

/* ======================================================
   COMPONENT
====================================================== */

interface RecentTrack {
  key: string
  track: string
  artist: string
  artwork?: string | null
}

interface DesktopPlayerPopupProps {
  open: boolean
  onClose: () => void
  recent: RecentTrack[]
  isPlaying: boolean
}

export function DesktopPlayerPopup({
  open,
  onClose,
  recent,
  isPlaying,
}: DesktopPlayerPopupProps) {
  /* ================= AUDIO (SAME SOURCE AS PlayerInfo) ================= */
  const audio = useAudio()
  const now = audio.nowPlaying

  /* ================= SHOW STATE ================= */
  const { live, upNext } = useRadioUpNext()
  const show = live ?? upNext

  const showTitle =
    show?.radioShow?.title ?? 'WaveNation Radio'

  const showTimeLabel = live
    ? 'Live now'
    : show
    ? `Starts ${formatHHmm(show._start)}`
    : null

  /* ================= STABLE NORMALIZATION ================= */
  const normalized = useMemo(() => {
    return {
      track: now.track || 'Live Radio',
      artist: now.artist || 'WaveNation',
      artwork: now.artwork || null,
    }
  }, [now.track, now.artist, now.artwork])

  /* ================= SCROLL LOCK ================= */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const recentFive = recent.slice(0, 5)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* ================= HEADER ================= */}
            <header className={styles.header}>
              <div className={styles.headerTitle}>
                Now Playing
              </div>
              <button
                className={styles.close}
                onClick={onClose}
                aria-label="Close player"
              >
                ✕
              </button>
            </header>

            <div className={styles.grid}>
              {/* ================= LEFT ================= */}
              <div className={styles.left}>
                <div className={styles.artwork}>
                  {!normalized.artwork && (
                    <div className={styles.artworkSkeleton} />
                  )}

                  {normalized.artwork && (
                    <Image
                      src={normalized.artwork}
                      alt={`${normalized.track} by ${normalized.artist}`}
                      fill
                      priority
                      className={styles.image}
                    />
                  )}
                </div>

                {/* Track (animate only on real change) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${normalized.track}-${normalized.artist}`}
                    variants={fadeSwap}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={styles.track}
                  >
                    {normalized.track}
                  </motion.div>
                </AnimatePresence>

                <div className={styles.artist}>
                  {normalized.artist}
                </div>

                <div
                  className={`${styles.soundBars} ${
                    isPlaying ? styles.playing : ''
                  }`}
                  aria-hidden
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <div className={styles.right}>
                <div className={styles.sectionTitle}>
                  {live ? 'On Air' : 'Up Next'}
                </div>

                <div className={styles.showCard}>
                  <div className={styles.showMeta}>
                    <div className={styles.showTitle}>
                      {showTitle}
                    </div>
                    {showTimeLabel && (
                      <div className={styles.showTime}>
                        {showTimeLabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.sectionTitle}>
                  Last 5 tracks
                </div>

                {recentFive.length ? (
                  <ul className={styles.recent}>
                    <AnimatePresence>
                      {recentFive.map(t => {
                        const art =
                          t.artwork ||
                          '/images/player/default-artwork.jpg'

                        return (
                          <motion.li
                            key={t.key}
                            variants={listItem}
                            initial="initial"
                            animate="animate"
                            exit="initial"
                            className={styles.recentItem}
                          >
                            <div className={styles.recentArt}>
                              <Image
                                src={art}
                                alt={t.track}
                                width={36}
                                height={36}
                                className={styles.recentImage}
                              />
                            </div>
                            <div>
                              <div className={styles.recentTrack}>
                                {t.track}
                              </div>
                              <div className={styles.recentArtist}>
                                {t.artist}
                              </div>
                            </div>
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className={styles.empty}>
                    No recent tracks yet.
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
