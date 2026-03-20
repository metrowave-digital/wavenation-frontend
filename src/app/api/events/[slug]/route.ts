import { NextRequest, NextResponse } from 'next/server'

type PayloadMediaSize = {
  url?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filesize?: number | null
  filename?: string | null
}

type PayloadMedia = {
  id?: number | string
  alt?: string | null
  caption?: string | null
  credit?: string | null
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  sizes?: {
    hero?: PayloadMediaSize
    card?: PayloadMediaSize
    thumb?: PayloadMediaSize
    square?: PayloadMediaSize
    [key: string]: PayloadMediaSize | undefined
  } | null
}

type PayloadEvent = {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  description?: unknown
  eventType?: string | null
  status?: string | null
  startDate?: string | null
  endDate?: string | null
  timezone?: string | null
  heroImage?: PayloadMedia | null
  thumbnail?: PayloadMedia | null
  hostName?: string | null
  guestName?: string[] | string | null
  sponsorNames?: string[] | null
  agenda?: Array<{
    time?: string | null
    title?: string | null
    description?: string | null
  }> | null
  faq?: Array<{
    question?: string | null
    answer?: string | null
  }> | null
  virtualEventLabel?: string | null
  livestreamPlatform?: string | null
  replayUrl?: string | null
  livestreamAccessInstructions?: string | null
  streamEmbedUrl?: string | null
  eventbriteEventId?: string | null
  eventbriteUrl?: string | null
  eventbriteSyncEnabled?: boolean | null
  eventbriteLastSyncedAt?: string | null
  visibility?: 'public' | 'private' | 'unlisted' | null
  accessType?: 'open' | 'ticketed' | 'invite-only' | 'members-only' | null
  registrationRequired?: boolean | null
  capacity?: number | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  contentVertical?: string | null
  promotionTier?: string | null
  isFeatured?: boolean | null
  updatedAt?: string | null
  createdAt?: string | null
  _status?: 'draft' | 'published' | null

  watchPageEnabled?: boolean | null
  watchPagePath?: string | null
  cloudflarePlaybackId?: string | null
  cloudflareReplayPlaybackId?: string | null
  streamProviderLabel?: string | null
  streamHealthStatus?:
    | 'unknown'
    | 'ready'
    | 'testing'
    | 'live'
    | 'issue'
    | 'offline'
    | null
  preLiveMessage?: string | null
  postEventMessage?: string | null
  streamTestingNotes?: string | null

  chatEnabled?: boolean | null
  qaEnabled?: boolean | null
  reactionsEnabled?: boolean | null
  chatMode?: 'disabled' | 'native' | 'qa-only' | 'external' | null
  chatEmbedUrl?: string | null
  qaPrompt?: string | null
  viewerNotice?: string | null
  audienceGuidelines?: string | null

  replayEnabled?: boolean | null
  replayAvailableImmediately?: boolean | null
  replayAvailableAt?: string | null
  replayExpiresAt?: string | null
  replayLabel?: string | null
  replayThumbnailOverride?: PayloadMedia | null

  loginRequired?: boolean | null
  ticketVerificationRequired?: boolean | null
  memberTierRequired?: string | null
  accessCodeLabel?: string | null
  accessDeniedMessage?: string | null

  producerName?: string | null
  moderatorName?: string | null
  technicalDirectorName?: string | null
  runOfShowUrl?: string | null
  greenRoomUrl?: string | null
  productionNotes?: string | null
}

type WatchEventStatus =
  | 'scheduled'
  | 'prelive'
  | 'live'
  | 'ended'
  | 'replay'

type WatchEventResponse = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  description: unknown
  eventType: string | null
  status: WatchEventStatus
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

  thumbnail: {
    url: string | null
    alt: string | null
    width: number | null
    height: number | null
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
  eventbriteSyncEnabled: boolean
  eventbriteLastSyncedAt: string | null

  producerName: string | null
  moderatorName: string | null
  technicalDirectorName: string | null
  runOfShowUrl: string | null
  greenRoomUrl: string | null
  productionNotes: string | null

  contentVertical: string | null
  promotionTier: string | null
  isFeatured: boolean
  updatedAt: string | null
  createdAt: string | null
}

function absoluteMediaUrl(url?: string | null): string | null {
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const cmsUrl =
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    ''

  if (!cmsUrl) return url

  return `${cmsUrl.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`
}

function normalizeGuestNames(
  value?: string[] | string | null,
): string[] {
  if (Array.isArray(value)) {
    return value
      .map(item => item?.trim())
      .filter(Boolean) as string[]
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }

  return []
}

function extractPlaybackIdFromEmbedUrl(
  streamEmbedUrl?: string | null,
): string | null {
  if (!streamEmbedUrl) return null

  const match = streamEmbedUrl.match(
    /(?:cloudflarestream\.com|videodelivery\.net)\/([a-zA-Z0-9]+)(?:\/iframe)?/,
  )

  return match?.[1] ?? null
}

function isReplayAvailable(event: PayloadEvent) {
  if (event.replayEnabled !== true && !event.replayUrl && !event.cloudflareReplayPlaybackId) {
    return false
  }

  if (event.replayAvailableImmediately) return true

  if (event.replayAvailableAt) {
    return new Date(event.replayAvailableAt).getTime() <= Date.now()
  }

  return false
}

function normalizeStatus(event: PayloadEvent): WatchEventStatus {
  if (isReplayAvailable(event)) return 'replay'

  switch (event.status) {
    case 'scheduled':
      return 'scheduled'
    case 'live':
      return 'live'
    case 'ended':
      return 'ended'
    case 'prelive':
      return 'prelive'
    case 'replay':
      return 'replay'
    default:
      return 'scheduled'
  }
}

function normalizeEvent(event: PayloadEvent): WatchEventResponse {
  const playbackId =
    event.cloudflarePlaybackId ??
    extractPlaybackIdFromEmbedUrl(event.streamEmbedUrl) ??
    null

  return {
    id: String(event.id),
    slug: event.slug,
    title: event.title,
    excerpt: event.excerpt ?? null,
    description: event.description ?? null,
    eventType: event.eventType ?? null,
    status: normalizeStatus(event),
    rawStatus: event.status ?? null,
    startAt: event.startDate ?? null,
    endAt: event.endDate ?? null,
    timezone: event.timezone ?? null,

    heroImage: event.heroImage
      ? {
          url: absoluteMediaUrl(event.heroImage.url),
          alt: event.heroImage.alt ?? null,
          width: event.heroImage.width ?? null,
          height: event.heroImage.height ?? null,
          sizes: {
            hero: absoluteMediaUrl(event.heroImage.sizes?.hero?.url ?? null),
            card: absoluteMediaUrl(event.heroImage.sizes?.card?.url ?? null),
            thumb: absoluteMediaUrl(event.heroImage.sizes?.thumb?.url ?? null),
            square: absoluteMediaUrl(event.heroImage.sizes?.square?.url ?? null),
          },
        }
      : null,

    thumbnail: event.thumbnail
      ? {
          url: absoluteMediaUrl(event.thumbnail.url),
          alt: event.thumbnail.alt ?? null,
          width: event.thumbnail.width ?? null,
          height: event.thumbnail.height ?? null,
        }
      : null,

    hostName: event.hostName ?? null,
    guestName: normalizeGuestNames(event.guestName),
    sponsorNames: event.sponsorNames ?? [],
    agenda: (event.agenda ?? []).map(item => ({
      time: item?.time ?? null,
      title: item?.title ?? null,
      description: item?.description ?? null,
    })),
    faq: (event.faq ?? []).map(item => ({
      question: item?.question ?? null,
      answer: item?.answer ?? null,
    })),

    virtualEventLabel: event.virtualEventLabel ?? 'Join Stream',
    livestreamPlatform: event.livestreamPlatform ?? null,
    livestreamAccessInstructions: event.livestreamAccessInstructions ?? null,
    streamEmbedUrl: event.streamEmbedUrl ?? null,
    streamProviderLabel: event.streamProviderLabel ?? null,
    streamHealthStatus: event.streamHealthStatus ?? 'unknown',

    watchPageEnabled: Boolean(event.watchPageEnabled),
    watchPagePath: event.watchPagePath ?? null,
    visibility: event.visibility ?? 'public',
    accessType: event.accessType ?? null,
    registrationRequired: Boolean(event.registrationRequired),
    loginRequired: Boolean(event.loginRequired),
    ticketVerificationRequired: Boolean(event.ticketVerificationRequired),
    memberTierRequired: event.memberTierRequired ?? null,
    accessCodeLabel: event.accessCodeLabel ?? null,
    accessDeniedMessage: event.accessDeniedMessage ?? null,

    playbackId,
    replayPlaybackId: event.cloudflareReplayPlaybackId ?? null,
    replayUrl: event.replayUrl ?? null,
    replayEnabled: Boolean(event.replayEnabled),
    replayAvailableImmediately: Boolean(event.replayAvailableImmediately),
    replayAvailableAt: event.replayAvailableAt ?? null,
    replayExpiresAt: event.replayExpiresAt ?? null,
    replayLabel: event.replayLabel ?? null,

    preLiveMessage: event.preLiveMessage ?? null,
    postEventMessage: event.postEventMessage ?? null,
    viewerNotice: event.viewerNotice ?? null,
    audienceGuidelines: event.audienceGuidelines ?? null,

    chatEnabled: Boolean(event.chatEnabled),
    qaEnabled: Boolean(event.qaEnabled),
    reactionsEnabled: Boolean(event.reactionsEnabled),
    chatMode: event.chatMode ?? 'disabled',
    chatEmbedUrl: event.chatEmbedUrl ?? null,
    qaPrompt: event.qaPrompt ?? null,

    ctaLabel: event.ctaLabel ?? null,
    ctaUrl: event.ctaUrl ?? null,
    eventbriteEventId: event.eventbriteEventId ?? null,
    eventbriteUrl: event.eventbriteUrl ?? null,
    eventbriteSyncEnabled: Boolean(event.eventbriteSyncEnabled),
    eventbriteLastSyncedAt: event.eventbriteLastSyncedAt ?? null,

    producerName: event.producerName ?? null,
    moderatorName: event.moderatorName ?? null,
    technicalDirectorName: event.technicalDirectorName ?? null,
    runOfShowUrl: event.runOfShowUrl ?? null,
    greenRoomUrl: event.greenRoomUrl ?? null,
    productionNotes: event.productionNotes ?? null,

    contentVertical: event.contentVertical ?? null,
    promotionTier: event.promotionTier ?? null,
    isFeatured: Boolean(event.isFeatured),
    updatedAt: event.updatedAt ?? null,
    createdAt: event.createdAt ?? null,
  }
}

async function getEventFromCMS(slug: string): Promise<PayloadEvent | null> {
  const cmsUrl =
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL

  if (!cmsUrl) {
    throw new Error(
      'Missing CMS URL. Set NEXT_PUBLIC_CMS_URL, CMS_URL, or PAYLOAD_PUBLIC_SERVER_URL.',
    )
  }

  const url = new URL('/api/events', cmsUrl)
  url.searchParams.set('where[slug][equals]', slug)
  url.searchParams.set('limit', '1')
  url.searchParams.set('depth', '2')
  url.searchParams.set('draft', 'false')

  const res = await fetch(url.toString(), {
    next: { revalidate: 30 },
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.PAYLOAD_API_KEY
        ? { Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}` }
        : {}),
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch event from CMS: ${res.status} ${res.statusText}`,
    )
  }

  const data = await res.json()
  const doc = Array.isArray(data?.docs) ? data.docs[0] : null

  return doc as PayloadEvent | null
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing event slug.' },
        { status: 400 },
      )
    }

    const event = await getEventFromCMS(slug)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(normalizeEvent(event), {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[api/events/[slug]] GET error:', error)

    return NextResponse.json(
      { error: 'Failed to load event.' },
      { status: 500 },
    )
  }
}