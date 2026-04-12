'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Ticket, Layers3 } from 'lucide-react'
import styles from './HeroEvents.module.css'

export interface HeroEventsProps {
  eventName: string
  dateKicker?: string
  dateRange: string
  location: string
  description?: string
  lineupEyebrow?: string
  lineup?: string[] // Max 4 or 5 headliners
  imageUrl: string
  primaryCtaText?: string
  primaryCtaHref?: string
}

export function HeroEvents({
  eventName,
  dateKicker = 'NEXT TRANSMISSION',
  dateRange,
  location,
  description,
  lineupEyebrow = 'FEATURING SIGNAL FROM',
  lineup,
  imageUrl,
  primaryCtaText = 'ACQUIRE TICKETS',
  primaryCtaHref = '/tickets'
}: HeroEventsProps) {
  return (
    <section className={styles.root}>
      {/* Background Cinematic */}
      <div className={styles.bgWrapper}>
        <Image 
          src={imageUrl} 
          alt={eventName} 
          fill 
          className={styles.bgImage} 
          priority 
        />
        <div className={styles.overlayGradient} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.container}>
        {/* Left: Event Identity */}
        <div className={styles.dataColumn}>
          <div className={styles.sysBreadcrumb}>
            <CalendarDays size={12} className={styles.sysIcon} />
            <span>WN.EVENTS // LIVE_GRID // ACQUISITION</span>
          </div>

          <header className={styles.header}>
            <div className={styles.dateKickerRow}>
              <div className={styles.blinkingDot} />
              <span>{dateKicker.toUpperCase()}</span>
            </div>
            <h1 className={styles.eventName}>{eventName}</h1>
          </header>
          
          {description && (
            <p className={styles.description}>{description}</p>
          )}

          <div className={styles.actions}>
            <Link href={primaryCtaHref} className={styles.primaryBtn}>
              <Ticket size={18} fill="#000" color="#000" />
              <span>{primaryCtaText.toUpperCase()}</span>
            </Link>
          </div>
        </div>

        {/* Right: Telemetry & Lineup Bento */}
        <aside className={styles.bentoHUD}>
          {/* Key Logistics */}
          <div className={styles.logisticsPanel}>
            <div className={styles.dataBlock}>
              <span className={styles.sLabel}><Layers3 size={12} /> DATES</span>
              <span className={styles.sValue}>{dateRange.toUpperCase()}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.sLabel}><MapPin size={12} /> LOCATION</span>
              <span className={styles.sValue}>{location.toUpperCase()}</span>
            </div>
          </div>

          {/* Lineup Block */}
          {lineup && lineup.length > 0 && (
            <div className={styles.lineupPanel}>
              <span className={styles.lLabel}>{lineupEyebrow.toUpperCase()}</span>
              <div className={styles.lineupGrid}>
                {lineup.map((headliner, idx) => (
                  <span key={idx} className={styles.headliner}>{headliner.toUpperCase()}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}