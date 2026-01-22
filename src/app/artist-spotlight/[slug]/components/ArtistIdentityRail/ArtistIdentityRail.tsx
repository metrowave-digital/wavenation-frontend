'use client'

import Image from 'next/image'
import styles from './ArtistIdentityRail.module.css'
import { FeaturedRelease } from '../FeaturedRelease/FeaturedRelease'

/* ======================================================
   Types (API-aligned)
====================================================== */

interface Album {
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

interface Show {
  title: string
  slug: string
  isPodcast?: boolean
  coverArt?: {
    url: string
    alt?: string | null
  } | null
}

/* ======================================================
   Props
====================================================== */

interface Props {
  album?: Album | null
  show?: Show | null
  children?: React.ReactNode
}

/* ======================================================
   Component
====================================================== */

export function ArtistIdentityRail({
  album,
  show,
  children,
}: Props) {
  if (!album && !show && !children) return null

  return (
    <aside
      className={styles.rail}
      aria-label="Artist identity and context"
    >
      {/* ===============================
         FEATURED RELEASE (PRIMARY)
      =============================== */}
      {album && (
        <section className={styles.block}>
          <FeaturedRelease album={album} />
        </section>
      )}

      {/* ===============================
         RELATED SHOW
      =============================== */}
      {show && (
        <section className={styles.block}>
          <span className={styles.eyebrow}>
            Related Show
          </span>

          <div className={styles.show}>
            {show.coverArt?.url && (
              <Image
                src={show.coverArt.url}
                alt={show.coverArt.alt ?? show.title}
                width={56}
                height={56}
                className={styles.showArt}
              />
            )}

            <div className={styles.showMeta}>
              <p className={styles.title}>
                {show.title}
              </p>

              {show.isPodcast && (
                <span className={styles.meta}>
                  Podcast
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===============================
         CHILD CONTENT (TOC, ADS, ETC.)
      =============================== */}
      {children && (
        <section className={styles.block}>
          {children}
        </section>
      )}
    </aside>
  )
}
