'use client'

import Image from 'next/image'
import React, { useEffect, useMemo } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { X, Radio, Clock, Disc3 } from 'lucide-react'
import styles from './DesktopPlayerPopup.module.css'
import type { RecentTrack } from './usePlayerPopupData'

/* ----------------------------------------
   Types
----------------------------------------- */

type RadioHistoryTrack = {
  key?: string
  track?: string
  title?: string
  artist?: string
  artwork?: string | null
  playedAt?: number | string | null
}

type RecentTrackInput = RecentTrack | RadioHistoryTrack

type NormalizedRecentTrack = {
  key: string
  track: string
  artist: string
  artwork: string | null
  playedAt: number | string | null
}

interface DesktopPlayerPopupProps {
  open: boolean
  onClose: () => void
  recent: RecentTrackInput[]
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

/* ----------------------------------------
   Helpers
----------------------------------------- */

function lockBodyScroll(locked: boolean) {
  if (!locked) return () => {}

  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = previousOverflow
  }
}

function createTrackIdentity(artist: string, track: string) {
  return `${artist.trim()}|${track.trim()}`.toLowerCase()
}

function normalizeRecentTrack(
  item: RecentTrackInput,
  index: number,
): NormalizedRecentTrack | null {
  const track =
    'track' in item && typeof item.track === 'string'
      ? item.track.trim()
      : 'title' in item && typeof item.title === 'string'
        ? item.title.trim()
        : ''

  const artist =
    'artist' in item && typeof item.artist === 'string'
      ? item.artist.trim()
      : ''

  const artwork =
    'artwork' in item && typeof item.artwork === 'string'
      ? item.artwork
      : null

  const playedAt =
    'playedAt' in item
      ? item.playedAt ?? null
      : null

  const suppliedKey =
    'key' in item && typeof item.key === 'string'
      ? item.key
      : null

  if (!track && !artist) {
    return null
  }

  return {
    key:
      suppliedKey ||
      `${playedAt ?? index}-${createTrackIdentity(artist, track)}`,
    track: track || 'Unknown track',
    artist: artist || 'Unknown artist',
    artwork,
    playedAt,
  }
}

/* ----------------------------------------
   Animation Variants
----------------------------------------- */

const fadeSwap: Variants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: 'blur(4px)',
  },

  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },

  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

const listItem: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },

  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },

  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

/* ----------------------------------------
   Component
----------------------------------------- */

export function DesktopPlayerPopup({
  open,
  onClose,
  recent,
  isPlaying,
  normalizedNow,
  showData,
}: DesktopPlayerPopupProps) {
  const shouldReduceMotion = useReducedMotion()

  const normalizedRecent = useMemo(() => {
    const currentTrackIdentity = createTrackIdentity(
      normalizedNow.artist,
      normalizedNow.track,
    )

    const seen = new Set<string>()

    return recent
      .map(normalizeRecentTrack)
      .filter(
        (
          track,
        ): track is NormalizedRecentTrack => track !== null,
      )
      .filter(track => {
        const identity = createTrackIdentity(
          track.artist,
          track.track,
        )

        /*
         * Remove the currently playing song if Radio.co
         * includes it as the first history item.
         */
        if (identity === currentTrackIdentity) {
          return false
        }

        /*
         * Remove duplicate history entries.
         */
        if (seen.has(identity)) {
          return false
        }

        seen.add(identity)
        return true
      })
      .slice(0, 5)
  }, [
    recent,
    normalizedNow.artist,
    normalizedNow.track,
  ])

  useEffect(() => {
    if (!open) return

    return lockBodyScroll(true)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.4,
          }}
          onClick={onClose}
        >
          <motion.section
            className={styles.panel}
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.98,
                    y: 10,
                  }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={event => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="desktop-player-popup-title"
            aria-describedby="desktop-player-popup-description"
          >
            {/* Header */}

            <header className={styles.header}>
              <div
                id="desktop-player-popup-title"
                className={styles.headerTitle}
              >
                <span
                  className={styles.pulseDot}
                  aria-hidden="true"
                />

                NOW PLAYING
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

            <p
              id="desktop-player-popup-description"
              className={styles.srOnly}
            >
              Now playing details, current show information,
              and the last five tracks.
            </p>

            <div className={styles.grid}>
              {/* Left Column */}

              <div className={styles.left}>
                <div className={styles.artworkWrapper}>
                  <div
                    className={styles.artworkGlow}
                    aria-hidden="true"
                  />

                  <div className={styles.artwork}>
                    {!normalizedNow.artwork ? (
                      <div className={styles.artworkSkeleton}>
                        <Disc3
                          size={64}
                          className={styles.skeletonIcon}
                        />
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
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                  >
                    <motion.h2
                      key={`${normalizedNow.artist}-${normalizedNow.track}`}
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
                    <h3 className={styles.artist}>
                      {normalizedNow.artist}
                    </h3>

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
              </div>

              {/* Right Column */}

              <div className={styles.right}>
                <div className={styles.sectionHeader}>
                  <Radio
                    size={16}
                    className={styles.sectionIcon}
                  />

                  <span className={styles.sectionTitle}>
                    {showData.isLive
                      ? 'ON AIR NOW'
                      : 'UP NEXT'}
                  </span>
                </div>

                <div className={styles.showCard}>
                  <div className={styles.showMeta}>
                    <div className={styles.showTitle}>
                      {showData.title}
                    </div>

                    {showData.hosts && (
                      <div className={styles.showHosts}>
                        {showData.hosts}
                      </div>
                    )}

                    {showData.timeLabel && (
                      <div className={styles.showTime}>
                        {showData.timeLabel}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recently Played */}

                <div className={styles.sectionHeader}>
                  <Clock
                    size={16}
                    className={styles.sectionIcon}
                  />

                  <span className={styles.sectionTitle}>
                    RECENTLY PLAYED
                  </span>
                </div>

                {normalizedRecent.length > 0 ? (
                  <ul className={styles.recent}>
                    <AnimatePresence initial={false}>
                      {normalizedRecent.map(
                        (track, index) => {
                          const artwork =
                            track.artwork ||
                            '/images/player/default-artwork.jpg'

                          return (
                            <motion.li
                              key={track.key}
                              variants={listItem}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={{
                                delay: shouldReduceMotion
                                  ? 0
                                  : index * 0.05,
                              }}
                              className={styles.recentItem}
                            >
                              <div
                                className={styles.recentArt}
                              >
                                <Image
                                  src={artwork}
                                  alt={`${track.track} by ${track.artist}`}
                                  width={48}
                                  height={48}
                                  sizes="48px"
                                  className={
                                    styles.recentImage
                                  }
                                />
                              </div>

                              <div
                                className={styles.recentMeta}
                              >
                                <div
                                  className={
                                    styles.recentTrack
                                  }
                                >
                                  {track.track}
                                </div>

                                <div
                                  className={
                                    styles.recentArtist
                                  }
                                >
                                  {track.artist}
                                </div>
                              </div>
                            </motion.li>
                          )
                        },
                      )}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className={styles.empty}>
                    Recent tracks will appear after they have
                    played.
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