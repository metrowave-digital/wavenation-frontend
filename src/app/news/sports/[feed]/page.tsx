import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getSportsFeed } from '@/services/sportsnews.api'
import type { NewsArticle } from '../../news.types'
import styles from '../SportsHub.module.css'

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { title: 'Trending Now', color: '#FF6600', description: 'The biggest headlines in sports today.' },
  'nba': { title: 'NBA', color: '#B200FF', description: 'Hoops, highlights, and hardwood drama.' },
  'nfl': { title: 'NFL', color: '#00F0FF', description: 'Gridiron news, draft updates, and game analysis.' },
  'college': { title: 'College Sports', color: '#39FF14', description: 'The next generation of elite talent.' },
  'culture': { title: 'Sports Culture', color: '#FF0055', description: 'Where the game meets fashion, business, and lifestyle.' },
  'all': { title: 'All Stories', color: '#FFFFFF', description: 'The complete WaveNation sports archive.' }
}

export default async function SportsFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params;
  if (!feedConfigs[feed]) notFound();

  const config = feedConfigs[feed];
  const articles = await getSportsFeed(feed, 24);

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

        {/* ===============================
            TOP HORIZONTAL LEADERBOARD
        =============================== */}
        <section className={styles.horizontalAdContainer}>
          <span className={styles.adLabel}>SPONSORED</span>
          <div className={styles.horizontalAd}>
            <div className={styles.adInner}>
              <p className={styles.adPrompt}>Premium Sports Ad Space</p>
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
                    placement: 'sports_feed_grid' 
                  }}
                >
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? (
                      <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                    ) : ( <div className={styles.cardPlaceholder} /> )}
                    <div className={styles.cardOverlay}>READ MORE</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardCategory}>{item.subcategories?.[0]?.name || 'Sports'}</span>
                      <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>{item.excerpt}</p>
                  </div>
                </TrackedLink>
              );

              // Inject a native ad card after the 6th item
              if (idx === 5) {
                return (
                  <React.Fragment key={`${item.id}-with-ad`}>
                    {articleCard}
                    <div className={styles.adCard}>
                      <span className={styles.adLabel}>SPONSORED</span>
                      <div className={styles.adContent}>
                        <h3>Your Brand Here</h3>
                        <p>Reach millions of highly engaged sports fans.</p>
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