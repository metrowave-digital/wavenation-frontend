import Image from 'next/image'
import Link from 'next/link'
import styles from './NewsInterviewFeature.module.css'

interface NewsInterviewFeatureProps {
  eyebrow: string
  title: string
  href: string
  excerpt: string
  person: string
  role: string
  subcategory?: string
  image?: string | null
  imageAlt?: string | null
}

export function NewsInterviewFeature({
  eyebrow,
  title,
  href,
  excerpt,
  person,
  role,
  subcategory,
  image,
  imageAlt,
}: NewsInterviewFeatureProps) {
  return (
    <article className={styles.card}>
      <Link className={styles.imageWrap} href={href} aria-label={title}>
        {image ? (
          <Image
            className={styles.image}
            src={image}
            alt={imageAlt || title}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true" />
        )}
      </Link>

      <div className={styles.body}>
        <span className={styles.eyebrow}>{eyebrow}</span>

        <h3 className={styles.title}>
          <Link href={href}>{title}</Link>
        </h3>

        <p className={styles.excerpt}>{excerpt}</p>

        <div className={styles.personBlock}>
          <span className={styles.person}>{person}</span>
          <span className={styles.role}>
            {subcategory ? `${role} · ${subcategory}` : role}
          </span>
        </div>
      </div>
    </article>
  )
}