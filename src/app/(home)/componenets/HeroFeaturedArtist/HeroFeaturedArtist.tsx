'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ArtistSpotlightCard.module.css'
import { trackEvent } from '@/lib/analytics'
import { HeroFeaturedArtistSkeleton } from './HeroFeaturedArtistSkeleton'

/* ======================================================
   Types (API-aligned)
====================================================== */

type MediaImage = {
  url: string
  alt?: string
}

type ArtistSpotlight = {
  artistName: string
  image?: MediaImage
}

type FeaturedArtistResponse = {
  slug: string
  artistSpotlight: ArtistSpotlight
}

/* ======================================================
   Component
====================================================== */

export function HeroFeaturedArtist() {
  const [data, setData] = useState<FeaturedArtistResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const tracked = useRef(false)

  /* ----------------------------------
     Fetch featured artist
  ---------------------------------- */

  useEffect(() => {
    fetch('/api/featured-artist-hero', { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then((json: FeaturedArtistResponse | null) => {
        if (json?.slug && json?.artistSpotlight?.artistName) {
          setData(json)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  /* ----------------------------------
     Impression tracking
  ---------------------------------- */

  useEffect(() => {
    if (!data || tracked.current) return

    trackEvent('content_impression', {
      placement: 'right_rail_featured_artist',
      page: 'home',
      artist: data.artistSpotlight.artistName,
      slug: data.slug,
    })

    tracked.current = true
  }, [data])

  if (loading) return <HeroFeaturedArtistSkeleton />
  if (!data) return null

  const { slug, artistSpotlight } = data

  return (
    <Link
      href={`/artist-spotlight/${slug}`}
      className={styles.billboard}
      onClick={() =>
        trackEvent('hero_click', {
          placement: 'right_rail_featured_artist',
          page: 'home',
          artist: artistSpotlight.artistName,
          slug,
        })
      }
    >
      {/* IMAGE */}
      {artistSpotlight.image?.url && (
        <div className={styles.imageWrap}>
          <Image
            src={artistSpotlight.image.url}
            alt={artistSpotlight.image.alt || artistSpotlight.artistName}
            fill
            className={styles.image}
            sizes="(max-width: 1024px) 100vw, 320px"
            priority
            unoptimized
          />
        </div>
      )}

      {/* OVERLAY */}
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.kicker}>Artist Spotlight</span>
          <h3 className={styles.name}>{artistSpotlight.artistName}</h3>
          <span className={styles.explore}>Explore →</span>
        </div>
      </div>
    </Link>
  )
}
