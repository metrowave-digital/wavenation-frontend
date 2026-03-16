import styles from './EventPage.module.css'
import { getEvents } from '@/lib/payload/getEvents'
import { EventHero } from './components/EventHero'
import { EventGrid } from './components/EventGrid'

export const metadata = {
  title: 'Events | WaveNation',
  description:
    'Explore live, virtual, community, and music events from WaveNation.',
}

export default async function EventsPage() {
  const { docs } = await getEvents({
    limit: 12,
    where: {
      visibility: 'public',
    },
    sort: '-startDate',
  })

  const [featured, ...rest] = docs

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.kicker}>WaveNation Events</p>
          <h1 className={styles.title}>Live experiences across music, culture, radio, and community.</h1>
          <p className={styles.description}>
            Discover upcoming events, featured livestreams, community activations,
            and on-demand replays.
          </p>
        </header>

        {featured ? <EventHero event={featured} /> : null}

        <EventGrid
          title="All Events"
          events={rest.length ? rest : docs}
          emptyMessage="No public events are available right now."
        />
      </div>
    </main>
  )
}