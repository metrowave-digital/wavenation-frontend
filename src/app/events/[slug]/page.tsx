import { notFound } from 'next/navigation'
import styles from './EventSlugPage.module.css'
import { getEventBySlug } from '@/lib/payload/getEvents'
import { EventHero } from '../components/EventHero'
import { EventAgenda } from '../components/EventAgenda'
import { EventFAQ } from '../components/EventFAQ'
import { RegisterButton } from '../components/RegisterButton'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found | WaveNation',
    }
  }

  return {
    title: event.seoTitle || `${event.title} | WaveNation`,
    description: event.seoDescription || event.excerpt || 'WaveNation event page',
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) notFound()

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <EventHero event={event} />

        <div className={styles.layout}>
          <section className={styles.main}>
            {event.streamEmbedUrl ? (
              <section className={styles.embedBlock}>
                <h2 className={styles.sectionTitle}>Watch</h2>
                <div className={styles.embedWrap}>
                  <iframe
                    src={event.streamEmbedUrl}
                    title={`${event.title} stream`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className={styles.iframe}
                  />
                </div>
              </section>
            ) : null}

            <EventAgenda agenda={event.agenda} />
            <EventFAQ faq={event.faq} />
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Join this event</h2>
              <RegisterButton event={event} />

              {event.livestreamAccessInstructions ? (
                <p className={styles.copy}>{event.livestreamAccessInstructions}</p>
              ) : null}

              {event.virtualEventLabel ? (
                <p className={styles.copy}>
                  <strong>Access:</strong> {event.virtualEventLabel}
                </p>
              ) : null}

              {event.sponsorNames?.length ? (
                <p className={styles.copy}>
                  <strong>Sponsors:</strong> {event.sponsorNames.join(', ')}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}