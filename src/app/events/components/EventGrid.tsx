import styles from './EventGrid.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'
import { EventCard } from './EventCard'

type Props = {
  events: PayloadEvent[]
  title?: string
  emptyMessage?: string
}

export function EventGrid({
  events,
  title,
  emptyMessage = 'No events available right now.',
}: Props) {
  if (!events.length) {
    return (
      <section className={styles.section}>
        {title ? <h2 className={styles.heading}>{title}</h2> : null}
        <div className={styles.empty}>{emptyMessage}</div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      {title ? <h2 className={styles.heading}>{title}</h2> : null}
      <div className={styles.grid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}