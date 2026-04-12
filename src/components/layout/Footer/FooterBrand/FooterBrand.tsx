'use client'

import { useEffect, useRef } from 'react'
import styles from './FooterBrand.module.css'
import { trackEvent } from '@/lib/analytics'
import { SiteSettings } from '@/services/settings.api'

export function FooterBrand({ settings }: { settings: SiteSettings }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!hasTracked.current) {
      trackEvent('content_impression', { placement: 'footer', component: 'FooterBrand' })
      hasTracked.current = true
    }
  }, [])

  return (
    <section className={styles.brand} aria-labelledby="footer-brand-title">
      <div className={styles.header}>
        <span className={styles.kicker}>{settings.siteTitle}</span>
      </div>

      <div className={styles.body}>
        <h3 id="footer-brand-title" className={styles.title}>
          Sound. Story. Screen.
        </h3>
        <p className={styles.tagline}>{settings.tagline}</p>
        <p className={styles.mission}>
          Built in the now. Powered by the culture.
        </p>
      </div>
    </section>
  )
}