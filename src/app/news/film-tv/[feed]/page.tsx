import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFilmTVFeed } from '@/services/filmtvnews.api'
import type { NewsArticle } from '../../news.types'
import styles from '../FilmTVHub.module.css'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { 
    title: 'Trending Now', 
    color: '#FF0055', 
    description: 'The most discussed movies and shows in culture today.' 
  },
  'latest': { 
    title: 'Latest Updates', 
    color: '#FF6600', 
    description: 'Fresh breaking news from the film and television desk.' 
  },
  'reviews': { 
    title: 'Reviews', 
    color: '#00F0FF', 
    description: 'Our take on the latest releases in theaters and streaming.' 
  },
  'interviews': { 
    title: 'Interviews', 
    color: '#B200FF', 
    description: 'Conversations with the creators and stars behind the screen.' 
  },
  'streaming': { 
    title: 'Streaming', 
    color: '#39FF14', 
    description: 'Everything new on Netflix, HBO, Disney+, and beyond.' 
  },
  'all': { 
    title: 'All Stories', 
    color: '#FFFFFF', 
    description: 'The complete archive of WaveNation film & TV coverage.' 
  }
}

export default async function FilmTVFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params

  if (!feedConfigs[feed]) {
    notFound()
  }

  const config = feedConfigs[feed]
  
  // Fetch data using the specialized Film/TV REST service
  // Trending gets top 10, others get a 24-card grid
  const fetchLimit = feed === 'trending' ? 10 : 24
  const articles: NewsArticle[] = await getFilmTVFeed(feed, fetchLimit)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className={styles.feedContainer} style={{ '--feed-color': config.color } as React.CSSProperties}>
      
      <div className={styles.feedHeader}>
        <h2 className={styles.feedTitle}>{config.title}</h2>
        <p className={styles.feedDescription}>{config.description}</p>
      </div>

      {articles.length === 0 ? (
        <div className={styles.emptyState}>
          <p>The screen is dark for now. Check back soon for new stories.</p>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {articles.map((item, idx) => (
            <Link 
              key={item.id} 
              href={`/news/${item.slug}`} 
              className={styles.contentCard} 
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={styles.cardImageWrapper}>
                {item.hero?.image?.url ? (
                  <Image 
                    src={item.hero.image.sizes?.card?.url || item.hero.image.url} 
                    alt={item.title} 
                    fill 
                    className={styles.cardImg} 
                  />
                ) : (
                  <div className={styles.cardPlaceholder} />
                )}
                <div className={styles.cardOverlay}>VIEW FEATURE</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMetaRow}>
                  <span className={styles.cardCategory}>
                    {item.subcategories?.[0]?.name || 'Film & TV'}
                  </span>
                  <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardExcerpt}>{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}