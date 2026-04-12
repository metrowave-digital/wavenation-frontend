import React from 'react'
import Image from 'next/image'
import { Play, MapPin, RadioReceiver, Activity, Fingerprint } from 'lucide-react'
import styles from './HeroArtistSpotlight.module.css'

export interface HeroArtistSpotlightProps {
  name: string
  kicker?: string
  bioExcerpt?: string
  location?: string
  genre?: string
  listeners?: string
  status?: string
  imageUrl?: string
  accentColor?: string
}

export function HeroArtistSpotlight({
  name,
  kicker = 'CREATOR DOSSIER',
  bioExcerpt,
  location = 'CLASSIFIED',
  genre = 'MULTI-GENRE',
  listeners = 'DATA GATHERING...',
  status = 'ACTIVE_SIGNAL',
  imageUrl = '/images/artists/default-artist.jpg',
  accentColor = '#39FF14' // Neon Green Default
}: HeroArtistSpotlightProps) {
  return (
    <section className={styles.root}>
      {/* Background Texture */}
      <div className={styles.bgTexture} aria-hidden="true" />
      
      <div className={styles.container}>
        {/* Left: The "ID Badge" Visual */}
        <div className={styles.visualColumn}>
          <div className={styles.imageFrame} style={{ borderColor: accentColor }}>
            <Image 
              src={imageUrl} 
              alt={name} 
              fill 
              className={styles.artistImage} 
              priority 
            />
            <div className={styles.frameCornerTopLeft} />
            <div className={styles.frameCornerBottomRight} />
            <div className={styles.statusPill} style={{ color: accentColor }}>
              <Activity size={12} className={styles.pulse} /> {status}
            </div>
          </div>
        </div>

        {/* Right: The Data Readout */}
        <div className={styles.dataColumn}>
          <div className={styles.sysBreadcrumb}>
            <Fingerprint size={14} className={styles.dimIcon} />
            <span>WN.NETWORK {'//'} {kicker}</span>
          </div>

          <h1 className={styles.artistName}>{name}</h1>
          
          {bioExcerpt && (
            <p className={styles.bio}>{bioExcerpt}</p>
          )}

          {/* Telemetry Grid */}
          <div className={styles.telemetryGrid}>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}><MapPin size={12} /> ORIGIN</span>
              <span className={styles.dataValue}>{location}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}><RadioReceiver size={12} /> PRIMARY GENRE</span>
              <span className={styles.dataValue}>{genre}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}><Activity size={12} /> MONTHLY REACH</span>
              <span className={styles.dataValue} style={{ color: accentColor }}>{listeners}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.playBtn} style={{ backgroundColor: accentColor }}>
              <Play size={18} fill="#000" color="#000" />
              <span className={styles.btnText}>INITIALIZE CATALOG</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}