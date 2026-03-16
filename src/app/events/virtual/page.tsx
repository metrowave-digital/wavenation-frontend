import styles from './VirtualEventsPage.module.css'
import { getEvents } from '@/lib/payload/getEvents'
import { EventGrid } from '../components/EventGrid'

export const metadata = {
  title: 'Virtual Events | WaveNation',
  description: 'Virtual events and livestream experiences from WaveNation.',
}

export default async function VirtualEventsPage() {
  const { docs } = await getEvents({
    limit: 12,
    where: {
      visibility: 'public',
      eventType: 'virtual',
    },
    sort: '-startDate',
  })

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.kicker}>Events</p>
          <h1 className={styles.title}>Virtual</h1>
          <p className={styles.description}>
            Digital-first events, livestream sessions, online conversations, and private virtual experiences.
          </p>
        </header>

        <EventGrid
          events={docs}
          emptyMessage="No virtual events are available right now."
        />
      </div>
    </main>
  )
}