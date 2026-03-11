// app/(charts)/charts/hitlist/components/HitlistMetaBar.tsx

import styles from './HitlistMetaBar.module.css'

type MetricItem = {
  label: string
  value: string | number
}

type Props = {
  items: MetricItem[]
}

export function HitlistMetaBar({ items }: Props) {
  if (!items.length) return null

  return (
    <section className={styles.bar} aria-label="Chart metrics">
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.label}>{item.label}</span>
          <strong className={styles.value}>{item.value}</strong>
        </div>
      ))}
    </section>
  )
}