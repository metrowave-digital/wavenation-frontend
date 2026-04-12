import { getEvents } from '@/services/events.api'
import { WNEvent } from '@/types/event'
import EventHomeClient from './EventHomeClient'

export default async function EventHomeFeature({ manualEventId }: { manualEventId?: string }) {
  let featuredEvent: WNEvent | null = null

  // 1. If manually pinned, get that event
  if (manualEventId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/events/${manualEventId}?depth=2`)
    featuredEvent = await res.json()
  } else {
    // 2. Auto-Logic: Check for LIVE virtual events first
    const liveRes = await getEvents({
      where: { status: 'live', eventType: 'virtual', visibility: 'public' },
      limit: 1
    })
    
    if (liveRes.docs && liveRes.docs.length > 0) {
      featuredEvent = liveRes.docs[0] as unknown as WNEvent
    } else {
      // 3. Fallback: Get the next upcoming featured event
      const upcomingRes = await getEvents({
        where: { visibility: 'public', _status: 'published' },
        sort: 'startDate', // Closest to now
        limit: 1
      })
      featuredEvent = upcomingRes.docs[0] as unknown as WNEvent
    }
  }

  if (!featuredEvent) return null

  return <EventHomeClient event={featuredEvent} />
}