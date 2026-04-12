'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './MobileFooter.module.css'
import { Facebook, Instagram, X, Youtube, Music2 } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { FooterColumn } from '../footer.types'
import { SiteSettings } from '@/services/settings.api'

export function MobileFooter({ columns, settings }: { columns: FooterColumn[], settings: SiteSettings }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!hasTracked.current) {
      trackEvent('content_impression', { placement: 'mobile_footer', component: 'MobileFooter' })
      hasTracked.current = true
    }
  }, [])

  return (
    <div className={styles.mobile} role="contentinfo" aria-label="WaveNation Media mobile footer">
      <div className={styles.header}>
        <span className={styles.copy}>© {new Date().getFullYear()} {settings.siteTitle}</span>
        <span className={styles.tagline}>{settings.tagline}</span>
      </div>

      <div className={styles.nav}>
        {columns.flatMap(section =>
          section.links.slice(0, 2).map(link => (
            <Link key={link.id} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))
        )}
      </div>

      <div className={styles.contact}>
        <a href={`mailto:${settings.email}`} className={styles.email}>{settings.email}</a>
      </div>

      <div className={styles.social}>
        {settings.facebookUrl && <a className={styles.socialLink} href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"><Facebook size={16} /></a>}
        {settings.instagramUrl && <a className={styles.socialLink} href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={16} /></a>}
        {settings.twitterUrl && <a className={styles.socialLink} href={settings.twitterUrl} target="_blank" rel="noopener noreferrer"><X size={16} /></a>}
        {settings.youtubeUrl && <a className={styles.socialLink} href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"><Youtube size={16} /></a>}
        {settings.tiktokUrl && <a className={styles.socialLink} href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"><Music2 size={16} /></a>}
      </div>
    </div>
  )
}