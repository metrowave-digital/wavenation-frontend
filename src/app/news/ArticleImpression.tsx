'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

interface ArticleImpressionProps {
  slug: string
  title: string
  category?: string
  author?: string
}

export function ArticleImpression({
  slug,
  title,
  category,
  author,
}: ArticleImpressionProps) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    trackEvent('content_impression', {
      content_type: 'article',
      slug,
      title,
      category,
      author,
    })
  }, [slug, title, category, author])

  return null
}
