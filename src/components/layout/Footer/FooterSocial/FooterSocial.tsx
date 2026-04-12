'use client'

import styles from './FooterSocial.module.css'
import { Instagram, X, Youtube, Music2, Facebook } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import type { SiteSettings } from '@/services/settings.api'

export function FooterSocial({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null

  const handleSocialClick = (platform: string, url: string) => {
    trackEvent('navigation_click', { 
      placement: 'footer', 
      component: 'FooterSocial', 
      platform, 
      href: url, 
      external: true 
    })
  }

  return (
    <section className={styles.social} aria-labelledby="footer-social-heading">
      <h4 id="footer-social-heading" className={styles.heading}>Connect</h4>
      <div className={styles.links}>
        {settings.facebookUrl && (
          <a className={styles.link} href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('facebook', settings.facebookUrl!)}>
            <Facebook size={17} />
          </a>
        )}
        {settings.instagramUrl && (
          <a className={styles.link} href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('instagram', settings.instagramUrl!)}>
            <Instagram size={17} />
          </a>
        )}
        {settings.youtubeUrl && (
          <a className={styles.link} href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('youtube', settings.youtubeUrl!)}>
            <Youtube size={17} />
          </a>
        )}
        {settings.twitterUrl && (
          <a className={styles.link} href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('x', settings.twitterUrl!)}>
            <X size={17} />
          </a>
        )}
        {settings.tiktokUrl && (
          <a className={styles.link} href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('tiktok', settings.tiktokUrl!)}>
            <Music2 size={17} />
          </a>
        )}
      </div>
    </section>
  )
}