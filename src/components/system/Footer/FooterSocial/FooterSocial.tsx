'use client'

import { useEffect, useRef } from 'react'
import styles from './FooterSocial.module.css'
import { Facebook, Instagram, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type SocialPlatform = 'facebook' | 'instagram' | 'x'

export function FooterSocial() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterSocial',
    })

    hasTracked.current = true
  }, [])

  function handleSocialClick(platform: SocialPlatform, url: string) {
    trackEvent('navigation_click', {
      placement: 'footer',
      component: 'FooterSocial',
      platform,
      href: url,
      external: true,
    })
  }

  return (
    <section
      className={styles.social}
      aria-labelledby="footer-social-heading"
    >
      <h4 id="footer-social-heading" className={styles.heading}>
        Connect
      </h4>

      <div className={styles.links}>
        <a
          className={styles.link}
          href="https://www.facebook.com/people/WaveNation-Media/61585147160405/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on Facebook"
          onClick={() =>
            handleSocialClick(
              'facebook',
              'https://www.facebook.com/people/WaveNation-Media/61585147160405/'
            )
          }
        >
          <Facebook size={17} aria-hidden />
        </a>

        <a
          className={styles.link}
          href="https://www.instagram.com/wavenationmedia/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on Instagram"
          onClick={() =>
            handleSocialClick(
              'instagram',
              'https://www.instagram.com/wavenationmedia/'
            )
          }
        >
          <Instagram size={17} aria-hidden />
        </a>

        <a
          className={styles.link}
          href="https://x.com/WaveNationMedia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on X"
          onClick={() =>
            handleSocialClick('x', 'https://x.com/WaveNationMedia')
          }
        >
          <X size={17} aria-hidden />
        </a>
      </div>
    </section>
  )
}