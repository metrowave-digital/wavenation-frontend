import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTagBySlug, getArticlesByTag } from '@/services/tags.api'
import type { NewsArticle } from '@/app/news/news.types' // Import the correct type
import styles from '../TagsPage.module.css'

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
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        
        <header className={styles.tagHeader}>
          <span className={styles.tagEyebrow}>TOPIC</span>
          <h1 className={styles.tagTitle}>#{tag.label}</h1>
          <p className={styles.tagCount}>{articles.length} Stories</p>
        </header>

        <div className={styles.articleGrid}>
          {/* Changed 'any' to 'NewsArticle' to clear ESLint error */}
          {articles.map((item: NewsArticle, idx: number) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard} style={{ animationDelay: `${idx * 0.1}s` }}>
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
            </Link>
          ))}
          {articles.length === 0 && <p className={styles.emptyState}>No stories found for this topic.</p>}
        </div>

      </main>
    </div>
  )
}