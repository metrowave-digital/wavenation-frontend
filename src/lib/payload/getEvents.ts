export type PayloadMedia =
  | {
      id?: string | number
      url?: string
      alt?: string
      filename?: string
    }
  | string
  | null

export type PayloadEvent = {
  id: string | number
  title: string
  slug: string
  excerpt?: string
  description?: unknown
  eventType?: 'virtual' | 'in-person' | 'hybrid'
  status?: 'draft' | 'scheduled' | 'live' | 'ended'
  startDate?: string
  endDate?: string
  timezone?: string
  heroImage?: PayloadMedia
  thumbnail?: PayloadMedia
  hostName?: string | null
  guestName?: string[]
  sponsorNames?: string[]
  agenda?: Array<{
    id?: string
    time?: string
    title: string
    description?: string
  }>
  faq?: Array<{
    id?: string
    question: string
    answer: string
  }>
  virtualEventLabel?: string | null
  livestreamPlatform?: string | null
  livestreamAccessInstructions?: string | null
  eventbriteEventId?: string | null
  eventbriteUrl?: string | null
  isFeatured?: boolean
  replayUrl?: string | null
  contentVertical?: 'music' | 'culture' | 'faith' | 'creator' | 'radio' | 'tv'
  promotionTier?: 'flagship' | 'featured' | 'standard'
  onAirMention?: boolean
  homepagePlacement?: string
  relatedArticles?: unknown[]
  relatedRadioShows?: unknown[]
  relatedVOD?: unknown[]
  streamEmbedUrl?: string | null
  accessType?: 'open' | 'ticketed' | 'invite-only' | 'members-only'
  visibility?: 'public' | 'private' | 'unlisted'
  registrationRequired?: boolean
  capacity?: number | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

type PayloadDocsResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

function getPayloadBaseUrl() {
  const baseUrl =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.PAYLOAD_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL

  if (!baseUrl) {
    throw new Error(
      'Missing Payload base URL. Set PAYLOAD_PUBLIC_SERVER_URL, NEXT_PUBLIC_CMS_URL, PAYLOAD_URL, or NEXT_PUBLIC_SERVER_URL.',
    )
  }

  return baseUrl.replace(/\/$/, '')
}

export function getMediaUrl(media?: PayloadMedia): string | null {
  if (!media) return null
  if (typeof media === 'string') return media

  if (media.url?.startsWith('http://') || media.url?.startsWith('https://')) {
    return media.url
  }

  if (media.url) {
    return `${getPayloadBaseUrl()}${media.url}`
  }

  return null
}

export async function getEvents(params?: {
  limit?: number
  page?: number
  where?: Record<string, string | number | boolean>
  sort?: string
}): Promise<PayloadDocsResponse<PayloadEvent>> {
  const baseUrl = getPayloadBaseUrl()
  const searchParams = new URLSearchParams()

  searchParams.set('depth', '1')
  searchParams.set('limit', String(params?.limit ?? 12))
  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('sort', params?.sort ?? '-startDate')

  if (params?.where) {
    for (const [key, value] of Object.entries(params.where)) {
      searchParams.set(`where[${key}][equals]`, String(value))
    }
  }

  const response = await fetch(
    `${baseUrl}/api/events?${searchParams.toString()}`,
    {
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to fetch events: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }

  return response.json()
}

export async function getEventBySlug(
  slug: string,
): Promise<PayloadEvent | null> {
  const baseUrl = getPayloadBaseUrl()
  const searchParams = new URLSearchParams()

  searchParams.set('depth', '1')
  searchParams.set('limit', '1')
  searchParams.set('where[slug][equals]', slug)

  const response = await fetch(
    `${baseUrl}/api/events?${searchParams.toString()}`,
    {
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to fetch event by slug: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }

  const data = (await response.json()) as PayloadDocsResponse<PayloadEvent>
  return data.docs[0] ?? null
}