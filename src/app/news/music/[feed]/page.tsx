import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMusicFeed } from '@/services/musicnews.api'
import type { NewsArticle } from '../../news.types'
import styles from '../MusicHub.module.css'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { title: 'Trending Now', color: '#FF0055', description: 'The most talked-about stories on the desk today.' },
  'latest': { title: 'Latest Updates', color: '#FF6600', description: 'Fresh music news as it breaks.' },
  'new': { title: 'New Releases', color: '#00F0FF', description: 'Fresh drops, new music, and album breakdowns.' },
  'artists': { title: 'Artist Spotlights', color: '#B200FF', description: 'Deep profiles on the artists shaping the sound.' },
  'industry': { title: 'Music Industry', color: '#39FF14', description: 'Labels, deals, and the business of sound.' },
  'all': { title: 'All Stories', color: '#FFFFFF', description: 'The complete archive of WaveNation music coverage.' }
}

export default async function MusicFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params
  if (!feedConfigs[feed]) notFound()

  const config = feedConfigs[feed]
  const articles: NewsArticle[] = await getMusicFeed(feed, 24)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={styles.feedContainer} style={{ '--feed-color': config.color } as React.CSSProperties}>
      <div className={styles.feedHeader}>
        <h2 className={styles.feedTitle}>{config.title}</h2>
        <p className={styles.feedDescription}>{config.description}</p>
      </div>

      {articles.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Gathering the latest stories. Check back soon.</p>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {articles.map((item, idx) => {
            const isArtistSpotlight = item.subcategories?.some(s => s.slug === 'artist-profiles')
            const linkPath = isArtistSpotlight ? `/artist-spotlight/${item.slug}` : `/news/${item.slug}`

            return (
              <Link key={item.id} href={linkPath} className={styles.contentCard} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className={styles.cardImageWrapper}>
                  {item.hero?.image?.url ? (
                    <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                  ) : (
                    <div className={styles.cardPlaceholder} />
                  )}
                  <div className={styles.cardOverlay}>
                    {isArtistSpotlight ? 'VIEW SPOTLIGHT' : 'READ ARTICLE'}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardCategory}>{item.subcategories?.[0]?.name || 'Music'}</span>
                    <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardExcerpt}>{item.excerpt}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}