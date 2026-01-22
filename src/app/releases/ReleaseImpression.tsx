'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

interface ReleaseImpressionProps {
  slug: string
  title: string
  artist?: string
  label?: string
  releaseDate?: string | null
}

export function ReleaseImpression({
  slug,
  title,
  artist,
  label,
  releaseDate,
}: ReleaseImpressionProps) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    trackEvent('content_impression', {
      content_type: 'release',
      slug,
      title,
      artist,
      label,
      releaseDate,
    })
  }, [slug, title, artist, label, releaseDate])

  return null
}
