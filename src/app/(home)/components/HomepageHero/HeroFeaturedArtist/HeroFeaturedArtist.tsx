'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './HeroFeaturedArtist.module.css'

type FeaturedArtistResponse = {
  slug: string
  artistSpotlight: {
    artistName: string
    image?: { url: string; alt?: string }
  }
}

export function HeroFeaturedArtist() {
  const [data, setData] = useState<FeaturedArtistResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/featured-artist-hero', { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then((json: FeaturedArtistResponse | null) => {
        if (json?.slug && json?.artistSpotlight?.artistName) {
          setData(json)
        }
      })
      .catch(err => console.error('Failed to fetch artist spotlight:', err))
      .finally(() => setLoading(false))
  }, [])

  // ==========================================
  // SKELETON LOADER STATE
  // ==========================================
  if (loading) {
    return (
      <div className={`${styles.billboard} ${styles.skeletonCard}`}>
        <div className={styles.imageWrap}>
          <div className={styles.skelImageBg} />
          <div className={styles.scanlines} />
          <div className={styles.vignette} />
        </div>
        <div className={styles.overlay}>
          <div className={styles.content}>
            <div className={styles.headerRow}>
              <div className={styles.skelKicker} />
            </div>
            <div className={styles.skelName} />
            <div className={styles.footerRow}>
              <div className={styles.skelExplore} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // LOADED STATE
  // ==========================================
  if (!data) return null

  const { slug, artistSpotlight } = data

  return (
    <Link href={`/artist-spotlight/${slug}`} className={styles.billboard}>
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className={styles.imageWrap}>
        <div className={styles.imageContainer}>
          {artistSpotlight.image?.url ? (
            <Image
              src={artistSpotlight.image.url}
              alt={artistSpotlight.image.alt || artistSpotlight.artistName}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className={styles.image}
              priority
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>
        
        {/* Studio Monitor Effects */}
        <div className={styles.vignette} />
        <div className={styles.scanlines} />
      </div>

      {/* 2. GLASS CONTENT OVERLAY */}
      <div className={styles.overlay}>
        <div className={styles.content}>
          
          <div className={styles.headerRow}>
            <span className={styles.kicker}>THE SPOTLIGHT</span>
            <div className={styles.livePulse} />
          </div>
          
          <h3 className={styles.name}>{artistSpotlight.artistName}</h3>
          
          <div className={styles.footerRow}>
            <span className={styles.explore}>VIEW PROFILE &rarr;</span>
            <span className={styles.brandTag}>ARTIST</span>
          </div>

        </div>
      </div>

    </Link>
  )
}