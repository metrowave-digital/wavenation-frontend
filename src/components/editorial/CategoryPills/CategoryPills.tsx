import Link from 'next/link'
import styles from './CategoryPills.module.css'

interface Category {
  id: number | string
  name: string
  slug: string
}

export function CategoryPills({
  categories,
  activeSlug,
}: {
  categories?: Category[] | null
  activeSlug?: string
}) {
  if (!categories?.length) return null

  return (
    <nav
      className={styles.root}
      aria-label="Article categories"
    >
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug

        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`${styles.pill} ${
              isActive ? styles.active : ''
            }`}
          >
            {cat.name}
          </Link>
        )
      })}
    </nav>
  )
}