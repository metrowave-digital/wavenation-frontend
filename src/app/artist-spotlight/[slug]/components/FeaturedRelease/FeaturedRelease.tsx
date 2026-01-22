'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './FeaturedRelease.module.css'

/* ======================================================
   Types (API-safe)
====================================================== */

export interface Album {
  title: string
  slug: string
  primaryArtist: string
  releaseDate?: string | null
  coverArt?: {
    url: string
    alt?: string | null
  } | null
  tracks?: {
    id: string
    title: string
    artist?: string | null
  }[] | null
}

interface Props {
  album?: Album | null
}

/* ======================================================
   Helpers
====================================================== */

function formatDate(date?: string | null) {
  if (!date || Number.isNaN(Date.parse(date))) return null

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/* ======================================================
   Component
====================================================== */

export function FeaturedRelease({ album }: Props) {
  if (!album) return null

  const date = formatDate(album.releaseDate)

  return (
    <aside
      className={styles.root}
      aria-label="Featured music release"
    >
      {/* ===============================
         Album Card
      =============================== */}
      <Link
        href={`/releases/${album.slug}`}
        className={styles.card}
      >
        {album.coverArt?.url && (
          <Image
            src={album.coverArt.url}
            alt={album.coverArt.alt ?? album.title}
            width={300}
            height={300}
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 280px,
              300px
            "
            className={styles.cover}
          />
        )}

        <div className={styles.meta}>
          <span className={styles.eyebrow}>
            Featured Release
          </span>

          <h3 className={styles.title}>
            {album.title}
          </h3>

          <span className={styles.artist}>
            {album.primaryArtist}
          </span>

          {date && (
            <span className={styles.date}>
              Released {date}
            </span>
          )}
        </div>
      </Link>

      {/* ===============================
         Track List (Preview)
      =============================== */}
      {album.tracks && album.tracks.length > 0 && (
        <ol className={styles.tracks}>
          {album.tracks.slice(0, 6).map((track, index) => (
            <li key={track.id} className={styles.track}>
              <span className={styles.trackIndex}>
                {index + 1}
              </span>

              <div className={styles.trackMeta}>
                <span className={styles.trackTitle}>
                  {track.title}
                </span>

                {track.artist && (
                  <span className={styles.trackArtist}>
                    {track.artist}
                  </span>
                )}
              </div>
            </li>
          ))}

          {album.tracks.length > 6 && (
            <li className={styles.more}>
              + {album.tracks.length - 6} more tracks
            </li>
          )}
        </ol>
      )}
    </aside>
  )
}
