'use client'

import Image from 'next/image'
import styles from './ArtistSpotlight.module.css'
import { Byline } from '../Byline/Byline'

import type { ContributorAuthor } from '../../types'

/* ======================================================
   Props
====================================================== */

interface Props {
  title: string
  subtitle?: string | null
  author?: ContributorAuthor | null
  publishDate?: string | null
  readingTime?: string | null
  image?: {
    url: string
    alt?: string | null
  }
}

/* ======================================================
   Component
====================================================== */

export function ArtistSpotlightHero({
  title,
  subtitle,
  author,
  publishDate,
  readingTime,
  image,
}: Props) {
  return (
    <header className={styles.hero} role="banner">
      {/* ===============================
         Media (Cinematic)
      =============================== */}
      {image?.url && (
        <div className={styles.mediaWrap}>
          <Image
            src={image.url}
            alt={image.alt ?? title}
            fill
            priority
            sizes="100vw"
            className={styles.media}
          />

          {/* Gradient overlay */}
          <div className={styles.overlay} />
        </div>
      )}

      {/* ===============================
         Editorial Content
      =============================== */}
      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          Artist Spotlight
        </span>

        <h1 className={styles.title}>
          {title}
        </h1>

        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}

        {author && (
          <div className={styles.bylineWrap}>
            <Byline
              author={author}
              publishDate={publishDate}
              readingTime={readingTime}
            />
          </div>
        )}
      </div>
    </header>
  )
}
