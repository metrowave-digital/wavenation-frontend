'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Calendar, MapPin, Radio } from 'lucide-react'
import { WNEvent } from '@/types/event'
import styles from './EventHomeFeature.module.css'

export default function EventHomeClient({ event }: { event: WNEvent }) {
  const isLive = event.status === 'live'
  const imageUrl = event.heroImage?.sizes?.hero?.url || event.heroImage?.url || ''
  
  return (
    <section className={`${styles.root} ${isLive ? styles.isLive : ''}`}>
      <div className={styles.container}>
        <div className={styles.monitorFrame}>
          {/* Background Image / Stream Static */}
          <div className={styles.mediaWrap}>
            <Image src={imageUrl} alt={event.title} fill className={styles.bgImage} />
            <div className={styles.vignette} />
            <div className={styles.scanlines} />
          </div>

          <div className={styles.content}>
            <header className={styles.header}>
              <div className={styles.signalBadge}>
                <span className={styles.pulse} />
                <p>{isLive ? 'SIGNAL ACTIVE // ON AIR' : 'TRANSMISSION UPCOMING'}</p>
              </div>
              <p className={styles.category}>{event.eventType?.toUpperCase()}</p>
            </header>

            <div className={styles.body}>
              <h2 className={styles.title}>{event.title}</h2>
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{new Date(event.startDate!).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
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
                <a href={event.ctaUrl} target="_blank" className={styles.secondaryBtn}>
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