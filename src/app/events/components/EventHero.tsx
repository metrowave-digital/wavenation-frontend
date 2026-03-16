import styles from './EventHero.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'
import { getMediaUrl } from '@/lib/payload/getEvents'
import { EventMeta } from './EventMeta'
import { RegisterButton } from './RegisterButton'
import { LiveEventNotice } from './LiveEventNotice'

type Props = {
  event: PayloadEvent
}

export function EventHero({ event }: Props) {
  const imageUrl = getMediaUrl(event.heroImage || event.thumbnail)

  return (
    <section className={styles.hero}>
      <div className={styles.media}>
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>WaveNation Event</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrows}>
          {event.contentVertical ? (
            <span className={styles.chip}>{event.contentVertical}</span>
          ) : null}
          {event.eventType ? (
            <span className={styles.chip}>{event.eventType}</span>
          ) : null}
          {event.promotionTier ? (
            <span className={styles.chip}>{event.promotionTier}</span>
          ) : null}
        </div>

        <h1 className={styles.title}>{event.title}</h1>

        {event.excerpt ? (
          <p className={styles.excerpt}>{event.excerpt}</p>
        ) : null}

        <EventMeta event={event} />

        <div className={styles.actions}>
          <RegisterButton event={event} />
        </div>

        <LiveEventNotice event={event} />
      </div>
    </section>
  )
}