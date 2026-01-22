'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './ArtistSpotlight.module.css'
import { trackEvent, trackPageView } from '@/lib/analytics'

import { ArtistSpotlightHero } from './components/SpotlightHero/ArtistSpotlightHero'
import { ContentBlocksRenderer } from './ContentBlocks/ContentBlocksRenderer'
import { NewsletterCta } from './components/NewsletterCTA/NewsletterCTA'
import { ReadingProgressRail } from './components/ReadingProgressRail/ReadingProgressRail'
import { MobileContents } from './components/MobileContents/MobileContents'
import { SpotlightMeta } from './components/SpotlightMeta/SpotlightMeta'
import { ArtistIdentityRail } from './components/ArtistIdentityRail/ArtistIdentityRail'
import { AdSlot } from './components/AdSlot/AdSlot'

import type {
  ArtistSpotlightArticle,
  ArticleAuthor,
  ContributorAuthor,
} from './types'

/* ======================================================
   Normalize ARTICLE USER → FALLBACK BYLINE AUTHOR
====================================================== */

function normalizeArticleAuthor(
  author: ArticleAuthor
): ContributorAuthor {
  const displayName =
    author.displayName?.trim() || 'Karesse Clemons'

  return {
    id: String(author.id),
    displayName,
    verified:
      author.roles?.includes('admin') ||
      author.roles?.includes('editor') ||
      author.roles?.includes('talent') ||
      false,
    avatar: author.avatar?.url
      ? {
          url:
            author.avatar.sizes?.square?.url ??
            author.avatar.url,
          alt: displayName,
        }
      : undefined,
    socials: [],
  }
}

/* ======================================================
   Rich Text Section Types
====================================================== */

interface RichTextSectionBlock {
  id: string
  blockType: 'richText'
  blockName?: string | null
}

interface Section {
  id: string
  label: string
}

/* ======================================================
   Type Guard
====================================================== */

function isRichTextSectionBlock(
  block: unknown
): block is RichTextSectionBlock {
  if (!block || typeof block !== 'object') return false

  const candidate = block as Partial<RichTextSectionBlock>

  return (
    candidate.blockType === 'richText' &&
    typeof candidate.id === 'string' &&
    typeof candidate.blockName === 'string' &&
    candidate.blockName.trim().length > 0
  )
}

/* ======================================================
   Component
====================================================== */

export default function ArtistSpotlightClient({
  article,
}: {
  article: ArtistSpotlightArticle
}) {
  /* -------------------------------
     Analytics: Page View
  ------------------------------- */
  useEffect(() => {
    if (!article.slug) return
    trackPageView(`/artist-spotlight/${article.slug}`)
  }, [article.slug])

  /* -------------------------------
     Analytics: Spotlight Impression
  ------------------------------- */
  const impressionFired = useRef(false)

  useEffect(() => {
    if (impressionFired.current) return
    impressionFired.current = true

    trackEvent('content_impression', {
      content_type: 'artist_spotlight',
      slug: article.slug,
      title: article.title,
      artist: article.relatedAlbum?.primaryArtist ?? null,
    })
  }, [article.slug, article.title, article.relatedAlbum])

  /* -------------------------------
     Hero Image
  ------------------------------- */
  const hero = article.hero?.image

  /* -------------------------------
     Analytics: Hero Impression
  ------------------------------- */
  useEffect(() => {
    if (!hero?.url) return

    trackEvent('hero_interaction', {
      type: 'impression',
      placement: 'artist_spotlight_hero',
      slug: article.slug,
    })
  }, [hero?.url, article.slug])

  /* -------------------------------
     Reading Sections
  ------------------------------- */
  const sections: Section[] = useMemo(() => {
    if (!Array.isArray(article.contentBlocks)) return []

    return article.contentBlocks
      .filter(isRichTextSectionBlock)
      .map((block, index) => ({
        id: block.id || `section-${index}`,
        label: block.blockName as string,
      }))
  }, [article.contentBlocks])

  /* -------------------------------
     Active Section
  ------------------------------- */
  const [activeSectionId, setActiveSectionId] =
    useState<string | null>(() =>
      sections.length ? sections[0].id : null
    )

  /* -------------------------------
     Analytics: Reading Complete
  ------------------------------- */
  function handleReadingComplete() {
    trackEvent('content_interaction', {
      action: 'read_complete',
      content_type: 'artist_spotlight',
      slug: article.slug,
    })
  }

  /* -------------------------------
     Author Resolution
  ------------------------------- */
  const author: ContributorAuthor | null =
    article.author
      ? normalizeArticleAuthor(article.author)
      : null

  return (
    <article className={styles.root}>
      {/* ===============================
         HERO
      =============================== */}
      <ArtistSpotlightHero
        title={article.title}
        subtitle={article.subtitle}
        author={author}
        publishDate={article.publishDate}
        readingTime={article.readingTime ?? null}
        image={
          hero?.url
            ? {
                url:
                  hero.sizes?.hero?.url ??
                  hero.url,
                alt: hero.alt ?? article.title,
              }
            : undefined
        }
      />

      {/* ===============================
         META STRIP
      =============================== */}
      <SpotlightMeta
        category={article.categories?.[0] ?? null}
        tags={article.tags ?? null}
        featuredReleaseTitle={
          article.relatedAlbum?.title ?? null
        }
      />

      {/* ===============================
         CONTENT + IDENTITY RAIL GRID
      =============================== */}
      <section className={styles.content}>
        {/* MAIN ARTICLE COLUMN */}
        <div className={styles.main}>
  <ContentBlocksRenderer
    blocks={article.contentBlocks ?? []}
  />

  {/* ===============================
     IN-ARTICLE AD
  =============================== */}
  <AdSlot slot="5783687323" />
</div>

        {/* RIGHT IDENTITY / PROGRESS RAIL */}
        {(sections.length > 0 ||
          article.relatedAlbum ||
          article.relatedShow) && (
          <aside className={styles.rail}>
            <ArtistIdentityRail
              album={article.relatedAlbum}
              show={article.relatedShow}
            >
              {sections.length > 0 && (
                <ReadingProgressRail
                  sections={sections}
                  activeId={activeSectionId}
                  onActiveChange={setActiveSectionId}
                  onComplete={handleReadingComplete}
                />
              )}
            </ArtistIdentityRail>
          </aside>
        )}
      </section>

      {/* ===============================
         MOBILE CONTENTS
      =============================== */}
      {sections.length > 0 && (
        <MobileContents
          sections={sections}
          activeId={activeSectionId}
          onNavigate={setActiveSectionId}
        />
      )}

      {/* ===============================
         NEWSLETTER
      =============================== */}
      <NewsletterCta />
    </article>
  )
}
