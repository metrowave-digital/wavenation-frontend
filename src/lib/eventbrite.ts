const EVENTBRITE_API_BASE = 'https://www.eventbriteapi.com/v3'

function getPrivateToken() {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN

  if (!token) {
    throw new Error('Missing EVENTBRITE_PRIVATE_TOKEN')
  }

  return token
}

function getOrganizationId() {
  const organizationId = process.env.EVENTBRITE_ORGANIZATION_ID

  if (!organizationId) {
    throw new Error('Missing EVENTBRITE_ORGANIZATION_ID')
  }

  return organizationId
}

async function eventbriteFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getPrivateToken()

  const response = await fetch(`${EVENTBRITE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Eventbrite API error (${response.status}): ${errorText}`,
    )
  }

  return response.json() as Promise<T>
}

export type EventbriteListEvent = {
  id: string
  name?: { text?: string; html?: string }
  summary?: string
  description?: { text?: string; html?: string }
  url?: string
  status?: string
  start?: {
    timezone?: string
    local?: string
    utc?: string
  }
  end?: {
    timezone?: string
    local?: string
    utc?: string
  }
  logo?: {
    original?: {
      url?: string
    }
  } | null
  online_event?: boolean
  venue_id?: string | null
  is_free?: boolean
  capacity?: number | null
}

export type EventbriteOrganizationEventsResponse = {
  events: EventbriteListEvent[]
  pagination?: {
    object_count?: number
    page_number?: number
    page_size?: number
    page_count?: number
    has_more_items?: boolean
  }
}

export type EventbriteSingleEventResponse = EventbriteListEvent

export async function getEventbriteOrganizationEvents(params?: {
  status?: string
  page?: number
  expand?: string[]
}): Promise<EventbriteOrganizationEventsResponse> {
  const organizationId = getOrganizationId()

  const searchParams = new URLSearchParams()

  if (params?.status) searchParams.set('status', params.status)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.expand?.length) {
    searchParams.set('expand', params.expand.join(','))
  }

  const qs = searchParams.toString()
  const path = `/organizations/${organizationId}/events/${qs ? `?${qs}` : ''}`

  return eventbriteFetch<EventbriteOrganizationEventsResponse>(path)
}

export async function getEventbriteEventById(
  id: string,
  params?: { expand?: string[] },
): Promise<EventbriteSingleEventResponse> {
  const searchParams = new URLSearchParams()

  if (params?.expand?.length) {
    searchParams.set('expand', params.expand.join(','))
  }

  const qs = searchParams.toString()
  const path = `/events/${id}/${qs ? `?${qs}` : ''}`

  return eventbriteFetch<EventbriteSingleEventResponse>(path)
}