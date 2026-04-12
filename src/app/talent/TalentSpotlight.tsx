'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Talent } from './talent.types'
import styles from './TalentPage.module.css'

export function TalentSpotlight({ allTalent }: { allTalent: Talent[] }) {
  const [index, setIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  const spotlightPool = useMemo(() => {
    const featured = allTalent.filter(t => t.isFeatured)
    return featured.length > 0 ? featured : allTalent
  }, [allTalent])

  useEffect(() => {
    if (spotlightPool.length <= 1) return

    const timer = setInterval(() => {
      setIsFading(true) // Trigger fade out
      
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % spotlightPool.length)
        setIsFading(false) // Trigger fade in with new data
      }, 500) // Wait half a second while opacity is 0 to swap data
      
    }, 8000)

    return () => clearInterval(timer)
  }, [spotlightPool])

  const current = spotlightPool[index]
  if (!current) return null

  return (
    <div className={styles.spotlightContainer}>
      <div className={styles.spotlightDecor}>FEATURED TALENT</div>
      
      {/* Applying the fade animation to the INNER content so the box doesn't vanish */}
      <div className={`${styles.spotlightMain} ${isFading ? styles.fadeOutContent : styles.fadeInContent}`}>
        
        <div className={styles.spotlightContent}>
          <div className={styles.badgeRow}>
            <span className={styles.onAirBadge}>ON AIR</span>
            <span className={styles.categoryBadge}>{current.role || 'HOST'}</span>
          </div>
          
          <h2 className={styles.featuredName}>{current.displayName}</h2>
          <p className={styles.featuredBio}>{current.shortBio}</p>
          
          <Link href={`/talent/${current.slug}`} className={styles.primaryButton}>
            <span>View Full Profile</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </Link>
        </div>
        
        <div className={styles.spotlightImageWrapper}>
          <div className={styles.imageGlow} />
          {current.mediaAssets?.headshot?.url ? (
            <div className={styles.imageContainer}>
              <Image 
                key={current.id} // Forces Next.js to treat this as a new image during transition
                src={current.mediaAssets.headshot.url}
                alt={current.displayName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className={styles.featuredImg}
              />
            </div>
          ) : (
            <div className={styles.cardPlaceholder}>
               <span>{current.displayName.charAt(0)}</span>
            </div>
          )}
          {/* Studio Monitor Effect */}
          <div className={styles.scanlines} />
          <div className={styles.vignette} />
        </div>

      </div>
    </div>
  )
}