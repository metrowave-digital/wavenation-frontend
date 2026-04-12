'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mic2, Radio, Clock, Activity, Headphones, Fingerprint } from 'lucide-react'
import styles from './HeroTalent.module.css'

export interface HeroTalentProps {
  name: string
  kicker?: string
  bioExcerpt?: string
  showName?: string
  schedule?: string
  status?: 'LIVE_NOW' | 'OFF_AIR' | 'SYNDICATED'
  imageUrl?: string
  accentColor?: string
  primaryCtaText?: string
  primaryCtaHref?: string
}

export function HeroTalent({
  name,
  kicker = 'ON-AIR PERSONALITY',
  bioExcerpt,
  showName = 'CLASSIFIED_TRANSMISSION',
  schedule = 'DATA GATHERING...',
  status = 'OFF_AIR',
  imageUrl = '/images/talent/default-talent.jpg',
  accentColor = '#B026FF', // Electric Purple Default
  primaryCtaText = 'TUNE IN LIVE',
  primaryCtaHref = '/radio/live'
}: HeroTalentProps) {
  const isLive = status === 'LIVE_NOW'

  return (
    <section className={styles.root}>
      {/* Broadcast Wave Background */}
      <div className={styles.bgGlow} style={{ backgroundImage: `radial-gradient(circle at 70% 50%, rgba(176, 38, 255, 0.1) 0%, transparent 60%)` }} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />
      
      <div className={styles.container}>
        {/* Left: The "Broadcast ID" Visual */}
        <div className={styles.visualColumn}>
          <div className={styles.imageFrame} style={{ borderColor: accentColor }}>
            <Image 
              src={imageUrl} 
              alt={name} 
              fill 
              className={styles.talentImage} 
              priority 
            />
            {/* Corner Bracket Accents */}
            <div className={styles.frameCornerTopLeft} style={{ borderColor: accentColor }} />
            <div className={styles.frameCornerBottomRight} style={{ borderColor: accentColor }} />
            
            {/* Live Status Indicator */}
            <div 
              className={styles.statusPill} 
              style={{ 
                color: isLive ? '#000' : accentColor,
                backgroundColor: isLive ? accentColor : 'rgba(0,0,0,0.8)'
              }}
            >
              {isLive ? <Radio size={12} className={styles.pulse} /> : <Activity size={12} />}
              {status.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Right: The Data Readout */}
        <div className={styles.dataColumn}>
          <div className={styles.sysBreadcrumb}>
            <Fingerprint size={14} className={styles.dimIcon} />
            <span>WN.NETWORK {'//'} {kicker.toUpperCase()}</span>
          </div>

          <h1 className={styles.talentName}>{name}</h1>
          
          {bioExcerpt && (
            <p className={styles.bio}>{bioExcerpt}</p>
          )}

          {/* Broadcast Telemetry Grid */}
          <div className={styles.telemetryGrid}>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}><Mic2 size={12} /> PRIMARY SHOW</span>
              <span className={styles.dataValue}>{showName.toUpperCase()}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}><Clock size={12} /> BROADCAST SCHEDULE</span>
              <span className={styles.dataValue}>{schedule.toUpperCase()}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link 
              href={primaryCtaHref} 
              className={styles.primaryBtn} 
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              <Headphones size={18} />
              <span className={styles.btnText}>{primaryCtaText.toUpperCase()}</span>
            </Link>
            
            <Link href="#episodes" className={styles.secondaryBtn}>
              ARCHIVED TRANSMISSIONS
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}