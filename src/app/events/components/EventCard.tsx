import Link from 'next/link'
import styles from './EventCard.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'
import { getMediaUrl } from '@/lib/payload/getEvents'
import { EventMeta } from './EventMeta'

type Props = {
  event: PayloadEvent
}

export function EventCard({ event }: Props) {
  const imageUrl = getMediaUrl(event.thumbnail || event.heroImage)

  return (
    <article className={styles.card}>
      <Link href={`/events/${event.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.title}
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>WaveNation Event</div>
          )}
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.topRow}>
          {event.contentVertical ? (
            <span className={styles.vertical}>{event.contentVertical}</span>
          ) : null}

          {event.status ? (
            <span className={styles.status}>{event.status}</span>
          ) : null}
        </div>

        <h3 className={styles.title}>
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h3>

        {event.excerpt ? (
          <p className={styles.excerpt}>{event.excerpt}</p>
        ) : null}

        <EventMeta event={event} compact />
      </div>
    </article>
  )
}