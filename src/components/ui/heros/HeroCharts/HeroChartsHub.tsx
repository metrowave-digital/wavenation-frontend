import React from 'react'
import Image from 'next/image'
import { Activity, BarChart2, Cpu, Globe } from 'lucide-react'
import styles from './HeroChartsHub.module.css'

interface HeroChartsHubProps {
  eyebrow?: string
  title: string
  description: string
  lastUpdated?: string
}

export function HeroChartsHub({
  eyebrow = 'WAVENATION CHARTS',
  title,
  description,
  lastUpdated = 'LIVE_SYNC'
}: HeroChartsHubProps) {
  return (
    <section className={styles.root}>
      {/* Background Visuals */}
      <div className={styles.bgWrapper}>
        <Image 
          src="/images/charts/charts-bg.jpg" // Add a cool data/concert background here
          alt="Charts Background" 
          fill 
          className={styles.bgImage} 
          priority 
        />
        <div className={styles.overlayGradient} />
        <div className={styles.gridTexture} aria-hidden="true" />
      </div>

      <div className={styles.container}>
        {/* Left: Command Deck Text */}
        <div className={styles.dataColumn}>
          <div className={styles.sysBreadcrumb}>
            <Cpu size={12} className={styles.sysIcon} />
            <span>WN.SYSTEM {'//'} ANALYTICS_CORE</span>
            <span className={styles.blinkingDot} />
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>{eyebrow.toUpperCase()}</span>
            <h1 className={styles.titleMain}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </header>

          <div className={styles.liveTelemetry}>
            <Globe size={14} className={styles.dimIcon} />
            <div className={styles.telemetryData}>
              <span className={styles.tLabel}>DATABASE_STATE</span>
              <span className={styles.tValue}>
                {lastUpdated} {'//'} <span className={styles.tHighlight}>OPTIMAL</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Abstract Data Visualizer */}
        <div className={styles.visualColumn}>
          <div className={styles.hudPanel}>
            <div className={styles.hudHeader}>
              <BarChart2 size={14} className={styles.hudIcon} />
              <span>LIVE_INDEXING</span>
            </div>
            <div className={styles.chartBars}>
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={styles.bar} 
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    animationDelay: `${i * 0.1}s`
                  }} 
                />
              ))}
            </div>
            <div className={styles.hudFooter}>
              <span>CALCULATING VELOCITY</span>
              <Activity size={14} className={styles.pulse} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}