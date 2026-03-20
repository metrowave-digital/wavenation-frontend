import { notFound, redirect } from 'next/navigation'
import styles from './WatchPage.module.css'

import { CloudflarePlayer } from '../../components/watch/CloudflarePlayer/CloudflarePlayer'
import { WatchHero } from '../../components/watch/WatchHero/WatchHero'
import { WatchStateCard } from '../../components/watch/WatchStateCard/WatchStateCard'
import { WatchAccessGate } from '../../components/watch/WatchAccessGate/WatchAccessGate'
import { WatchAboutPanel } from '../../components/watch/WatchAboutPanel/WatchAboutPanel'
import { WatchAgendaPanel } from '../../components/watch/WatchAgendaPanel/WatchAgendaPanel'
import { WatchGuidelinesPanel } from '../../components/watch/WatchGuidelinesPanel/WatchGuidelinesPanel'
import { WatchSidebar } from '../../components/watch/WatchSidebar/WatchSidebar'

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

  const description =
    event.excerpt || `Watch ${event.title} on WaveNation.`

  const image =
    event.heroImage?.sizes.hero ||
    event.heroImage?.url ||
    undefined

  return {
    title: `${event.title} | Watch | WaveNation`,
    description,
    openGraph: {
      title: `${event.title} | Watch | WaveNation`,
      description,
      images: image ? [image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} | Watch | WaveNation`,
      description,
      images: image ? [image] : [],
    },
  }
}

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

function getAccessMessage(event: WatchEvent) {
  if (event.accessDeniedMessage) return event.accessDeniedMessage
  if (event.loginRequired) {
    return 'You must sign in to watch this event.'
  }
  if (event.ticketVerificationRequired) {
    return 'A verified ticket is required to watch this event.'
  }
  if (event.accessType === 'members-only') {
    return event.memberTierRequired
      ? `This event requires the ${event.memberTierRequired} membership tier.`
      : 'This event is available to members only.'
  }
  if (event.accessType === 'invite-only') {
    return 'This event is available by invitation only.'
  }
  return 'You do not currently have access to this watch page.'
}

export default async function WatchPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) notFound()

  if (!event.watchPageEnabled) {
    redirect(`/events/${event.slug}`)
  }

  const allowed = await canUserWatchEvent(event)

  const isScheduled =
    event.status === 'scheduled' || event.status === 'prelive'
  const isLive = event.status === 'live'
  const isReplay = event.status === 'replay'
  const isEnded = event.status === 'ended'

  const source = getPlaybackSource(event)
  const showPlayer = Boolean(
    (isLive || isReplay) &&
      (source.playbackId || source.embedUrl),
  )

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

      <div className={styles.shell}>
        <a href="#watch-player" className={styles.skipLink}>
          Skip to player
        </a>

        <WatchHero
          title={event.title}
          excerpt={event.excerpt}
          startAt={event.startAt}
          timezone={event.timezone}
          hostName={event.hostName}
          guestName={event.guestName}
          accessType={event.accessType}
          viewerNotice={event.viewerNotice}
          isLive={isLive}
          isReplay={isReplay}
          isScheduled={isScheduled}
          streamProviderLabel={event.streamProviderLabel}
          contentVertical={event.contentVertical}
          replayLabel={event.replayLabel}
          heroImage={event.heroImage}
        />

        <section className={styles.mainGrid}>
          <div className={styles.primaryColumn}>
            <div id="watch-player" className={styles.playerStack}>
              {!allowed ? (
                <WatchAccessGate
                  title={event.title}
                  message={getAccessMessage(event)}
                  accessType={event.accessType}
                  eventUrl={`/events/${event.slug}`}
                  loginRequired={event.loginRequired}
                  ticketVerificationRequired={
                    event.ticketVerificationRequired
                  }
                  memberTierRequired={event.memberTierRequired}
                  accessCodeLabel={event.accessCodeLabel}
                  eventbriteUrl={event.eventbriteUrl}
                />
              ) : null}

              {allowed && isScheduled ? (
                <WatchStateCard
                  heading="We’re getting ready"
                  body={
                    event.preLiveMessage ||
                    'This event has not started yet. Stay on this page for the live stream.'
                  }
                  tone="scheduled"
                  eventTime={formatEventTime(
                    event.startAt,
                    event.timezone,
                  )}
                  subcopy={event.livestreamAccessInstructions}
                />
              ) : null}

              {allowed && showPlayer ? (
                <CloudflarePlayer
                  playbackId={source.playbackId}
                  embedUrl={source.embedUrl}
                  title={event.title}
                  autoplay={isLive}
                />
              ) : null}

              {allowed && isEnded && !isReplay ? (
                <WatchStateCard
                  heading="This live event has ended"
                  body={
                    event.postEventMessage ||
                    'Thanks for watching. Replay access may be available soon.'
                  }
                  tone="ended"
                  eventTime={
                    event.replayAvailableAt
                      ? `Replay available: ${formatEventTime(
                          event.replayAvailableAt,
                          event.timezone,
                        )}`
                      : null
                  }
                />
              ) : null}

              {allowed && !showPlayer && (isLive || isReplay) ? (
                <WatchStateCard
                  heading="Player not available"
                  body="This event is active, but no playback source is currently configured."
                  tone="issue"
                  subcopy="Please check back shortly or visit the main event page for updates."
                />
              ) : null}
            </div>

            <div className={styles.contentStack}>
              <WatchAboutPanel
                title="About this event"
                excerpt={event.excerpt}
              />

              {event.agenda.length ? (
                <WatchAgendaPanel
                  items={event.agenda}
                  isLive={isLive}
                />
              ) : null}

              {event.audienceGuidelines ? (
                <WatchGuidelinesPanel
                  guidelines={event.audienceGuidelines}
                />
              ) : null}
            </div>
          </div>

          <aside className={styles.sidebarColumn}>
            <WatchSidebar
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
              startAt={event.startAt}
              timezone={event.timezone}
            />
          </aside>
        </section>
      </div>
    </main>
  )
}