import Link from 'next/link'
import styles from './TrendingArticles.module.css'

interface TrendingArticle {
  id: string
  title: string
  slug: string
}

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

export async function TrendingArticles() {
  const res = await fetch(
    `${CMS_URL}/api/articles?where[_status][equals]=published&limit=5&sort=-publishDate`,
    { cache: 'no-store' }
  )

  if (!res.ok) return null

  const data = (await res.json()) as {
    docs?: TrendingArticle[]
  }

  const articles = data.docs ?? []
  if (!articles.length) return null

  return (
    <section className={styles.module} aria-labelledby="trending-heading">
      <header className={styles.header}>
        <h4 id="trending-heading" className={styles.title}>
          Trending
        </h4>
      </header>

      <ol className={styles.list}>
        {articles.map((article, index) => (
          <li key={article.id} className={styles.item}>
            <span className={styles.rank}>
              {String(index + 1).padStart(2, '0')}
            </span>

            <Link
              href={`/articles/${article.slug}`}
              className={styles.link}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}