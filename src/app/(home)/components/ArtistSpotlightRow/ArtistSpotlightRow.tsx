import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import styles from './ArtistSpotlightRow.module.css'
import type { NewsArticle } from '@/app/news/news.types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'https://wavenation.media'

async function getLatestArtistSpotlights(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?where[subcategories.slug][in]=artist-profile,artist-profiles&where[_status][equals]=published&sort=-publishDate&limit=3&depth=2`,
      { next: { revalidate: 3600 } }
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
    return null 
  }

  return (
    <section className={styles.section} aria-labelledby="spotlight-row-title">
      <div className={styles.container}>
        
        <header className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.livePulse} />
            <p className={styles.eyebrow}>ON THE RADAR</p>
          </div>
          <div className={styles.titleRow}>
            <h2 id="spotlight-row-title" className={styles.title}>
              ARTIST SPOTLIGHTS
            </h2>
            <Link href="/news/music/artists" className={styles.viewAll}>
              VIEW ALL <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        <div className={styles.grid}>
          {spotlights.map((article) => {
            const imageUrl = article.hero?.image?.sizes?.card?.url || article.hero?.image?.url || '/images/fallback-artist.jpg'

            return (
              <Link key={article.id} href={`/news/${article.slug}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={imageUrl}
                      alt={article.hero?.image?.alt || article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.image}
                    />
                  </div>
                  
                  {/* Studio Effects */}
                  <div className={styles.vignette} />
                  <div className={styles.scanlines} />
                  <div className={styles.glare} />
                </div>

                <div className={styles.overlay}>
                  <div className={styles.metaTop}>
                    <span className={styles.categoryTag}>SPOTLIGHT</span>
                  </div>
                  
                  <div className={styles.contentBottom}>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <div className={styles.readMore}>
                      <span>READ FEATURE</span>
                      <ArrowRight size={18} className={styles.arrow} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}