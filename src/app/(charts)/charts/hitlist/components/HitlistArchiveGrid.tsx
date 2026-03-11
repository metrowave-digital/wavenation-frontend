// app/(charts)/charts/hitlist/components/HitlistArchiveGrid.tsx

import Link from 'next/link'
import styles from './HitlistArchiveGrid.module.css'
import { extractWeekFromSlug, formatPublishDate } from './hitlist.utils'

type ArchiveItem = {
  slug: string
  publishDate?: string
}

type Props = {
  items: ArchiveItem[]
  hrefBase?: string
  mode?: 'slug' | 'week'
}

export function HitlistArchiveGrid({
  items,
  hrefBase = '/charts/hitlist',
  mode = 'slug',
}: Props) {
  if (!items.length) {
    return <p className={styles.empty}>No archived chart weeks available yet.</p>
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const week = extractWeekFromSlug(item.slug) ?? 'Week'
        const href =
          mode === 'week'
            ? `${hrefBase}/${week.toLowerCase()}`
            : `${hrefBase}/${item.slug}`

        return (
          <Link key={item.slug} href={href} className={styles.card}>
            <span className={styles.eyebrow}>Archived week</span>
            <strong className={styles.title}>{week}</strong>
            <span className={styles.date}>{formatPublishDate(item.publishDate)}</span>
          </Link>
        )
      })}
    </div>
  )
}