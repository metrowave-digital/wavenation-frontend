import Link from 'next/link'
import styles from './TagList.module.css'

interface Tag {
  id: number | string
  label: string
  slug: string
}

export function TagList({
  tags,
  activeSlug,
}: {
  tags?: Tag[] | null
  activeSlug?: string
}) {
  if (!tags?.length) return null

  return (
    <nav
      className={styles.root}
      aria-label="Article tags"
    >
      {tags.map((tag) => {
        const isActive = activeSlug === tag.slug

        return (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className={`${styles.tag} ${
              isActive ? styles.active : ''
            }`}
          >
            <span className={styles.hash}>#</span>
            {tag.label}
          </Link>
        )
      })}
    </nav>
  )
}