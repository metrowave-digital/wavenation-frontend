import styles from './WatchGuidelinesPanel.module.css'

type WatchGuidelinesPanelProps = {
  guidelines: string
}

export function WatchGuidelinesPanel({
  guidelines,
}: WatchGuidelinesPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Audience Guidelines</h2>
      <p className={styles.copy}>{guidelines}</p>
    </section>
  )
}