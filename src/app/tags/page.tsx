import type { Metadata } from 'next'
import { getTags } from '@/services/tags.api'
import styles from './TagsPage.module.css'

// Import client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents'

export const metadata: Metadata = {
  title: 'Explore Topics | WaveNation',
  description: 'Browse all news and culture topics on WaveNation.',
}

export default async function TagsDirectory() {
  const tags = await getTags()

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.page}>
        <div className={styles.textureOverlay} />
        <main className={styles.main}>
          <header className={styles.pageHeader}>
            <h1 className={styles.mainTitle}>Explore<br/><span className={styles.outlineText}>Topics</span></h1>
          </header>

          {/* TOP HORIZONTAL LEADERBOARD */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Directory Sponsor Space</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          <div className={styles.tagsCloudLarge}>
            {tags.map((tag, index) => (
              <TrackedLink 
                key={tag.id} 
                href={`/tags/${tag.slug}`} 
                className={styles.largeTagPill} 
                style={{ animationDelay: `${index * 0.05}s` }}
                eventName="tag_click"
                payload={{ tag: tag.label, placement: 'tags_directory' }}
              >
                #{tag.label}
              </TrackedLink>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}