'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tv, PlayCircle, MonitorPlay, Cast } from 'lucide-react'
import styles from './HeroCinema.module.css'

export interface HeroCinemaProps {
  title: string
  seriesTitle?: string
  description?: string
  image: string
  isLive?: boolean
  liveUrl?: string
  seriesUrl?: string
}

export function HeroCinema({
  title,
  seriesTitle,
  description,
  image,
  isLive = false,
  liveUrl = '/tv/live',
  seriesUrl
}: HeroCinemaProps) {
  return (
    <section className={styles.root}>
      {/* Cinematic Poster Background */}
      <div className={styles.bgWrapper}>
        <Image 
          src={image} 
          alt={title} 
          fill 
          className={styles.bgImage} 
          priority 
        />
        <div className={styles.vignette} />
      </div>

      <div className={styles.container}>
        {/* Left: Metadata Readout */}
        <div className={styles.metaColumn}>
          <div className={styles.sysBreadcrumb}>
            <Cast size={12} className={styles.sysIcon} />
            <span>WN.WATCH // VIDEO_SIGNAL // ACQUIRED</span>
          </div>

          <header className={styles.header}>
            {isLive && (
              <div className={styles.liveBadge}>
                <MonitorPlay size={14} className={styles.pulse} />
                <span>LIVE TV</span>
              </div>
            )}
            
            {seriesTitle && (
              <span className={styles.seriesTitle}>{seriesTitle.toUpperCase()}</span>
            )}
            <h1 className={styles.title}>{title}</h1>
          </header>

          {description && (
            <p className={styles.description}>{description}</p>
          )}

          <div className={styles.actions}>
            {isLive ? (
              <Link href={liveUrl} className={styles.primaryBtn}>
                <PlayCircle size={18} fill="#000" color="#000" />
                <span>START SCREENING</span>
              </Link>
            ) : seriesUrl ? (
              <Link href={seriesUrl} className={styles.secondaryBtn}>
                SEE ALL EPISODES
              </Link>
            ) : null}
          </div>
        </div>

        {/* Right: Technical Stats HUD */}
        <aside className={styles.techPanel}>
          <div className={styles.statBox}>
            <span className={styles.sLabel}>FORMAT</span>
            <span className={styles.sValue}>4K_UHD</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.sLabel}>AUDIO</span>
            <span className={styles.sValue}>SPATIAL // ATMOS</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.sLabel}>SOURCE</span>
            <span className={styles.sValue}>WN_ORIGINAL</span>
          </div>
        </aside>
      </div>
    </section>
  )
}