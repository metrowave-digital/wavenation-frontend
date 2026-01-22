'use client'

import Link from 'next/link'
import styles from './Tags.module.css'
import { trackEvent } from '@/lib/analytics'

/* ======================================================
   Types
====================================================== */

export interface Tag {
  label: string
  slug: string
}

interface Props {
  tags?: Tag[] | null
}

/* ======================================================
   Component
====================================================== */

export function Tags({ tags }: Props) {
  if (!tags || tags.length === 0) return null

  return (
    <nav
      className={styles.root}
      aria-label="Article tags"
    >
      <ul className={styles.list}>
        {tags.map((tag) => (
          <li key={tag.slug} className={styles.item}>
            <Link
              href={`/tag/${tag.slug}`}
              className={styles.tag}
              onClick={() =>
                trackEvent?.('tag_click', {
                  tag: tag.label,
                  slug: tag.slug,
                })
              }
            >
              #{tag.label}
            </Link>
          </li>
        ))}

        {/* Show all tags */}
        <li className={styles.item}>
          <Link
            href="/tags"
            className={styles.showAll}
            onClick={() =>
              trackEvent?.('tag_show_all_click', {
                count: tags.length,
              })
            }
          >
            Show all tags →
          </Link>
        </li>
      </ul>
    </nav>
  )
}
