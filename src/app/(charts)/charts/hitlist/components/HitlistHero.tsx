// app/(charts)/charts/hitlist/components/HitlistHero.tsx

import Link from 'next/link'
import styles from './HitlistHero.module.css'
import { formatPublishDate } from './hitlist.utils'

type Props = {
  title: string
  description: string
  currentHref?: string
  archiveHref?: string
  currentLabel?: string
  publishDate?: string | null
  weekLabel?: string | null
}

export function HitlistHero({
  title,
  description,
  currentHref = '/charts/hitlist/current',
  archiveHref = '/charts/hitlist/archive',
  currentLabel = 'View current chart',
  publishDate,
  weekLabel,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.kicker}>WaveNation flagship chart</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <Link href={currentHref} className={styles.primaryCta}>
            {currentLabel}
          </Link>
          <Link href={archiveHref} className={styles.secondaryCta}>
            Explore archive
          </Link>
        </div>
      </div>

      <aside className={styles.panel}>
        <div className={styles.panelLabel}>Latest published week</div>
        <div className={styles.weekValue}>{weekLabel ?? 'Current'}</div>
        <div className={styles.dateValue}>{formatPublishDate(publishDate)}</div>
      </aside>
    </section>
  )
}