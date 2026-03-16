import { NextResponse } from 'next/server'
import { getEventbriteOrganizationEvents } from '@/lib/eventbrite'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') || undefined
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : undefined

    const data = await getEventbriteOrganizationEvents({
      status,
      page,
      expand: ['logo', 'venue'],
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Eventbrite events route error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Eventbrite events',
      },
      { status: 500 },
    )
  }
}