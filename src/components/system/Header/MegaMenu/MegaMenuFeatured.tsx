'use client'

import Image from 'next/image'
import Link from 'next/link'

import styles from './MegaMenuFeatured.module.css'
import { MegaMenuCard } from './MegaMenuCard'
import { trackEvent } from '@/lib/analytics'

export type FeaturedCard = {
  id?: string | number
  href: string
  title: string
  description?: string | null
  eyebrow?: string | null
  image?: {
    url?: string | null
    alt?: string | null
  } | null
}

export type FeaturedSeed = {
  href: string
  title: string
  eyebrow?: string
} | null

interface MegaMenuFeaturedProps {
  sectionId: string
  hero: FeaturedCard | null
  secondary?: FeaturedCard | null
  featuredSeed: FeaturedSeed
  loading: boolean
  onNavigate?: () => void
}

/* ======================================================
   Analytics
====================================================== */

function handleFeaturedClick(
  sectionId: string,
  title: string,
  href: string,
  onNavigate?: () => void
) {
  trackEvent('hero_click', {
    placement: 'mega_menu',
    section: sectionId,
    title,
    href,
  })
  onNavigate?.()
}

/* ======================================================
   Component
====================================================== */

export function MegaMenuFeatured({
  sectionId,
  hero,
  secondary,
  featuredSeed,
  loading,
  onNavigate,
}: MegaMenuFeaturedProps) {
  /* ======================================================
     HERO
  ===================================================== */

  if (hero) {
    const imageSrc = hero.image?.url ?? null
    const imageAlt = hero.image?.alt ?? hero.title

    return (
      <div className={styles.stack}>
        <MegaMenuCard className={styles.heroShell} interactive elevated glow>
          <Link
            href={hero.href}
            className={styles.heroCard}
            data-megamenu-item
            prefetch={false}
            onClick={() =>
              handleFeaturedClick(sectionId, hero.title, hero.href, onNavigate)
            }
          >
            {/* ================= IMAGE ================= */}
            <div className={styles.heroMedia}>
              {imageSrc ? (
                <div className={styles.heroImageWrap}>
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 960px) 100vw, (max-width: 1180px) 50vw, 340px"
                    className={styles.heroImage}
                    unoptimized
                  />
                </div>
              ) : (
                <div className={styles.heroFallback} />
              )}

              <div className={styles.heroOverlay} />
              <div className={styles.heroBadge}>Featured</div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className={styles.heroBody}>
              <div className={styles.heroEyebrow}>
                {hero.eyebrow ?? 'Top Story'}
              </div>

              <h3 className={styles.heroTitle}>{hero.title}</h3>

              {hero.description ? (
                <p className={styles.heroDescription}>
                  {hero.description}
                </p>
              ) : null}

              <div className={styles.heroCtaRow}>
                <span className={styles.heroCta}>Open story</span>
                <span className={styles.heroArrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </div>
          </Link>
        </MegaMenuCard>

        {/* ================= SECONDARY ================= */}
        {secondary ? (
          <MegaMenuCard className={styles.secondaryShell} interactive elevated>
            <Link
              href={secondary.href}
              className={styles.secondaryCard}
              data-megamenu-item
              prefetch={false}
              onClick={() =>
                handleFeaturedClick(
                  sectionId,
                  secondary.title,
                  secondary.href,
                  onNavigate
                )
              }
            >
              <div className={styles.secondaryLabel}>Also trending</div>
              <div className={styles.secondaryTitle}>
                {secondary.title}
              </div>

              {secondary.description ? (
                <div className={styles.secondaryDescription}>
                  {secondary.description}
                </div>
              ) : null}
            </Link>
          </MegaMenuCard>
        ) : null}
      </div>
    )
  }

  /* ======================================================
     SEED (fallback)
  ===================================================== */

  if (featuredSeed) {
    return (
      <MegaMenuCard className={styles.seedShell} interactive elevated glow>
        <Link
          href={featuredSeed.href}
          className={styles.seedCard}
          data-megamenu-item
          prefetch={false}
          onClick={() => {
            trackEvent('navigation_click', {
              component: 'mega_menu',
              section: sectionId,
              label: featuredSeed.title,
              href: featuredSeed.href,
            })
            onNavigate?.()
          }}
        >
          <div className={styles.seedLabel}>
            {featuredSeed.eyebrow ?? 'Featured lane'}
          </div>

          <div className={styles.seedTitle}>
            {featuredSeed.title}
          </div>

          <p className={styles.seedText}>
            Start here for standout stories, curated picks, and section
            highlights.
          </p>

          <div className={styles.seedCtaRow}>
            <span className={styles.seedCta}>Explore feature</span>
            <span className={styles.seedArrow} aria-hidden="true">
              ↗
            </span>
          </div>
        </Link>
      </MegaMenuCard>
    )
  }

  /* ======================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <MegaMenuCard className={styles.loadingShell} elevated glow>
        <div className={styles.loadingCard} aria-live="polite">
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonLineLg} />
          <div className={styles.skeletonLineMd} />
          <div className={styles.skeletonLineSm} />
        </div>
      </MegaMenuCard>
    )
  }

  /* ======================================================
     EMPTY
  ===================================================== */

  return (
    <MegaMenuCard className={styles.emptyShell} elevated>
      <div className={styles.emptyCard}>
        <div className={styles.emptyLabel}>Featured</div>
        <div className={styles.emptyTitle}>
          Nothing highlighted yet
        </div>
        <p className={styles.emptyText}>
          Featured content for this section will appear here when available.
        </p>
      </div>
    </MegaMenuCard>
  )
}