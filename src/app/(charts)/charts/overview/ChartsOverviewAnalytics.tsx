'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ChartsOverviewImpression() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'charts_overview',
    })
  }, [])

  return null
}

export function ChartCardImpression({
  chartKey,
  label,
  week,
}: {
  chartKey: string
  label: string
  week: number
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'chart_card',
      chartKey,
      label,
      week,
    })
  }, [chartKey, label, week])

  return null
}
