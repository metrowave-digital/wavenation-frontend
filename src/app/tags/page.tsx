import type { Metadata } from 'next'
import Link from 'next/link'
import { getTags } from '@/services/tags.api'
import styles from './TagsPage.module.css'

export const metadata: Metadata = {
  title: 'Explore Topics | WaveNation',
  description: 'Browse all news and culture topics on WaveNation.',
}

export default async function TagsDirectory() {
  const tags = await getTags()

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.mainTitle}>Explore<br/><span className={styles.outlineText}>Topics</span></h1>
        </header>

        <div className={styles.tagsCloudLarge}>
          {tags.map((tag, index) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className={styles.largeTagPill} style={{ animationDelay: `${index * 0.05}s` }}>
              #{tag.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}