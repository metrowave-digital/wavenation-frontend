// src/app/(charts)/charts/genres/components/GenreStatsBar.tsx

import styles from './GenreStatsBar.module.css'

type StatItem = {
  label: string
  value: string | number
}

type Props = {
  items: StatItem[]
}

export function GenreStatsBar({ items }: Props) {
  if (!items.length) return null

  return (
    <section className={styles.bar} aria-label="Genre chart stats">
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.label}>{item.label}</span>
          <strong className={styles.value}>{item.value}</strong>
        </div>
      ))}
    </section>
  )
}