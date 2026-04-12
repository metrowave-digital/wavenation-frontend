'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { X, Radio, Clock, Disc3 } from 'lucide-react'
import styles from './DesktopPlayerPopup.module.css'
import type { RecentTrack } from './usePlayerPopupData'

interface DesktopPlayerPopupProps {
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

const fadeSwap: Variants = {
  initial: { opacity: 0, y: 15, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

const listItem: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export function DesktopPlayerPopup({
  open,
  onClose,
  recent,
  isPlaying,
  normalizedNow,
  showData,
}: DesktopPlayerPopupProps) {
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
        className={styles.overlay}
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        onClick={onClose}
      >
        <motion.section
          className={styles.panel}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, scale: 0.95, y: 20 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.98, y: 10 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="desktop-player-popup-title"
          aria-describedby="desktop-player-popup-description"
        >
          {/* Header */}
          <header className={styles.header}>
            <div id="desktop-player-popup-title" className={styles.headerTitle}>
              <span className={styles.pulseDot} /> NOW PLAYING
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close player"
            >
              <X size={24} />
            </button>
          </header>

          <p id="desktop-player-popup-description" className={styles.srOnly}>
            Now playing details, current show information, and the last five tracks.
          </p>

          <div className={styles.grid}>
            {/* LEFT COLUMN: Cinematic Hero Artwork */}
            <div className={styles.left}>
              <div className={styles.artworkWrapper}>
                <div className={styles.artworkGlow} aria-hidden="true" />
                <div className={styles.artwork}>
                  {!normalizedNow.artwork ? (
                    <div className={styles.artworkSkeleton}>
                      <Disc3 size={64} className={styles.skeletonIcon} />
                    </div>
                  ) : (
                    <Image
                      src={normalizedNow.artwork}
                      alt={`${normalizedNow.track} by ${normalizedNow.artist}`}
                      fill
                      priority
                      sizes="480px"
                      className={styles.image}
                    />
                  )}
                </div>
              </div>

              <div className={styles.nowPlayingMeta}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={`${normalizedNow.track}`}
                    variants={fadeSwap}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={styles.track}
                  >
                    {normalizedNow.track}
                  </motion.h2>
                </AnimatePresence>

                <div className={styles.artistRow}>
                  <h3 className={styles.artist}>{normalizedNow.artist}</h3>
                  <div className={`${styles.soundBars} ${isPlaying ? styles.playing : ''}`} aria-hidden="true">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Show Context & Queue */}
            <div className={styles.right}>
              {/* Show Context */}
              <div className={styles.sectionHeader}>
                <Radio size={16} className={styles.sectionIcon} />
                <span className={styles.sectionTitle}>
                  {showData.isLive ? 'ON AIR NOW' : 'UP NEXT'}
                </span>
              </div>

              <div className={styles.showCard}>
                <div className={styles.showMeta}>
                  <div className={styles.showTitle}>{showData.title}</div>
                  {showData.hosts && <div className={styles.showHosts}>{showData.hosts}</div>}
                  {showData.timeLabel && <div className={styles.showTime}>{showData.timeLabel}</div>}
                </div>
              </div>

              {/* History / Queue */}
              <div className={styles.sectionHeader}>
                <Clock size={16} className={styles.sectionIcon} />
                <span className={styles.sectionTitle}>RECENTLY PLAYED</span>
              </div>

              {recent.length ? (
                <ul className={styles.recent}>
                  <AnimatePresence initial={false}>
                    {recent.map((track, index) => {
                      const art = track.artwork || '/images/player/default-artwork.jpg'

                      return (
                        <motion.li
                          key={track.key}
                          variants={listItem}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}
                          className={styles.recentItem}
                        >
                          <div className={styles.recentArt}>
                            <Image
                              src={art}
                              alt={track.track}
                              width={48}
                              height={48}
                              className={styles.recentImage}
                            />
                          </div>
                          <div className={styles.recentMeta}>
                            <div className={styles.recentTrack}>{track.track}</div>
                            <div className={styles.recentArtist}>{track.artist}</div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className={styles.empty}>No recent tracks in session.</div>
              )}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  )
}