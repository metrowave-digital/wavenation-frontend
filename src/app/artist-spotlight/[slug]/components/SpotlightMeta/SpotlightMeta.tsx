'use client'

import styles from './SpotlightMeta.module.css'
import { CategoryPills, Category } from '../CategoryPills/CategoryPills'
import { Tags, Tag } from '../Tags/Tags'

/* ======================================================
   Props
====================================================== */

interface Props {
  category?: Category | null
  tags?: Tag[] | null
  featuredReleaseTitle?: string | null
}

/* ======================================================
   Component
====================================================== */

export function SpotlightMeta({
  category,
  tags,
  featuredReleaseTitle,
}: Props) {
  const categories = category ? [category] : null

  if (!categories && !tags && !featuredReleaseTitle) {
    return null
  }

  return (
    <section
      className={styles.root}
      aria-label="Article metadata"
    >
      <div className={styles.inner}>
        {/* Category */}
        {categories && (
          <div className={styles.block}>
            <CategoryPills categories={categories} />
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className={styles.block}>
            <Tags tags={tags} />
          </div>
        )}
      </div>
    </section>
  )
}
