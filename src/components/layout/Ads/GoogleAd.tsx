'use client'

import { useEffect } from 'react'

interface GoogleAdProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'horizontal'
  responsive?: boolean
}

export function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
}: GoogleAdProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch (err) {
      console.warn('AdSense error', err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-6631983121456407"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}
