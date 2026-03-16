import styles from './MusicEventsPage.module.css'
import { getEvents } from '@/lib/payload/getEvents'
import { EventGrid } from '../components/EventGrid'

export const metadata = {
  title: 'Music Events | WaveNation',
  description: 'Music events, showcases, interviews, and live sessions from WaveNation.',
}

export default async function MusicEventsPage() {
  const { docs } = await getEvents({
    limit: 12,
    where: {
      visibility: 'public',
      contentVertical: 'music',
    },
    sort: '-startDate',
  })

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.kicker}>Events</p>
          <h1 className={styles.title}>Music</h1>
          <p className={styles.description}>
            Concert streams, listening sessions, artist spotlights, and music-centered experiences.
          </p>
        </header>

        <EventGrid
          events={docs}
          emptyMessage="No music events are available right now."
        />
      </div>
    </main>
  )
}