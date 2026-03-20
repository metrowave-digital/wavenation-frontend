import styles from './WatchStateCard.module.css'

type WatchStateCardProps = {
  heading: string
  body: string
  tone?: 'scheduled' | 'ended' | 'issue'
  eventTime?: string | null
  subcopy?: string | null
}

export function WatchStateCard({
  heading,
  body,
  tone = 'scheduled',
  eventTime,
  subcopy,
}: WatchStateCardProps) {
  return (
    <section className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.body}>{body}</p>

        {eventTime ? (
          <p className={styles.meta}>{eventTime}</p>
        ) : null}

        {subcopy ? (
          <p className={styles.subcopy}>{subcopy}</p>
        ) : null}
      </div>
    </section>
  )
}