'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ChartsPageImpression() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'charts_editorial',
    })
  }, [])

  return null
}

export function ChartMetricImpression({
  metric,
  track,
  artist,
}: {
  metric: string
  track?: string
  artist?: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'chart_metric',
      metric,
      track,
      artist,
    })
  }, [metric, track, artist])

  return null
}
