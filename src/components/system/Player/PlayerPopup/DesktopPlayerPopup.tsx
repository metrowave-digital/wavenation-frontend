'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
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
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
}

const listItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.16, ease: 'easeIn' },
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
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        onClick={onClose}
      >
        <motion.section
          className={styles.panel}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, scale: 0.985, y: 8 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.985, y: 8 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.24,
            ease: 'easeOut',
          }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="desktop-player-popup-title"
          aria-describedby="desktop-player-popup-description"
        >
          <header className={styles.header}>
            <div
              id="desktop-player-popup-title"
              className={styles.headerTitle}
            >
              Now Playing
            </div>

            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close player"
            >
              ✕
            </button>
          </header>

          <p id="desktop-player-popup-description" className={styles.srOnly}>
            Now playing details, current show information, and the last five
            tracks.
          </p>

          <div className={styles.grid}>
            <div className={styles.left}>
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
                    sizes="(min-width: 900px) 320px, 100vw"
                    className={styles.image}
                  />
                )}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${normalizedNow.track}-${normalizedNow.artist}`}
                  variants={fadeSwap}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={styles.track}
                >
                  {normalizedNow.track}
                </motion.div>
              </AnimatePresence>

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

            <div className={styles.right}>
              <div className={styles.sectionTitle}>
                {showData.isLive ? 'On Air' : 'Up Next'}
              </div>

              <div className={styles.showCard}>
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

              <div className={styles.sectionTitle}>Last 5 tracks</div>

              {recent.length ? (
                <ul className={styles.recent}>
                  <AnimatePresence initial={false}>
                    {recent.map((track, index) => {
                      const art =
                        track.artwork || '/images/player/default-artwork.jpg'

                      return (
                        <motion.li
                          key={track.key}
                          variants={listItem}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{
                            delay: shouldReduceMotion ? 0 : index * 0.03,
                          }}
                          className={styles.recentItem}
                        >
                          <div className={styles.recentArt}>
                            <Image
                              src={art}
                              alt={track.track}
                              width={42}
                              height={42}
                              className={styles.recentImage}
                            />
                          </div>

                          <div className={styles.recentMeta}>
                            <div className={styles.recentTrack}>
                              {track.track}
                            </div>
                            <div className={styles.recentArtist}>
                              {track.artist}
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className={styles.empty}>No recent tracks yet.</div>
              )}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  )
}