import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCultureFeed } from '@/services/culturenews.api'
import type { NewsArticle } from '../../news.types'
import styles from '../CultureHub.module.css'

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { title: 'Trending', color: '#FF0055', description: 'The cultural stories dominating the conversation right now.' },
  'us-news': { title: 'US News', color: '#00F0FF', description: 'Political shifts and domestic updates shaping the nation.' },
  'travel': { title: 'Travel', color: '#39FF14', description: 'Global destinations, tips, and modern exploration.' },
  'education': { title: 'Education', color: '#B200FF', description: 'Policy, academia, and the future of learning.' },
  'fashion': { title: 'Fashion', color: '#FF6600', description: 'Trend cycles, industry moves, and street style.' },
  'all': { title: 'All Stories', color: '#FFFFFF', description: 'The complete WaveNation culture archive.' }
}

export default async function CultureFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params;
  if (!feedConfigs[feed]) notFound();

  const config = feedConfigs[feed];
  const articles = await getCultureFeed(feed, 24);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
              <p className={styles.adPrompt}>Premium Culture Ad Space</p>
              <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
            </div>
          </div>
        </section>

        {articles.length === 0 ? (
          <div className={styles.emptyState}><p>No stories found in this section. Check back soon.</p></div>
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
                    placement: 'culture_feed_grid' 
                  }}
                >
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? (
                      <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                    ) : ( <div className={styles.cardPlaceholder} /> )}
                    <div className={styles.cardOverlay}>READ STORY</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardCategory}>{item.subcategories?.[0]?.name || 'Culture'}</span>
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
                        <h3>Your Brand Here</h3>
                        <p>Be part of the cultural conversation.</p>
                        <button className={styles.adButton}>Advertise With Us</button>
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
  );
}