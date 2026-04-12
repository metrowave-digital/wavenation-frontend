'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './FooterLegal.module.css'
import { trackEvent } from '@/lib/analytics'
import { FooterLink } from '../footer.types'

export function FooterLegal({ legalLinks }: { legalLinks: FooterLink[] }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterLegal',
      itemCount: legalLinks.length,
    })
    hasTracked.current = true
  }, [legalLinks.length])

  function trackLegalClick(label: string, href: string) {
    trackEvent('navigation_click', {
      placement: 'footer',
      component: 'FooterLegal',
      label,
      href,
      external: href.startsWith('http'),
    })
  }

  return (
    <div className={styles.legal}>
      <nav className={styles.nav} aria-label="Footer legal navigation">
        {legalLinks.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={styles.link}
            onClick={() => trackLegalClick(item.label, item.href)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className={styles.copy}>
        © {new Date().getFullYear()} WaveNation Media. Powered by{' '}
        <a
          href="https://metrowavemedia.com/digital"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.external}
          onClick={() => trackLegalClick('MetroWave Digital', 'https://metrowavemedia.com/digital')}
        >
          MetroWave Digital
        </a>
      </p>
    </div>
  )
}