'use client'

import { useEffect } from 'react'
import Image from 'next/image'

import styles from './ArtistSpotlight.module.css'

import { ContentRenderer } from '@/components/content/ContentRenderer'
import type { ContentBlock } from '@/components/content/types'
import { NewsletterCta } from '@/components/newsletter/NewsletterCTA'
import { trackPageView } from '@/lib/analytics'

import { IdentityRail } from './components/ArtistIdentityRail'
import { FeaturedRelease } from './components/FeaturedRelease'

/* ======================================================
   Types
====================================================== */

interface HeroImage {
  url: string
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null }
  }
}

interface Author {
  displayName?: string | null
}

interface ArtistSpotlightArticle {
  slug: string
  title: string
  subtitle?: string | null
  publishDate?: string | null
  author?: Author
  hero?: {
    image?: HeroImage
  }
  contentBlocks?: ContentBlock[]
}

/* ======================================================
   Component
====================================================== */

export default function ArtistSpotlightClient({
  article,
}: {
  article: ArtistSpotlightArticle
}) {
  useEffect(() => {
    if (!article.slug) return
    trackPageView(`/artist-spotlight/${article.slug}`)
  }, [article.slug])

  const hero = article.hero?.image

  return (
    <article className={styles.root}>
      {/* ===============================
         HERO
      =============================== */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            Artist Spotlight
          </span>

          <h1>{article.title}</h1>

          {article.subtitle && (
            <p className={styles.subtitle}>
              {article.subtitle}
            </p>
          )}

          <div className={styles.meta}>
            {article.author?.displayName}
            {article.publishDate && (
              <>
                {' '}
                ·{' '}
                {new Date(
                  article.publishDate
                ).toDateString()}
              </>
            )}
          </div>
        </div>

        {hero?.url && (
          <figure className={styles.heroImage}>
            <Image
              src={
                hero.sizes?.hero?.url ??
                hero.url
              }
              alt={hero.alt ?? article.title}
              width={800}
              height={1200}
              priority
            />
          </figure>
        )}
      </section>

      {/* ===============================
         IDENTITY + FEATURED RELEASE
      =============================== */}
      <aside className={styles.identityRow}>
        <IdentityRail
          heritage="Italian & Nigerian"
          genre="Soul / R&B"
          role="Singer-Songwriter · Scholar"
        />

        <FeaturedRelease
          artist={article.slug}
        />
      </aside>

      {/* ===============================
         AD SLOT
      =============================== */}
      <div className={styles.adSlot}>
        <span>Advertisement</span>
      </div>

      {/* ===============================
         CONTENT
      =============================== */}
      <section className={styles.content}>
        {article.contentBlocks?.length ? (
          <ContentRenderer
            blocks={article.contentBlocks}
          />
        ) : null}
      </section>

      <NewsletterCta />
    </article>
  )
}
