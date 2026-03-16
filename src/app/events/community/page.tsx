import styles from './CommunityEventsPage.module.css'
import { getEvents } from '@/lib/payload/getEvents'
import { EventGrid } from '../components/EventGrid'

export const metadata = {
  title: 'Community Events | WaveNation',
  description: 'Community-centered events and activations from WaveNation.',
}

export default async function CommunityEventsPage() {
  const { docs } = await getEvents({
    limit: 12,
    where: {
      visibility: 'public',
      contentVertical: 'culture',
    },
    sort: '-startDate',
  })

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.kicker}>Events</p>
          <h1 className={styles.title}>Community</h1>
          <p className={styles.description}>
            Local activations, conversations, celebrations, and community-centered programming.
          </p>
        </header>

        <EventGrid
          events={docs}
          emptyMessage="No community events are available right now."
        />
      </div>
    </main>
  )
}