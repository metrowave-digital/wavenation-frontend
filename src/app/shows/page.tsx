import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getShows } from '@/services/shows.api'
import styles from './ShowsPage.module.css'

/* ======================================================
   Interfaces
====================================================== */
interface MediaAsset {
  url: string
  alt?: string
  sizes?: {
    card?: { url: string }
    hero?: { url: string }
  }
}

interface Show {
  id: string | number
  slug: string
  title: string
  description?: string
  showType?: string
  themeColor?: string
  logo?: MediaAsset
}

/* ======================================================
   Metadata & Page Component
====================================================== */
export const metadata: Metadata = {
  title: 'WaveNation Programming — Shows, Charts & Podcasts',
  description: 'Explore the complete lineup of WaveNation shows. From syndicated hits to underground essentials.',
}

export default async function ShowsPage() {
  const shows = await getShows()

  return (
    <div className={styles.page}>
      {/* Broadcast Texture Overlay */}
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.mainTitle}>WaveNation<br/><span>Programming</span></h1>
        </header>

        {/* Animated Audio EQ Separator */}
        <div className={styles.eqSeparator}>
          <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.0s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
          <span className={styles.eqText}>ON AIR NOW</span>
          <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.0s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
        </div>

        <section className={styles.rosterSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.rosterTitle}>All Shows</h2>
            <p className={styles.rosterCount}>{shows.length} BROADCASTS</p>
          </div>

          <div className={styles.cardGrid}>
            {/* FIX: Replaced 'any' with 'Show' interface */}
            {shows.map((show: Show, index: number) => {
              const logoUrl = show.logo?.sizes?.card?.url || show.logo?.url
              const themeColor = show.themeColor || '#00F0FF'

              return (
                <Link 
                  key={show.id} 
                  href={`/shows/${show.slug}`} 
                  className={styles.showCard}
                  style={{ animationDelay: `${index * 0.1}s`, '--theme-color': themeColor } as React.CSSProperties}
                >
                  <div className={styles.cardHeader}>
                    {logoUrl ? (
                      <div className={styles.imageContainer}>
                        <Image 
                          src={logoUrl} 
                          alt={show.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 350px"
                          className={styles.cardImage}
                        />
                      </div>
                    ) : (
                      <div className={styles.cardPlaceholder}>
                        <span>{show.title}</span>
                      </div>
                    )}
                    {/* Scanlines Effect */}
                    <div className={styles.scanlines} />
                    <div className={styles.cardOverlay}>
                      <span className={styles.viewShowText}>VIEW SHOW</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <p className={styles.cardType}>{show.showType?.replace('_', ' ') || 'BROADCAST'}</p>
                    <h3 className={styles.cardName}>{show.title}</h3>
                    {show.description && (
                      <p className={styles.cardDescription}>{show.description}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}