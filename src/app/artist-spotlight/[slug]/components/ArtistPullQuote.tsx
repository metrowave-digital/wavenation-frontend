import styles from '../ArtistSpotlight.module.css'

export function PullQuote({ text }: { text: string }) {
  return (
    <aside className={styles.pullQuote}>
      “{text}”
    </aside>
  )
}
