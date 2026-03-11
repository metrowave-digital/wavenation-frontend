import Link from 'next/link'
import styles from './ChartMetaBar.module.css'

type ChartMetaBarItem = {
  label: string
  value: string
}

type ChartMetaBarAction = {
  label: string
  href: string
}

export type ChartMetaBarProps = {
  items: ChartMetaBarItem[]
  action?: ChartMetaBarAction
  className?: string
}

export function ChartMetaBar({
  items,
  action,
  className,
}: ChartMetaBarProps) {
  if (!items.length && !action) return null

  return (
    <section className={`${styles.metaBar} ${className ?? ''}`.trim()}>
      <div className={styles.inner}>
        {items.length > 0 ? (
          <div className={styles.items}>
            {items.map(item => (
              <div
                key={`${item.label}-${item.value}`}
                className={styles.item}
              >
                <span className={styles.label}>{item.label}</span>
                <span className={styles.value}>{item.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {action ? (
          <Link href={action.href} className={styles.action}>
            {action.label}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
