'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { ChevronDown, Disc3, Clock, Radio } from 'lucide-react'
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
  show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
}

const sheet: Variants = {
  hidden: { y: '100%' },
  show: {
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 35, mass: 1 },
  },
  exit: {
    y: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 35, mass: 1 },
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
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
          dragElastic={0.15}
          onClick={e => e.stopPropagation()}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 600) onClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-player-popup-title"
        >
          {/* Header & Drag Handle */}
          <div className={styles.header}>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close player">
              <ChevronDown size={28} />
            </button>
            <div className={styles.headerTitle}>
              <span className={styles.pulseDot} />
              {showData.isLive ? 'LIVE BROADCAST' : 'NOW PLAYING'}
            </div>
            <div className={styles.headerSpacer} />
          </div>

          <h2 id="mobile-player-popup-title" className={styles.srOnly}>Now Playing</h2>

          {/* Scrollable Content Zone */}
          <div className={styles.contentScroll}>
            {/* Big Artwork Area */}
            <div className={styles.artworkZone}>
              <div className={styles.artwork}>
                {!normalizedNow.artwork ? (
                  <div className={styles.artworkSkeleton}>
                    <Disc3 size={48} className={styles.skeletonIcon} />
                  </div>
                ) : (
                  <Image
                    src={normalizedNow.artwork}
                    alt={`${normalizedNow.track} by ${normalizedNow.artist}`}
                    fill
                    priority
                    sizes="100vw"
                    className={styles.image}
                  />
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className={styles.metaZone}>
              <div className={styles.trackTitleWrap}>
                <h3 className={styles.track}>{normalizedNow.track}</h3>
              </div>
              <div className={styles.artistRow}>
                <p className={styles.artist}>{normalizedNow.artist}</p>
                <div className={`${styles.soundBars} ${isPlaying ? styles.playing : ''}`} aria-hidden="true">
                  <span /><span /><span />
                </div>
              </div>
            </div>

            {/* Show Card (If exists) */}
            {(showData.title || showData.timeLabel) && (
              <div className={styles.showCard}>
                <div className={styles.showArt}>
                  {!showData.artwork ? (
                    <div className={styles.showArtSkeleton}>
                       <Radio size={20} className={styles.skeletonIcon} />
                    </div>
                  ) : (
                    <Image
                      src={showData.artwork}
                      alt={showData.title || 'Show'}
                      width={56}
                      height={56}
                      className={styles.showImage}
                    />
                  )}
                </div>
                <div className={styles.showMeta}>
                  <div className={styles.showEyebrow}>{showData.isLive ? 'ON AIR NOW' : 'UP NEXT'}</div>
                  <div className={styles.showTitle}>{showData.title}</div>
                  {showData.timeLabel && <div className={styles.showTime}>{showData.timeLabel}</div>}
                </div>
              </div>
            )}

            {/* Recent History */}
            <div className={styles.historyZone}>
              <div className={styles.sectionHeader}>
                <Clock size={16} className={styles.sectionIcon} />
                <span className={styles.sectionTitle}>
                  {showData.isLive ? 'RECENTLY PLAYED' : 'LAST 5 TRACKS'}
                </span>
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
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  )
}