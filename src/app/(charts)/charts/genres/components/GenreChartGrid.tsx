// src/app/(charts)/charts/genres/components/GenreChartGrid.tsx

import Link from 'next/link'
import styles from './GenreChartGrid.module.css'
import { formatPublishDate } from './genre.utils'

type GridItem = {
  slug: string
  week: string
  publishDate?: string | null
  href: string
}

type Props = {
  items: GridItem[]
}

export function GenreChartGrid({ items }: Props) {
  if (!items.length) {
    return <p className={styles.empty}>No chart issues available yet.</p>
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Link key={item.slug} href={item.href} className={styles.card}>
          <span className={styles.eyebrow}>Chart week</span>
          <strong className={styles.title}>{item.week}</strong>
          <span className={styles.slug}>{item.slug}</span>
          <span className={styles.date}>{formatPublishDate(item.publishDate)}</span>
        </Link>
      ))}
    </div>
  )
}