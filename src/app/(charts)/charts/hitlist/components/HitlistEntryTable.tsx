// app/(charts)/charts/hitlist/components/HitlistEntryTable.tsx

import styles from './HitlistEntryTable.module.css'

type Entry = {
  rank: number
  trackTitle: string
  artist: string
}

type Props = {
  entries: Entry[]
  caption?: string
}

export function HitlistEntryTable({ entries, caption }: Props) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        {caption ? <caption className={styles.caption}>{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Track</th>
            <th scope="col">Artist</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.rank}-${entry.trackTitle}-${entry.artist}`}>
              <td className={styles.rank}>#{entry.rank}</td>
              <td className={styles.track}>{entry.trackTitle}</td>
              <td className={styles.artist}>{entry.artist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}