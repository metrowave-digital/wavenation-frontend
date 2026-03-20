import { NextRequest, NextResponse } from 'next/server'
import {
  getCMSBaseUrl,
  getCMSHeaders,
  isModeratorAuthenticated,
} from '@/lib/moderatorAuth'

type PayloadEvent = {
  id: number | string
  slug: string
}

async function getEventBySlug(slug: string): Promise<PayloadEvent | null> {
  const url = new URL('/api/events', getCMSBaseUrl())
  url.searchParams.set('where[slug][equals]', slug)
  url.searchParams.set('limit', '1')
  url.searchParams.set('depth', '0')
  url.searchParams.set('draft', 'false')

  const res = await fetch(url.toString(), {
    headers: getCMSHeaders(),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch event: ${res.status}`)
  }

  const data = await res.json()
  return data?.docs?.[0] || null
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const authed = await isModeratorAuthenticated()
  if (!authed) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 },
    )
  }

  try {
    const { slug } = await context.params
    const event = await getEventBySlug(slug)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      )
    }

    const status =
      request.nextUrl.searchParams.get('status') || 'pending'

    const url = new URL('/api/event-chat-messages', getCMSBaseUrl())
    url.searchParams.set('where[event][equals]', String(event.id))
    url.searchParams.set('where[status][equals]', status)
    url.searchParams.set('sort', '-isPinned,-createdAt')
    url.searchParams.set('limit', '100')
    url.searchParams.set('depth', '0')

    const res = await fetch(url.toString(), {
      headers: getCMSHeaders(),
      cache: 'no-store',
    })

    const data = await res.json()

    return NextResponse.json(
      {
        docs: Array.isArray(data?.docs) ? data.docs : [],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[moderator chat GET]', error)
    return NextResponse.json(
      { error: 'Failed to load chat.' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  _context: { params: Promise<{ slug: string }> },
) {
  const authed = await isModeratorAuthenticated()
  if (!authed) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 },
    )
  }

  try {
    const body = await request.json()
    const id = body?.id
    const status = body?.status
    const isPinned = body?.isPinned
    const isAnnouncement = body?.isAnnouncement
    const moderatorNotes = body?.moderatorNotes

    if (!id) {
      return NextResponse.json(
        { error: 'Missing chat message id.' },
        { status: 400 },
      )
    }

    const allowedStatuses = [
      'approved',
      'pending',
      'rejected',
      'hidden',
    ]

    const updateData: Record<string, unknown> = {}

    if (
      typeof status === 'string' &&
      allowedStatuses.includes(status)
    ) {
      updateData.status = status
    }

    if (typeof isPinned === 'boolean') {
      updateData.isPinned = isPinned
    }

    if (typeof isAnnouncement === 'boolean') {
      updateData.isAnnouncement = isAnnouncement
    }

    if (typeof moderatorNotes === 'string') {
      updateData.moderatorNotes = moderatorNotes
    }

    const res = await fetch(
      `${getCMSBaseUrl()}/api/event-chat-messages/${id}`,
      {
        method: 'PATCH',
        headers: getCMSHeaders(),
        body: JSON.stringify(updateData),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.errors?.[0]?.message || 'Update failed.' },
        { status: 500 },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('[moderator chat PATCH]', error)
    return NextResponse.json(
      { error: 'Failed to update chat message.' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const authed = await isModeratorAuthenticated()
  if (!authed) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 },
    )
  }

  try {
    const { slug } = await context.params
    const event = await getEventBySlug(slug)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      )
    }

    const body = await request.json()
    const name =
      typeof body?.name === 'string' && body.name.trim()
        ? body.name.trim()
        : 'Moderator'
    const role =
      typeof body?.role === 'string' ? body.role : 'moderator'
    const message =
      typeof body?.message === 'string' ? body.message.trim() : ''

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 },
      )
    }

    const res = await fetch(
      `${getCMSBaseUrl()}/api/event-chat-messages`,
      {
        method: 'POST',
        headers: getCMSHeaders(),
        body: JSON.stringify({
          event: event.id,
          name,
          role,
          message,
          status: 'approved',
          isAnnouncement: Boolean(body?.isAnnouncement),
          isPinned: Boolean(body?.isPinned),
          source: 'moderator',
        }),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.errors?.[0]?.message || 'Create failed.' },
        { status: 500 },
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[moderator chat POST]', error)
    return NextResponse.json(
      { error: 'Failed to post moderator message.' },
      { status: 500 },
    )
  }
}