import Link from 'next/link'
import Image from 'next/image'
import styles from './NewsPage.module.css'

import { TrendingArticles } from '@/components/articles/TrendingArticles'
import { NewsletterCta } from '@/components/newsletter/NewsletterCTA'

/* ======================================================
   Types
====================================================== */

type Media = {
  url: string
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null }
    card?: { url?: string | null }
  }
}

type Category = {
  name: string
  slug: string
}

type Author = {
  displayName?: string | null
  slug?: string | null
}

type Article = {
  id: string
  title: string
  slug: string
  publishDate?: string | null
  excerpt?: string | null
  subtitle?: string | null
  isBreaking?: boolean
  categories?: Category[] | null
  author?: Author | null
  hero?: { image?: Media | null } | null
}

type ArticlesResponse = {
  docs?: Article[]
}

/* ======================================================
   Config
====================================================== */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

async function fetchLatest(limit = 16) {
  const res = await fetch(
    `${CMS_URL}/api/articles?where[_status][equals]=published&limit=${limit}&sort=-publishDate`,
    { cache: 'no-store' }
  )
  if (!res.ok) return { docs: [] } as ArticlesResponse
  return (await res.json()) as ArticlesResponse
}

// Optional: curated featured from CMS later (flag). For now: take latest.
async function fetchFeatured() {
  const res = await fetch(
    `${CMS_URL}/api/articles?where[_status][equals]=published&limit=4&sort=-publishDate`,
    { cache: 'no-store' }
  )
  if (!res.ok) return { docs: [] } as ArticlesResponse
  return (await res.json()) as ArticlesResponse
}

/* ======================================================
   Helpers
====================================================== */

function formatDate(date?: string | null) {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function imageSrc(media?: Media | null) {
  if (!media?.url) return null
  return media.sizes?.card?.url ?? media.sizes?.hero?.url ?? media.url
}

/* ======================================================
   Page
====================================================== */

export default async function NewsPage() {
  const [featuredRes, latestRes] = await Promise.all([
    fetchFeatured(),
    fetchLatest(18),
  ])

  const featured = featuredRes.docs ?? []
  const latest = latestRes.docs ?? []

  const hero = featured[0]
  const featureCards = featured.slice(1, 4)

  return (
    <main className={styles.page}>
      {/* ================= HERO / FEATURED ================= */}
      <header className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div className={styles.kicker}>
              <span className={styles.eyebrow}>WaveNation Pulse</span>
              <h1 className={styles.heroTitle}>News</h1>
              <p className={styles.heroLede}>
                Latest culture headlines, music news, and WaveNation editorial.
              </p>
            </div>

            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/news">
                Latest
              </Link>
              <Link className={styles.secondaryCta} href="/categories">
                Browse Categories
              </Link>
            </div>
          </div>

          {hero ? (
            <section className={styles.featured} aria-label="Featured articles">
              <Link className={styles.heroFeature} href={`/articles/${hero.slug}`}>
                <div className={styles.heroMedia}>
                  {imageSrc(hero.hero?.image) ? (
                    <Image
                      src={imageSrc(hero.hero?.image)!}
                      alt={hero.hero?.image?.alt ?? hero.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className={styles.heroImg}
                      priority
                    />
                  ) : (
                    <div className={styles.heroPlaceholder} aria-hidden="true" />
                  )}
                  <div className={styles.heroOverlay} aria-hidden="true" />
                </div>

                <div className={styles.heroCopy}>
                  <div className={styles.heroMeta}>
                    {hero.isBreaking && (
                      <span className={styles.breaking}>Breaking</span>
                    )}

                    {hero.categories?.[0]?.name && (
                      <span className={styles.category}>
                        {hero.categories[0].name}
                      </span>
                    )}

                    {hero.publishDate && (
                      <span className={styles.dot} aria-hidden="true">
                        •
                      </span>
                    )}

                    {hero.publishDate && (
                      <time className={styles.date}>
                        {formatDate(hero.publishDate)}
                      </time>
                    )}
                  </div>

                  <h2 className={styles.heroH2}>{hero.title}</h2>

                  {(hero.subtitle || hero.excerpt) && (
                    <p className={styles.heroDesc}>
                      {hero.subtitle ?? hero.excerpt}
                    </p>
                  )}
                </div>
              </Link>

              {featureCards.length > 0 && (
                <div className={styles.featureGrid} aria-label="More featured">
                  {featureCards.map((a) => (
                    <Link
                      key={a.id}
                      className={styles.featureCard}
                      href={`/articles/${a.slug}`}
                    >
                      <div className={styles.featureCardTop}>
                        <span className={styles.featureTag}>
                          {a.categories?.[0]?.name ?? 'Featured'}
                        </span>
                        {a.publishDate && (
                          <time className={styles.featureDate}>
                            {formatDate(a.publishDate)}
                          </time>
                        )}
                      </div>
                      <h3 className={styles.featureTitle}>{a.title}</h3>
                      {(a.excerpt || a.subtitle) && (
                        <p className={styles.featureExcerpt}>
                          {a.subtitle ?? a.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </div>
      </header>

      {/* ================= MAIN GRID ================= */}
      <div className={styles.shell}>
        <div className={styles.grid}>
          {/* ===== LATEST ===== */}
          <section className={styles.main} aria-label="Latest articles">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest</h2>
              <span className={styles.sectionHint}>Updated continuously</span>
            </div>

            <div className={styles.latestList}>
              {latest.map((a) => (
                <article key={a.id} className={styles.latestItem}>
                  <Link className={styles.latestLink} href={`/articles/${a.slug}`}>
                    <div className={styles.latestText}>
                      <div className={styles.latestMeta}>
                        {a.categories?.[0]?.name && (
                          <span className={styles.latestCategory}>
                            {a.categories[0].name}
                          </span>
                        )}
                        {a.publishDate && (
                          <>
                            <span className={styles.dot} aria-hidden="true">
                              •
                            </span>
                            <time className={styles.latestDate}>
                              {formatDate(a.publishDate)}
                            </time>
                          </>
                        )}
                      </div>

                      <h3 className={styles.latestTitle}>{a.title}</h3>

                      {(a.excerpt || a.subtitle) && (
                        <p className={styles.latestExcerpt}>
                          {a.subtitle ?? a.excerpt}
                        </p>
                      )}
                    </div>

                    <div className={styles.latestThumb}>
                      {imageSrc(a.hero?.image) ? (
                        <Image
                          src={imageSrc(a.hero?.image)!}
                          alt={a.hero?.image?.alt ?? a.title}
                          fill
                          sizes="(max-width: 1024px) 140px, 160px"
                          className={styles.thumbImg}
                        />
                      ) : (
                        <div className={styles.thumbPlaceholder} aria-hidden="true" />
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Placeholder for future pagination */}
            <div className={styles.moreRow}>
              <Link className={styles.moreBtn} href="/news?page=2">
                More stories
                <span className={styles.moreArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </section>

          {/* ===== SIDEBAR ===== */}
          <aside className={styles.sidebar} aria-label="News sidebar">
            <div className={styles.sidebarInner}>
              <TrendingArticles />
              <div className={styles.sidebarCta}>
                <NewsletterCta />
              </div>

              {/* Optional future: categories module, editors picks, etc. */}
              <div className={styles.sidebarNote}>
                <h4 className={styles.sidebarTitle}>Tip</h4>
                <p className={styles.sidebarText}>
                  Want “true trending”? Add a CMS field like <strong>isTrending</strong>{' '}
                  or a score based on views/engagement and sort by that.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}