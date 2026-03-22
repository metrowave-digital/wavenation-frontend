'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './FooterBrand.module.css'
import { trackEvent } from '@/lib/analytics'

const CTA_LINKS = [
  { label: 'Listen', href: '/listen' },
  { label: 'Watch', href: '/watch' },
  { label: 'Creator Hub', href: '/creator-hub' },
]

export function FooterBrand() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterBrand',
      version: 'v3',
    })

    hasTracked.current = true
  }, [])

  function handleInteraction(type: 'click' | 'focus') {
    trackEvent('content_click', {
      placement: 'footer',
      component: 'FooterBrand',
      interaction: type,
      version: 'v3',
    })
  }

  function handleCtaClick(label: string, href: string) {
    trackEvent('footer_cta_click', {
      placement: 'footer',
      component: 'FooterBrand',
      label,
      href,
      version: 'v3',
    })
  }

  return (
    <section
      className={styles.brand}
      aria-labelledby="footer-brand-title"
      tabIndex={0}
      onClick={() => handleInteraction('click')}
      onFocus={() => handleInteraction('focus')}
    >
      <div className={styles.header}>

        <span className={styles.kicker}>WaveNation Media</span>
      </div>

      <div className={styles.body}>
        <h3 id="footer-brand-title" className={styles.title}>
          Sound. Story. Screens.
        </h3>

        <p className={styles.tagline}>
          Culture-forward radio, streaming, editorial, and creator experiences
          built for the voices shaping what’s next.
        </p>

        <p className={styles.mission}>
          Built for the now. Rooted in the culture.
        </p>
      </div>

      <div className={styles.footer}>
      </div>
    </section>
  )
}