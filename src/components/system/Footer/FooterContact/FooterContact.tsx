'use client'

import { useEffect, useRef } from 'react'
import styles from './FooterContact.module.css'
import { trackEvent } from '@/lib/analytics'

export function FooterContact() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterContact',
    })

    hasTracked.current = true
  }, [])

  function trackInteraction(type: 'email_click' | 'focus') {
    trackEvent('content_click', {
      placement: 'footer',
      component: 'FooterContact',
      interaction: type,
    })
  }

  return (
    <section
      className={styles.contact}
      aria-labelledby="footer-contact-heading"
    >
      <h4
        id="footer-contact-heading"
        className={styles.heading}
      >
        Contact
      </h4>

      <a
        href="mailto:hello@wavenation.online"
        className={styles.email}
        onClick={() => trackInteraction('email_click')}
        onFocus={() => trackInteraction('focus')}
      >
        hello@wavenation.online
      </a>

      <p className={styles.subtext}>
        Press, partnerships, and creator inquiries welcome.
      </p>
    </section>
  )
}