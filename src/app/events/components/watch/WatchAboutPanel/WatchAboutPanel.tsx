import styles from './WatchAboutPanel.module.css'

type WatchAboutPanelProps = {
  title?: string
  excerpt?: string | null
}

export function WatchAboutPanel({
  title = 'About this event',
  excerpt,
}: WatchAboutPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      {excerpt ? (
        <p className={styles.copy}>{excerpt}</p>
      ) : (
        <p className={styles.copy}>
          Stay tuned for more coverage, updates, and replay
          information on WaveNation.
        </p>
      )}
    </section>
  )
}