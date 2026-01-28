'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ArtistSpotlightHero.module.css'
import { trackEvent } from '@/lib/analytics'

/* ======================================================
   Types
====================================================== */

type MediaImage = {
  url: string
  alt?: string
}

type ArtistSpotlight = {
  artistName: string
  image?: MediaImage
}

type FeaturedArtist = {
  id: number
  slug: string
  title: string
  subtitle?: string
  artistSpotlight: ArtistSpotlight
}

/* ======================================================
   Component
====================================================== */

export function ArtistSpotlightHero() {
  const [artists, setArtists] = useState<FeaturedArtist[]>([])
  const tracked = useRef(false)

  /* ----------------------------------
     Fetch featured artists (up to 3)
  ---------------------------------- */

  useEffect(() => {
    fetch('/api/featured-artists', { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : []))
      .then((json: FeaturedArtist[]) => {
        if (Array.isArray(json)) {
          setArtists(json.slice(0, 3))
        }
      })
  }, [])

  /* ----------------------------------
     Impression tracking
  ---------------------------------- */

  useEffect(() => {
    if (!artists.length || tracked.current) return

    trackEvent('content_impression', {
      placement: 'artist_spotlight_hero',
      page: 'home',
      artists: artists.map(a => a.artistSpotlight.artistName),
    })

    tracked.current = true
  }, [artists])

  if (!artists.length) return null

  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        {artists.map((artist, index) => {
          const spotlight = artist.artistSpotlight

          return (
            <Link
              key={artist.id}
              href={`/artist-spotlight/${artist.slug}`}
              className={`${styles.card} ${index === 0 ? styles.primary : ''}`}
              onClick={() =>
                trackEvent('hero_click', {
                  placement: 'artist_spotlight_hero',
                  page: 'home',
                  artist: spotlight.artistName,
                  slug: artist.slug,
                  position: index + 1,
                })
              }
            >
              {/* IMAGE */}
              {spotlight.image?.url && (
                <div className={styles.imageWrap}>
                  <Image
                    src={spotlight.image.url}
                    alt={spotlight.image.alt || spotlight.artistName}
                    fill
                    priority={index === 0}
                    className={styles.image}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
              )}

              {/* OVERLAY */}
              <div className={styles.overlay}>
                <div className={styles.content}>
                  <span className={styles.kicker}>Artist Spotlight</span>
                  <h2 className={styles.name}>
                    {spotlight.artistName}
                  </h2>

                  {artist.subtitle && (
                    <p className={styles.subtitle}>{artist.subtitle}</p>
                  )}

                  <span className={styles.cta}>Read Feature →</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
