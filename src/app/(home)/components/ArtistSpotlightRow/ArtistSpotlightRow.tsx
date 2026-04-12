import Link from 'next/link'
import Image from 'next/image'
import styles from './ArtistSpotlightRow.module.css'
import type { NewsArticle } from '@/app/news/news.types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'https://wavenation.media'

async function getLatestArtistSpotlights(): Promise<NewsArticle[]> {
  try {
    // Fetch up to 3 articles where the subcategory is 'artist-profile' or 'artist-profiles'
    const res = await fetch(
      `${CMS_URL}/api/articles?where[subcategories.slug][in]=artist-profile,artist-profiles&where[_status][equals]=published&sort=-publishDate&limit=3&depth=2`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Failed to fetch artist spotlights:', error)
    return []
  }
}

export default async function ArtistSpotlightRow() {
  const spotlights = await getLatestArtistSpotlights()

  if (!spotlights || spotlights.length === 0) {
    return null // Hide section if no spotlights exist
  }

  return (
    <section className={styles.section} aria-labelledby="spotlight-row-title">
      <div className={styles.container}>
        
        <header className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.livePulse} />
            <p className={styles.eyebrow}>ON THE RADAR</p>
          </div>
          <h2 id="spotlight-row-title" className={styles.title}>
            ARTIST SPOTLIGHTS
          </h2>
        </header>

        <div className={styles.grid}>
          {spotlights.map((article) => {
            const imageUrl = article.hero?.image?.sizes?.card?.url || article.hero?.image?.url

            return (
              <Link key={article.id} href={`/news/${article.slug}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  {imageUrl ? (
                    <div className={styles.imageContainer}>
                      <Image
                        src={imageUrl}
                        alt={article.hero?.image?.alt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.image}
                      />
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                  {/* Studio Effects */}
                  <div className={styles.vignette} />
                  <div className={styles.scanlines} />
                </div>

                <div className={styles.overlay}>
                  <span className={styles.categoryTag}>SPOTLIGHT</span>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <span className={styles.readMore}>READ FEATURE &rarr;</span>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}