import styles from './LiveEventsPage.module.css'
import { getEvents } from '@/lib/payload/getEvents'
import { EventGrid } from '../components/EventGrid'

export const metadata = {
  title: 'Live Events | WaveNation',
  description: 'Events that are currently live or happening in real time.',
}

export default async function LiveEventsPage() {
  const { docs } = await getEvents({
    limit: 12,
    where: {
      visibility: 'public',
      status: 'live',
    },
    sort: '-startDate',
  })

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.kicker}>Events</p>
          <h1 className={styles.title}>Live Now</h1>
          <p className={styles.description}>
            Streams, premieres, and special moments happening right now across WaveNation.
          </p>
        </header>

        <EventGrid
          events={docs}
          emptyMessage="No events are live right now."
        />
      </div>
    </main>
  )
}