import Link from 'next/link'
import styles from './TerisaPage.module.css'

export const metadata = {
  title: 'Terisa Griffin Women’s History Month Celebration | WaveNation',
  description:
    'Join WaveNation for a private virtual celebration honoring Terisa Griffin during Women’s History Month.',
}

type EventData = {
  name: string
  summary: string
  start: string
  end?: string
  status?: string
  venue?: string
  imageUrl?: string | null
  eventbriteUrl?: string
  streamUrl?: string
  accessLabel?: string
  agenda?: Array<{
    time: string
    title: string
    description?: string
  }>
  speakers?: Array<{
    name: string
    role: string
    bio?: string
  }>
}

async function getTerisaEvent(): Promise<EventData> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/events/terisa`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch event data')
    }

    return res.json()
  } catch {
    return {
      name: 'Terisa Griffin Women’s History Month Celebration',
      summary:
        'A private virtual WaveNation event celebrating the artistry, impact, and legacy of Terisa Griffin with music, conversation, and community.',
      start: '2026-03-28T19:00:00.000Z',
      end: '2026-03-28T20:30:00.000Z',
      status: 'live_soon',
      venue: 'Private Virtual Event',
      imageUrl: null,
      eventbriteUrl: '#',
      streamUrl: '/live/terisa',
      accessLabel: 'Private Access',
      agenda: [
        {
          time: '7:00 PM',
          title: 'Welcome + Opening Remarks',
          description:
            'WaveNation opens the evening and sets the tone for the celebration.',
        },
        {
          time: '7:10 PM',
          title: 'Spotlight on Terisa Griffin',
          description:
            'A featured segment highlighting her artistry, journey, and impact.',
        },
        {
          time: '7:35 PM',
          title: 'Women’s History Month Tribute',
          description:
            'A special tribute honoring women shaping culture, community, and legacy.',
        },
        {
          time: '8:00 PM',
          title: 'Audience Moment + Closing',
          description:
            'Final reflections, acknowledgments, and next steps for attendees.',
        },
      ],
      speakers: [
        {
          name: 'Terisa Griffin',
          role: 'Featured Honoree',
          bio: 'Celebrated vocalist, performer, and cultural voice.',
        },
        {
          name: 'WaveNation Host',
          role: 'Event Host',
          bio: 'Guiding the audience through the evening’s celebration.',
        },
      ],
    }
  }
}

function formatEventDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(dateString))
}

export default async function TerisaPage() {
  const event = await getTerisaEvent()

  const startText = formatEventDate(event.start)
  const isLive =
    event.status === 'live' || event.status === 'started' || event.status === 'ongoing'

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>Women’s History Month</span>
                <span className={styles.badgeAlt}>
                  {event.accessLabel || 'Private Virtual Event'}
                </span>
                {isLive ? (
                  <span className={styles.liveBadge}>Live Now</span>
                ) : (
                  <span className={styles.statusBadge}>Virtual Experience</span>
                )}
              </div>

              <h1 className={styles.title}>{event.name}</h1>

              <p className={styles.summary}>{event.summary}</p>

              <div className={styles.metaCard}>
                <div>
                  <span className={styles.metaLabel}>Date & Time</span>
                  <p className={styles.metaValue}>{startText}</p>
                </div>

                <div>
                  <span className={styles.metaLabel}>Location</span>
                  <p className={styles.metaValue}>
                    {event.venue || 'Private Virtual Event'}
                  </p>
                </div>
              </div>

              <div className={styles.actions}>
                <Link
                  href={event.eventbriteUrl || '#'}
                  className={styles.primaryButton}
                >
                  Reserve Your Spot
                </Link>

                <Link
                  href={event.streamUrl || '/live/terisa'}
                  className={styles.secondaryButton}
                >
                  Enter Event
                </Link>
              </div>

              <p className={styles.helperText}>
                Registration can be handled through Eventbrite, while live access
                stays inside the WaveNation experience.
              </p>
            </div>

            <aside className={styles.heroPanel}>
              <div className={styles.videoCard}>
                <div className={styles.videoPlaceholder}>
                  <span className={styles.videoEyebrow}>WaveNation Live</span>
                  <h2 className={styles.videoTitle}>Private Event Stream</h2>
                  <p className={styles.videoText}>
                    Use this area for your embedded private player, countdown, or
                    guest waiting room.
                  </p>

                  <div className={styles.videoActions}>
                    <Link
                      href={event.streamUrl || '/live/terisa'}
                      className={styles.videoButton}
                    >
                      Go to Stream
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>About the Event</span>
            <h2 className={styles.sectionTitle}>A celebration of voice, impact, and legacy</h2>
            <p className={styles.sectionText}>
              This private WaveNation virtual event honors Terisa Griffin during
              Women’s History Month with conversation, storytelling, music, and a
              shared moment of community.
            </p>
          </div>

          <div className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <h3 className={styles.cardTitle}>What to Expect</h3>
              <p className={styles.cardText}>
                Expect a polished virtual experience with a hosted program,
                tribute moments, featured reflections, and a premium live
                presentation designed for the WaveNation audience.
              </p>
            </article>

            <article className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Access</h3>
              <p className={styles.cardText}>
                Guests register through Eventbrite and access the stream through
                WaveNation, giving you stronger brand control and a better private
                event experience.
              </p>
            </article>

            <article className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Replay Strategy</h3>
              <p className={styles.cardText}>
                After the live event, you can offer a limited replay window or
                archive it as premium content on the platform.
              </p>
            </article>
          </div>
        </div>
      </section>

      {!!event.agenda?.length && (
        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>Program</span>
              <h2 className={styles.sectionTitle}>Event agenda</h2>
            </div>

            <div className={styles.agendaList}>
              {event.agenda.map((item) => (
                <article key={`${item.time}-${item.title}`} className={styles.agendaItem}>
                  <div className={styles.agendaTime}>{item.time}</div>
                  <div className={styles.agendaContent}>
                    <h3 className={styles.agendaTitle}>{item.title}</h3>
                    {item.description ? (
                      <p className={styles.agendaDescription}>{item.description}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!event.speakers?.length && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>Featured</span>
              <h2 className={styles.sectionTitle}>Speakers & special guests</h2>
            </div>

            <div className={styles.speakerGrid}>
              {event.speakers.map((speaker) => (
                <article key={speaker.name} className={styles.speakerCard}>
                  <div className={styles.speakerAvatar}>
                    {speaker.name.charAt(0)}
                  </div>
                  <h3 className={styles.speakerName}>{speaker.name}</h3>
                  <p className={styles.speakerRole}>{speaker.role}</p>
                  {speaker.bio ? (
                    <p className={styles.speakerBio}>{speaker.bio}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <span className={styles.sectionEyebrow}>Reserve Access</span>
              <h2 className={styles.ctaTitle}>Register now and join on WaveNation</h2>
              <p className={styles.ctaText}>
                Use Eventbrite for registration and WaveNation for the private
                premium viewing experience.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href={event.eventbriteUrl || '#'} className={styles.primaryButton}>
                Register on Eventbrite
              </Link>
              <Link href={event.streamUrl || '/live/terisa'} className={styles.secondaryButton}>
                View Event Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}