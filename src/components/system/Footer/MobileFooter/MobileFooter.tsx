'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './MobileFooter.module.css'
import { FOOTER_NAV } from '../nav/footer.config'
import { Facebook, Instagram, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type SocialPlatform = 'facebook' | 'instagram' | 'x'

export function MobileFooter() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'mobile_footer',
      component: 'MobileFooter',
    })

    hasTracked.current = true
  }, [])

  function handleNavClick(section: string, label: string, href: string) {
    trackEvent('navigation_click', {
      placement: 'mobile_footer',
      component: 'MobileFooter',
      section,
      label,
      href,
    })
  }

  function handleSocialClick(platform: SocialPlatform, href: string) {
    trackEvent('navigation_click', {
      placement: 'mobile_footer',
      component: 'MobileFooter',
      platform,
      href,
      external: true,
    })
  }

  return (
    <div
      className={styles.mobile}
      role="contentinfo"
      aria-label="WaveNation Media mobile footer"
    >
      <div className={styles.header}>
        <span className={styles.copy}>
          © {new Date().getFullYear()} WaveNation Media
        </span>
        <span className={styles.tagline}>
          Culture, music, media, and creators
        </span>
      </div>

      <div className={styles.nav}>
        {FOOTER_NAV.flatMap(section =>
          section.links.slice(0, 2).map(link => (
            <Link
              key={`${section.label}-${link.href}`}
              href={link.href}
              className={styles.navLink}
              onClick={() =>
                handleNavClick(section.label, link.label, link.href)
              }
            >
              {link.label}
            </Link>
          ))
        )}
      </div>

      <div className={styles.contact}>
        <a
          href="mailto:hello@wavenation.online"
          className={styles.email}
        >
          hello@wavenation.online
        </a>
      </div>

      <div className={styles.social}>
        <a
          className={styles.socialLink}
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
          <Facebook size={16} aria-hidden />
        </a>

        <a
          className={styles.socialLink}
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
          <Instagram size={16} aria-hidden />
        </a>

        <a
          className={styles.socialLink}
          href="https://x.com/WaveNationMedia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on X"
          onClick={() =>
            handleSocialClick('x', 'https://x.com/WaveNationMedia')
          }
        >
          <X size={16} aria-hidden />
        </a>
      </div>
    </div>
  )
}