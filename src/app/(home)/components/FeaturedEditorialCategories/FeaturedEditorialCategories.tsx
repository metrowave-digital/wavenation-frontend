'use client'

import Link from 'next/link'
import { Headphones, Globe2, Clapperboard, Trophy, Cpu, ArrowUpRight } from 'lucide-react'
import styles from './FeaturedEditorialCategories.module.css'

// Added 'sysCode' so you can customize what appears after "SYS."
const desks = [
  { slug: 'music', sysCode: 'MUSIC', name: 'SOUND', icon: Headphones, color: '#00F0FF', desc: 'The sonic blueprint of urban culture.' },
  { slug: 'culture-and-politics', sysCode: 'POLITICS', name: 'PULSE', icon: Globe2, color: '#FF0055', desc: 'Social commentary and political shifts.' },
  { slug: 'film-and-tv', sysCode: 'FILM&TV', name: 'VISION', icon: Clapperboard, color: '#B200FF', desc: 'Cinematic storytelling and visual arts.' },
  { slug: 'sports', sysCode: 'SPORTS', name: 'ARENA', icon: Trophy, color: '#FF6600', desc: 'The intersection of competition and style.' },
  { slug: 'business-tech', sysCode: 'BUSINESS', name: 'CAPITAL', icon: Cpu, color: '#39FF14', desc: 'The industry engine and digital future.' },
]

export default function FeaturedEditorialCategories() {
  return (
    <section className={styles.section} aria-label="Editorial Desks">
      <div className={styles.container}>
        
        <header className={styles.header}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>OUR COVERAGE</span>
          </div>
          <h2 className={styles.title}>EDITORIAL DESKS</h2>
          <p className={styles.subtitle}>Select a category to filter the coverage feed.</p>
        </header>

        <div className={styles.deskGrid}>
          {desks.map((desk) => {
            const Icon = desk.icon
            return (
              <Link 
                key={desk.slug} 
                href={`/news/category/${desk.slug}`} 
                className={styles.deskCard}
                style={{ '--accent': desk.color } as React.CSSProperties}
              >
                {/* Tech Grid & Scanline Backgrounds */}
                <div className={styles.gridOverlay} />
                <div className={styles.scanlines} />
                
                <div className={styles.cardContent}>
                  <div className={styles.topRow}>
                    <div className={styles.iconWrap}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div className={styles.statusGroup}>
                      {/* Hardcoded 'SYS.' followed by your custom sysCode selection */}
                      <span className={styles.deskIndex}>SYS.{desk.sysCode}</span>
                      <div className={styles.statusDot} />
                    </div>
                  </div>
                  
                  <div className={styles.midRow}>
                    <h3 className={styles.deskName}>{desk.name}</h3>
                    <p className={styles.deskDesc}>{desk.desc}</p>
                  </div>
                  
                  <div className={styles.footerRow}>
                    <span className={styles.accessLink}>ACCESS FEED</span>
                    <ArrowUpRight size={18} className={styles.arrowIcon} />
                  </div>
                </div>
                
                {/* Visual Enhancements */}
                <div className={styles.glow} />
                <div className={styles.cornerBracket} />
                <div className={styles.accentBar} />
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}