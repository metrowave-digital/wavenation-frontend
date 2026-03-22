'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import styles from './MobilePlayerPopup.module.css'
import type { RecentTrack } from './usePlayerPopupData'

interface MobilePlayerPopupProps {
  open: boolean
  onClose: () => void
  recent: RecentTrack[]
  isPlaying: boolean
  normalizedNow: {
    track: string
    artist: string
    artwork: string | null
  }
  showData: {
    isLive: boolean
    title: string
    hosts: string | null
    artwork: string | null
    timeLabel: string | null
  }
}

function lockBodyScroll(locked: boolean) {
  if (!locked) return () => {}

  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = previousOverflow
  }
}

const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

const sheet: Variants = {
  hidden: { y: '100%' },
  show: {
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 460,
      damping: 38,
      mass: 0.95,
    },
  },
  exit: {
    y: '100%',
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 40,
      mass: 1,
    },
  },
}

export function MobilePlayerPopup({
  open,
  onClose,
  recent,
  isPlaying,
  normalizedNow,
  showData,
}: MobilePlayerPopupProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    return lockBodyScroll(true)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        variants={shouldReduceMotion ? undefined : backdrop}
        initial={shouldReduceMotion ? { opacity: 0 } : 'hidden'}
        animate={shouldReduceMotion ? { opacity: 1 } : 'show'}
        exit={shouldReduceMotion ? { opacity: 0 } : 'exit'}
        onClick={onClose}
      >
        <motion.section
          className={styles.sheet}
          variants={shouldReduceMotion ? undefined : sheet}
          initial={shouldReduceMotion ? { y: '100%' } : 'hidden'}
          animate={shouldReduceMotion ? { y: 0 } : 'show'}
          exit={shouldReduceMotion ? { y: '100%' } : 'exit'}
          drag={shouldReduceMotion ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.18}
          onClick={e => e.stopPropagation()}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120 || info.velocity.y > 900) {
              onClose()
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-player-popup-title"
          aria-describedby="mobile-player-popup-description"
        >
          <div className={styles.handleRow}>
            <div className={styles.handle} aria-hidden="true" />

            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close player"
            >
              ✕
            </button>
          </div>

          <h2 id="mobile-player-popup-title" className={styles.srOnly}>
            Now Playing
          </h2>

          <p id="mobile-player-popup-description" className={styles.srOnly}>
            Current track information, current or upcoming show details, and the
            last five tracks.
          </p>

          <div className={styles.nowRow}>
            <div className={styles.artwork}>
              {!normalizedNow.artwork && (
                <div className={styles.artworkSkeleton} />
              )}

              {normalizedNow.artwork && (
                <Image
                  src={normalizedNow.artwork}
                  alt={`${normalizedNow.track} by ${normalizedNow.artist}`}
                  fill
                  priority
                  sizes="96px"
                  className={styles.image}
                />
              )}
            </div>

            <div className={styles.meta}>
              <div className={styles.track}>{normalizedNow.track}</div>
              <div className={styles.artist}>{normalizedNow.artist}</div>

              <div
                className={`${styles.soundBars} ${
                  isPlaying ? styles.playing : ''
                }`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          {(showData.title || showData.timeLabel) && (
            <div className={styles.showCard}>
              <div className={styles.showArt}>
                {!showData.artwork && <div className={styles.showArtSkeleton} />}

                {showData.artwork && (
                  <Image
                    src={showData.artwork}
                    alt={showData.title || 'Show artwork'}
                    width={48}
                    height={48}
                    className={styles.showImage}
                  />
                )}
              </div>

              <div className={styles.showMeta}>
                <div className={styles.showTitle}>{showData.title}</div>

                {showData.hosts && (
                  <div className={styles.showHosts}>{showData.hosts}</div>
                )}

                {showData.timeLabel && (
                  <div className={styles.showTime}>{showData.timeLabel}</div>
                )}
              </div>
            </div>
          )}

          <div className={styles.sectionTitle}>
            {showData.isLive ? 'Recently Played' : 'Last 5 tracks'}
          </div>

          {recent.length ? (
            <ul className={styles.recent}>
              {recent.map(track => (
                <li key={track.key} className={styles.recentItem}>
                  <div className={styles.recentText}>
                    <div className={styles.recentTrack}>{track.track}</div>
                    <div className={styles.recentArtist}>{track.artist}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>No recent tracks yet.</div>
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  )
}