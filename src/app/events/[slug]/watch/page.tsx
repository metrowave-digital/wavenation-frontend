import { notFound, redirect } from 'next/navigation'
import styles from './WatchPage.module.css'
import { CloudflarePlayer } from '../../components/CloudflarePlayer'
import { EventSidebar } from '../../components/EventSidebar'

type EventStatus =
  | 'scheduled'
  | 'prelive'
  | 'live'
  | 'ended'
  | 'replay'

type WatchEvent = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  description: unknown
  eventType: string | null
  status: EventStatus
  rawStatus: string | null
  startAt: string | null
  endAt: string | null
  timezone: string | null

  heroImage: {
    url: string | null
    alt: string | null
    width: number | null
    height: number | null
    sizes: {
      hero: string | null
      card: string | null
      thumb: string | null
      square: string | null
    }
  } | null

  hostName: string | null
  guestName: string[]
  sponsorNames: string[]
  agenda: Array<{
    time: string | null
    title: string | null
    description: string | null
  }>
  faq: Array<{
    question: string | null
    answer: string | null
  }>

  virtualEventLabel: string | null
  livestreamPlatform: string | null
  livestreamAccessInstructions: string | null
  streamEmbedUrl: string | null
  streamProviderLabel: string | null
  streamHealthStatus:
    | 'unknown'
    | 'ready'
    | 'testing'
    | 'live'
    | 'issue'
    | 'offline'

  watchPageEnabled: boolean
  watchPagePath: string | null
  visibility: 'public' | 'private' | 'unlisted'
  accessType: 'open' | 'ticketed' | 'invite-only' | 'members-only' | null
  registrationRequired: boolean
  loginRequired: boolean
  ticketVerificationRequired: boolean
  memberTierRequired: string | null
  accessCodeLabel: string | null
  accessDeniedMessage: string | null

  playbackId: string | null
  replayPlaybackId: string | null
  replayUrl: string | null
  replayEnabled: boolean
  replayAvailableImmediately: boolean
  replayAvailableAt: string | null
  replayExpiresAt: string | null
  replayLabel: string | null

  preLiveMessage: string | null
  postEventMessage: string | null
  viewerNotice: string | null
  audienceGuidelines: string | null

  chatEnabled: boolean
  qaEnabled: boolean
  reactionsEnabled: boolean
  chatMode: 'disabled' | 'native' | 'qa-only' | 'external'
  chatEmbedUrl: string | null
  qaPrompt: string | null

  ctaLabel: string | null
  ctaUrl: string | null
  eventbriteEventId: string | null
  eventbriteUrl: string | null

  producerName: string | null
  moderatorName: string | null
  technicalDirectorName: string | null

  contentVertical: string | null
  promotionTier: string | null
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getEventBySlug(slug: string): Promise<WatchEvent | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'

  try {
    const res = await fetch(`${baseUrl}/api/events/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) return null

    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found | WaveNation',
    }
  }

  return {
    title: `${event.title} | Watch | WaveNation`,
    description:
      event.excerpt || `Watch ${event.title} on WaveNation.`,
    openGraph: {
      title: `${event.title} | Watch | WaveNation`,
      description:
        event.excerpt || `Watch ${event.title} on WaveNation.`,
      images: event.heroImage?.sizes.hero
        ? [event.heroImage.sizes.hero]
        : event.heroImage?.url
          ? [event.heroImage.url]
          : [],
    },
  }
}

/**
 * Replace this with your real Auth0 / Eventbrite / membership check.
 * This is intentionally permissive for public/open setup while
 * still supporting the new collection fields.
 */
async function canUserWatchEvent(
  event: WatchEvent,
): Promise<boolean> {
  if (!event.watchPageEnabled) return false

  if (
    event.visibility === 'public' &&
    !event.loginRequired &&
    !event.ticketVerificationRequired &&
    event.accessType !== 'members-only'
  ) {
    return true
  }

  /**
   * TODO:
   * - read Auth0 session
   * - verify Eventbrite registration
   * - verify membership tier
   * - verify invite-only access
   */
  return false
}

function formatEventTime(
  dateString?: string | null,
  timezone?: string | null,
) {
  if (!dateString) return null

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  }).format(new Date(dateString))
}

function getPlaybackSource(event: WatchEvent) {
  if (event.status === 'replay') {
    return {
      playbackId: event.replayPlaybackId || event.playbackId,
      embedUrl: event.replayUrl || event.streamEmbedUrl,
    }
  }

  return {
    playbackId: event.playbackId,
    embedUrl: event.streamEmbedUrl,
  }
}

export default async function WatchPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) notFound()

  if (!event.watchPageEnabled) {
    redirect(`/events/${event.slug}`)
  }

  const allowed = await canUserWatchEvent(event)

  if (!allowed) {
    redirect(`/events/${event.slug}`)
  }

  const isScheduled =
    event.status === 'scheduled' || event.status === 'prelive'
  const isLive = event.status === 'live'
  const isReplay = event.status === 'replay'
  const isEnded = event.status === 'ended'

  const source = getPlaybackSource(event)
  const showPlayer = Boolean((isLive || isReplay) && (source.playbackId || source.embedUrl))

  const heroImage =
    event.heroImage?.sizes.hero || event.heroImage?.url || null

  return (
    <main className={styles.page}>
      {heroImage ? (
        <div
          className={styles.backdrop}
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
      ) : null}

      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {event.heroImage?.sizes.card || event.heroImage?.url ? (
            <img
              src={event.heroImage.sizes.card || event.heroImage.url || ''}
              alt={event.heroImage.alt || event.title}
              className={styles.heroImage}
            />
          ) : (
            <div className={styles.heroImageFallback} />
          )}
        </div>

        <div className={styles.heroText}>
          <div className={styles.badges}>
            {isLive && <span className={styles.liveBadge}>LIVE</span>}
            {isReplay && (
              <span className={styles.replayBadge}>
                {event.replayLabel || 'REPLAY'}
              </span>
            )}
            {isScheduled && (
              <span className={styles.soonBadge}>STARTS SOON</span>
            )}
            {event.streamProviderLabel ? (
              <span className={styles.metaBadge}>
                {event.streamProviderLabel}
              </span>
            ) : null}
            {event.contentVertical ? (
              <span className={styles.metaBadge}>
                {event.contentVertical.toUpperCase()}
              </span>
            ) : null}
          </div>

          <h1 className={styles.title}>{event.title}</h1>

          {event.excerpt ? (
            <p className={styles.description}>{event.excerpt}</p>
          ) : null}

          <div className={styles.meta}>
            {event.startAt ? (
              <span>
                Starts:{' '}
                {formatEventTime(event.startAt, event.timezone)}
              </span>
            ) : null}
            {event.hostName ? <span>Host: {event.hostName}</span> : null}
            {event.guestName.length ? (
              <span>Guest: {event.guestName.join(', ')}</span>
            ) : null}
            {event.accessType ? (
              <span>Access: {event.accessType}</span>
            ) : null}
          </div>

          {event.viewerNotice ? (
            <div className={styles.notice}>{event.viewerNotice}</div>
          ) : null}
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.playerColumn}>
          {isScheduled && (
            <div className={styles.stateCard}>
              <h2>We’re getting ready</h2>
              <p>
                {event.preLiveMessage ||
                  'This event has not started yet. Please stay on this page.'}
              </p>

              {event.startAt ? (
                <p className={styles.subtle}>
                  Scheduled start:{' '}
                  {formatEventTime(event.startAt, event.timezone)}
                </p>
              ) : null}

              {event.livestreamAccessInstructions ? (
                <p className={styles.subtle}>
                  {event.livestreamAccessInstructions}
                </p>
              ) : null}
            </div>
          )}

          {showPlayer ? (
            <CloudflarePlayer
              playbackId={source.playbackId}
              embedUrl={source.embedUrl}
              title={event.title}
              autoplay={isLive}
            />
          ) : null}

          {isEnded && !isReplay && (
            <div className={styles.stateCard}>
              <h2>This live event has ended</h2>
              <p>
                {event.postEventMessage ||
                  'Thanks for watching. Replay access may be available soon.'}
              </p>
            </div>
          )}

          {!showPlayer && (isLive || isReplay) && (
            <div className={styles.stateCard}>
              <h2>Player not available</h2>
              <p>
                This event is active, but no playback source is currently configured.
              </p>
            </div>
          )}

          <div className={styles.panel}>
            <h2>About this event</h2>
            {event.excerpt ? (
              <p>{event.excerpt}</p>
            ) : (
              <p>
                Stay tuned for more coverage, updates, and replay information on WaveNation.
              </p>
            )}
          </div>

          {event.agenda.length ? (
            <div className={styles.panel}>
              <h2>Agenda</h2>
              <div className={styles.stack}>
                {event.agenda.map((item, index) => (
                  <div key={`${item.title}-${index}`} className={styles.agendaItem}>
                    {item.time ? (
                      <div className={styles.agendaTime}>{item.time}</div>
                    ) : null}
                    <div>
                      {item.title ? (
                        <h3 className={styles.agendaTitle}>{item.title}</h3>
                      ) : null}
                      {item.description ? (
                        <p className={styles.agendaDescription}>
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {event.audienceGuidelines ? (
            <div className={styles.panel}>
              <h2>Audience Guidelines</h2>
              <p>{event.audienceGuidelines}</p>
            </div>
          ) : null}
        </div>

        <aside className={styles.sidebarColumn}>
          <EventSidebar
  slug={event.slug}
  title={event.title}
  isLive={isLive}
  chatEnabled={event.chatEnabled}
  qaEnabled={event.qaEnabled}
  chatMode={event.chatMode}
  chatEmbedUrl={event.chatEmbedUrl}
  qaPrompt={event.qaPrompt}
  ctaLabel={event.ctaLabel}
  ctaUrl={event.ctaUrl}
  eventbriteUrl={event.eventbriteUrl}
  streamHealthStatus={event.streamHealthStatus}
  producerName={event.producerName}
  moderatorName={event.moderatorName}
  technicalDirectorName={event.technicalDirectorName}
/>
        </aside>
      </section>
    </main>
  )
}