'use client'

import Link from 'next/link'
import styles from './CategoryPills.module.css'
import { trackEvent } from '@/lib/analytics'

/* ======================================================
   Types
====================================================== */

export interface Category {
  name: string
  slug: string
}

interface Props {
  categories?: Category[] | null
}

/* ======================================================
   Component
====================================================== */

export function CategoryPills({ categories }: Props) {
  if (!categories || categories.length === 0) return null

  return (
    <nav
      className={styles.root}
      aria-label="Article categories"
    >
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={styles.pill}
          onClick={() =>
            trackEvent?.('category_click', {
              category: category.name,
              slug: category.slug,
            })
          }
        >
          {category.name}
        </Link>
      ))}
    </nav>
  )
}
