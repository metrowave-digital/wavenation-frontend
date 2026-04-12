import Image from 'next/image'
import type { NewsArticle } from '../../news.types'
import styles from './ArticleHero.module.css'

export function ArticleHero({ article }: { article: NewsArticle }) {
  const category = article.categories?.[0]?.name || 'News'
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
  
  const heroImg = article.hero?.image?.sizes?.hero?.url || article.hero?.image?.url

  return (
    <header className={styles.heroWrapper}>
      <div className={styles.metaTop}>
        <span className={styles.categoryBadge}>{category}</span>
        <span className={styles.readingTime}>{article.readingTime} MIN READ</span>
      </div>

      <h1 className={styles.title}>{article.title}</h1>
      {article.subtitle && <h2 className={styles.subtitle}>{article.subtitle}</h2>}

      <div className={styles.byline}>
        <span className={styles.author}>By {article.author?.fullName}</span>
        <span className={styles.separator}>{/* */}</span>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {heroImg && (
        <div className={styles.imageContainer}>
          <Image 
            src={heroImg} 
            alt={article.hero?.image?.alt || article.title}
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.scanlines} />
          {article.hero?.caption && (
            <div className={styles.captionBar}>
              <span className={styles.captionText}>{article.hero.caption}</span>
              {article.hero.credit && <span className={styles.creditText}>{article.hero.credit}</span>}
            </div>
          )}
        </div>
      )}
    </header>
  )
}