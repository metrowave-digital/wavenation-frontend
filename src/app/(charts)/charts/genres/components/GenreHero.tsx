// src/app/(charts)/charts/genres/components/GenreHero.tsx

import Link from 'next/link'
import styles from './GenreHero.module.css'
import { formatPublishDate } from './genre.utils'

type Props = {
  eyebrow: string
  title: string
  description: string
  currentHref: string
  archiveHref: string
  publishDate?: string | null
  weekLabel?: string | null
}

export function GenreHero({
  eyebrow,
  title,
  description,
  currentHref,
  archiveHref,
  publishDate,
  weekLabel,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <Link href={currentHref} className={styles.primaryCta}>
            View current
          </Link>
          <Link href={archiveHref} className={styles.secondaryCta}>
            Browse archive
          </Link>
        </div>
      </div>

      <aside className={styles.panel}>
        <span className={styles.panelLabel}>Latest published week</span>
        <strong className={styles.panelValue}>{weekLabel ?? 'Current'}</strong>
        <span className={styles.panelDate}>{formatPublishDate(publishDate)}</span>
      </aside>
    </section>
  )
}