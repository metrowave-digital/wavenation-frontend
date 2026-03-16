import { NextResponse } from 'next/server'
import { getEventbriteEventById } from '@/lib/eventbrite'

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Props) {
  try {
    const { id } = await params

    const data = await getEventbriteEventById(id, {
      expand: ['logo', 'venue', 'ticket_classes'],
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Eventbrite event detail route error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Eventbrite event',
      },
      { status: 500 },
    )
  }
}