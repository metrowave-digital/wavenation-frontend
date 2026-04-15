import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTagBySlug, getArticlesByTag } from '@/services/tags.api'
import type { NewsArticle } from '@/app/news/news.types'
import styles from '../TagsPage.module.css'

// Import client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return { title: 'Topic Not Found' }
  return { title: `#${tag.label} | WaveNation News` }
}

export default async function TagProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const articles: NewsArticle[] = await getArticlesByTag(tag.id)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.page}>
        <div className={styles.textureOverlay} />
        <main className={styles.main}>
          
          <header className={styles.tagHeader}>
            <span className={styles.tagEyebrow}>TOPIC</span>
            <h1 className={styles.tagTitle}>#{tag.label}</h1>
            <p className={styles.tagCount}>{articles.length} Stories</p>
          </header>

          {/* TOP HORIZONTAL LEADERBOARD */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Topic Sponsor Space</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          <div className={styles.articleGrid}>
            {articles.map((item: NewsArticle, idx: number) => {
              const articleCard = (
                <TrackedLink 
                  key={item.id} 
                  href={`/news/${item.slug}`} 
                  className={styles.contentCard} 
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  eventName="content_click"
                  payload={{ id: item.id, title: item.title, category: tag.label, placement: 'tag_profile_grid' }}
                >
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? (
                      <Image 
                        src={item.hero.image.sizes?.card?.url || item.hero.image.url} 
                        alt={item.title} 
                        fill 
                        className={styles.cardImg} 
                      />
                    ) : <div className={styles.cardPlaceholder} />}
                    <div className={styles.cardOverlay}>READ ARTICLE</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCategory}>{item.categories?.[0]?.name || 'NEWS'}</span>
                      <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </TrackedLink>
              );

              // Inject Native Ad Card after the 6th item
              if (idx === 5) {
                return (
                  <React.Fragment key={`${item.id}-with-ad`}>
                    {articleCard}
                    <div className={styles.adCard}>
                      <span className={styles.adLabel}>SPONSORED</span>
                      <div className={styles.adContent}>
                        <h3>Target This Audience</h3>
                        <p>Sponsor the #{tag.label} topic.</p>
                        <button className={styles.adButton}>Advertise</button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              }

              return articleCard;
            })}
            
            {articles.length === 0 && <p className={styles.emptyState}>No stories found for this topic.</p>}
          </div>

        </main>
      </div>
    </>
  )
}