'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Radio } from 'lucide-react'
import { WNEvent } from '@/types/event'
import styles from './EventHomeFeature.module.css'

export default function EventHomeClient({ event }: { event: WNEvent }) {
  const isLive = event.status === 'live'
  
  // Safely fallback to an empty string or a default placeholder image
  const imageUrl = event.heroImage?.sizes?.hero?.url || event.heroImage?.url || '/images/fallback-event.jpg'
  
  return (
    <section className={`${styles.root} ${isLive ? styles.isLive : ''}`}>
      <div className={styles.container}>
        <div className={styles.monitorFrame}>
          
          {/* Background Image / Stream Static */}
          <div className={styles.mediaWrap}>
            {imageUrl && (
              <Image 
                src={imageUrl} 
                alt={event.title || 'WaveNation Event'} 
                fill 
                priority // Ensures this loads fast as a hero element
                sizes="(max-width: 1400px) 100vw, 1400px" // Optimizes bandwidth
                className={styles.bgImage} 
              />
            )}
            <div className={styles.vignette} />
            <div className={styles.scanlines} />
          </div>

          <div className={styles.content}>
            <header className={styles.header}>
              <div className={styles.signalBadge}>
                <span className={styles.pulse} />
                <p>{isLive ? 'SIGNAL ACTIVE // ON AIR' : 'TRANSMISSION UPCOMING'}</p>
              </div>
              {event.eventType && (
                <p className={styles.category}>{event.eventType.toUpperCase()}</p>
              )}
            </header>

            <div className={styles.body}>
              <h2 className={styles.title}>{event.title}</h2>
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>
                    {event.startDate 
                      ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) 
                      : 'TBA'}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={16} />
                  <span>{event.venue?.name || 'GLOBAL TERMINAL'}</span>
                </div>
              </div>
            </div>

            <footer className={styles.footer}>
              {isLive ? (
                <Link href={`/events/${event.slug}/live`} className={styles.primaryBtn}>
                  <Radio size={20} /> TUNE IN NOW
                </Link>
              ) : (
                <Link href={`/events/${event.slug}`} className={styles.primaryBtn}>
                  VIEW DOSSIER
                </Link>
              )}
              {event.ctaUrl && !isLive && (
                <a 
                  href={event.ctaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" // Security best practice for external links
                  className={styles.secondaryBtn}
                >
                  GET TICKETS
                </a>
              )}
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}