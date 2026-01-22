'use client'

import { trackEvent } from '@/lib/analytics'

export function trackTrackImpression(payload: {
  album: string
  track: string
  position: number
}) {
  trackEvent('content_impression', {
    content_type: 'track',
    ...payload,
  })
}

export function trackTrackPlay(payload: {
  album: string
  track: string
  position: number
}) {
  trackEvent('content_click', {
    content_type: 'track',
    action: 'play',
    ...payload,
  })
}
