import React from 'react'
import Image from 'next/image'
import { ChevronDown, Play, Crosshair, Fingerprint } from 'lucide-react'
import styles from './HeroEditorialFeature.module.css'

export interface HeroEditorialFeatureProps {
  sysLabel?: string
  title: string
  subtitle?: string
  bgImage?: string
  trailerUrl?: string
}

export function HeroEditorialFeature({
  sysLabel = 'WN.ORIGINALS // SPOTLIGHT',
  title,
  subtitle,
  bgImage = '/images/news/feature-bg.jpg',
  trailerUrl
}: HeroEditorialFeatureProps) {
  const titleWords = title.split(' ')

  return (
    <section className={styles.root}>
      {/* Background */}
      <div className={styles.bgWrapper}>
        <Image src={bgImage} alt={title} fill className={styles.bgImage} priority />
        <div className={styles.overlayVignette} />
        <div className={styles.gridTexture} aria-hidden="true" />
      </div>

      {/* Top Telemetry HUD */}
      <header className={styles.topHud}>
        <div className={styles.sysRow}>
          <Fingerprint size={16} className={styles.hudIcon} />
          <span className={styles.sysLabel}>{sysLabel.toUpperCase()}</span>
        </div>
        <div className={styles.techReadout}>
          <span>RES: 4K_UHD</span>
          <span className={styles.separator}>{'//'}</span>
          <span>AUDIO: SPATIAL</span>
          <span className={styles.separator}>{'//'}</span>
          <span className={styles.statusBlink}>STATUS: ENCRYPTED</span>
        </div>
      </header>

      {/* Titles & Actions */}
      <div className={styles.contentHUD}>
        <div className={styles.titleBlock}>
          <h1 className={styles.featureTitle}>
            {titleWords.map((word, index) => (
              <span key={index} className={styles.titleWord}>{word}</span>
            ))}
          </h1>
          
          {subtitle && (
            <div className={styles.subtitleGlass}>
              <Crosshair size={14} className={styles.targetIcon} />
              <p className={styles.subtitle}>{subtitle}</p>
            </div>
          )}
        </div>

        <div className={styles.actionBlock}>
          {trailerUrl && (
            <a href={trailerUrl} className={styles.watchBtn}>
              <div className={styles.playRing}>
                <Play size={18} fill="currentColor" className={styles.playIcon} />
              </div>
              <div className={styles.btnText}>
                <span className={styles.btnPrimary}>INITIALIZE TRAILER</span>
                <span className={styles.btnSecondary}>SECURE CONNECTION</span>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>SCROLL TO DECRYPT</span>
        <ChevronDown size={14} className={styles.bounce} />
      </div>
    </section>
  )
}