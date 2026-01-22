'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ChartGenreImpression({
  genre,
  title,
  week,
}: {
  genre: string
  title: string
  week: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'chart_genre',
      genre,
      title,
      week,
    })
  }, [genre, title, week])

  return null
}

export function ChartSectionImpression({
  section,
  genre,
  week,
}: {
  section: string
  genre: string
  week: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    trackEvent('content_impression', {
      content_type: 'chart_genre_section',
      section,
      genre,
      week,
    })
  }, [section, genre, week])

  return null
}
