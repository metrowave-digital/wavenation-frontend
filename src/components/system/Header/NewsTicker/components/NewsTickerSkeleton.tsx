import styles from './NewsTickerSkeleton.module.css'

interface NewsTickerSkeletonProps {
  label: string
}

export function NewsTickerSkeleton({
  label,
}: NewsTickerSkeletonProps) {
  return (
    <aside
      className={styles.ticker}
      aria-busy="true"
      aria-label={label}
    >
      <div className={styles.label}>{label}</div>

      <span className={styles.sectionDivider} />

      <div className={styles.viewport}>
        <div className={styles.skeletonTrack}>
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
        </div>
      </div>

      <span className={styles.sectionDivider} />

      <div className={styles.miniMenuPlaceholder} aria-hidden="true" />
    </aside>
  )
}