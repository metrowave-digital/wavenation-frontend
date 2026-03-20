import styles from './WatchProductionCard.module.css'

type WatchProductionCardProps = {
  producerName?: string | null
  moderatorName?: string | null
  technicalDirectorName?: string | null
}

export function WatchProductionCard({
  producerName,
  moderatorName,
  technicalDirectorName,
}: WatchProductionCardProps) {
  if (
    !producerName &&
    !moderatorName &&
    !technicalDirectorName
  ) {
    return null
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Production</h3>

      <div className={styles.stack}>
        {producerName ? (
          <div className={styles.row}>
            <span className={styles.label}>Producer</span>
            <span className={styles.value}>{producerName}</span>
          </div>
        ) : null}

        {moderatorName ? (
          <div className={styles.row}>
            <span className={styles.label}>Moderator</span>
            <span className={styles.value}>{moderatorName}</span>
          </div>
        ) : null}

        {technicalDirectorName ? (
          <div className={styles.row}>
            <span className={styles.label}>Technical Director</span>
            <span className={styles.value}>
              {technicalDirectorName}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  )
}