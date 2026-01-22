'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ChartsArchiveImpression() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'charts_archive',
    })
  }, [])

  return null
}

export function ChartArchiveItemImpression({
  chartKey,
  genre,
  year,
  week,
}: {
  chartKey: string
  genre?: string
  year?: number
  week?: number
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'chart_archive_item',
      chartKey,
      genre,
      year,
      week,
    })
  }, [chartKey, genre, year, week])

  return null
}
