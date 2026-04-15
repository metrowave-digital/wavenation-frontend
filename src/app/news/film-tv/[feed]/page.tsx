import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getFilmTVFeed } from '@/services/filmtvnews.api'
import type { NewsArticle } from '../../news.types'
import styles from '../FilmTVHub.module.css'

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { title: 'Trending Now', color: '#FF0055', description: 'The most discussed movies and shows in culture today.' },
  'latest': { title: 'Latest Updates', color: '#FF6600', description: 'Fresh breaking news from the film and television desk.' },
  'reviews': { title: 'Reviews', color: '#00F0FF', description: 'Our take on the latest releases in theaters and streaming.' },
  'interviews': { title: 'Interviews', color: '#B200FF', description: 'Conversations with the creators and stars behind the screen.' },
  'streaming': { title: 'Streaming', color: '#39FF14', description: 'Everything new on Netflix, HBO, Disney+, and beyond.' },
  'all': { title: 'All Stories', color: '#FFFFFF', description: 'The complete archive of WaveNation film & TV coverage.' }
}

export default async function FilmTVFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params
  if (!feedConfigs[feed]) notFound()

  const config = feedConfigs[feed]
  const fetchLimit = feed === 'trending' ? 10 : 24
  const articles: NewsArticle[] = await getFilmTVFeed(feed, fetchLimit)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.feedContainer} style={{ '--feed-color': config.color } as React.CSSProperties}>
        <div className={styles.feedHeader}>
          <h2 className={styles.feedTitle}>{config.title}</h2>
          <p className={styles.feedDescription}>{config.description}</p>
        </div>

        {/* TOP HORIZONTAL LEADERBOARD */}
        <section className={styles.horizontalAdContainer}>
          <span className={styles.adLabel}>SPONSORED</span>
          <div className={styles.horizontalAd}>
            <div className={styles.adInner}>
              <p className={styles.adPrompt}>Entertainment Ad Space</p>
              <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
            </div>
          </div>
        </section>

        {articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>The screen is dark for now. Check back soon for new stories.</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {articles.map((item, idx) => {
              const articleCard = (
                <TrackedLink 
                  key={item.id} 
                  href={`/news/${item.slug}`} 
                  className={styles.contentCard} 
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  eventName="content_click"
                  payload={{ 
                    id: item.id, 
                    title: item.title, 
                    category: config.title, 
                    placement: 'filmtv_feed_grid' 
                  }}
                >
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? (
                      <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                    ) : (
                      <div className={styles.cardPlaceholder} />
                    )}
                    <div className={styles.cardOverlay}>VIEW FEATURE</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardCategory}>{item.subcategories?.[0]?.name || 'Film & TV'}</span>
                      <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>{item.excerpt}</p>
                  </div>
                </TrackedLink>
              );

              // Inject Native Ad Card
              if (idx === 5) {
                return (
                  <React.Fragment key={`${item.id}-with-ad`}>
                    {articleCard}
                    <div className={styles.adCard}>
                      <span className={styles.adLabel}>SPONSORED</span>
                      <div className={styles.adContent}>
                        <h3>Showcase Your Title</h3>
                        <p>Reach millions of entertainment enthusiasts.</p>
                        <button className={styles.adButton}>Advertise</button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              }

              return articleCard;
            })}
          </div>
        )}
      </div>
    </>
  )
}