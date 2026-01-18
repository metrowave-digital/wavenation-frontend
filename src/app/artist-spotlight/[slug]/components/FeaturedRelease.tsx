'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../ArtistSpotlight.module.css'
import { trackEvent } from '@/lib/analytics'

/* ======================================================
   Types
====================================================== */

interface AlbumCoverArt {
  url: string
}

interface FeaturedAlbum {
  id: string
  title: string
  releaseDate?: string | null
  coverArt: AlbumCoverArt
}

/* ======================================================
   Component
====================================================== */

export function FeaturedRelease({
  artist,
}: {
  artist: string
}) {
  const [album, setAlbum] =
    useState<FeaturedAlbum | null>(null)

  useEffect(() => {
    let active = true

    fetch(
      `/api/albums?where[primaryArtist][equals]=${artist}&where[isFeaturedRelease][equals]=true&limit=1`
    )
      .then((r) => r.json())
      .then((data: { docs?: FeaturedAlbum[] }) => {
        if (!active) return
        setAlbum(data?.docs?.[0] ?? null)
      })
      .catch(() => {
        if (active) setAlbum(null)
      })

    return () => {
      active = false
    }
  }, [artist])

  if (!album) return null

  return (
    <div
      className={styles.featuredRelease}
      onClick={() =>
        trackEvent('content_click', {
          placement:
            'artist_spotlight_featured_release',
          id: album.id,
        })
      }
    >
      <span className={styles.badge}>
        Featured Release
      </span>

      <Image
        src={album.coverArt.url}
        alt={album.title}
        width={120}
        height={120}
      />

      <div>
        <strong>{album.title}</strong>
        {album.releaseDate && (
          <span>
            {' '}
            ·{' '}
            {new Date(
              album.releaseDate
            ).getFullYear()}
          </span>
        )}
      </div>
    </div>
  )
}
