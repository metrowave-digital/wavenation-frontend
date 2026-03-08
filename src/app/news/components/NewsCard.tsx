import Image from 'next/image'
import Link from 'next/link'
import styles from './NewsCard.module.css'

interface NewsCardProps {
  title: string
  href: string
  category: string
  excerpt: string
  image?: string | null
  imageAlt?: string | null
  layout?: 'stacked' | 'horizontal'
}

export function NewsCard({
  title,
  href,
  category,
  excerpt,
  image,
  imageAlt,
  layout = 'stacked',
}: NewsCardProps) {
  return (
    <article
      className={`${styles.card} ${
        layout === 'horizontal' ? styles.horizontal : styles.stacked
      }`}
    >
      <Link className={styles.imageWrap} href={href} aria-label={title}>
        {image ? (
          <Image
            className={styles.image}
            src={image}
            alt={imageAlt || title}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true" />
        )}
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{category}</span>

        <h3 className={styles.title}>
          <Link href={href}>{title}</Link>
        </h3>

        <p className={styles.excerpt}>{excerpt}</p>
      </div>
    </article>
  )
}