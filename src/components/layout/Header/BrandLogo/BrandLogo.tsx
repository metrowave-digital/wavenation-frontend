'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './BrandLogo.module.css'
import type { SiteSettings } from '@/services/settings.api'

// Update this interface to match what you're passing in Header.tsx
interface BrandLogoProps {
  settings: SiteSettings | null
}

export function BrandLogo({ settings }: BrandLogoProps) {
  if (!settings) return null

  const logo = settings.logoDark

  return (
    <Link href="/" className={styles.root} aria-label="WaveNation Home">
      {logo?.url && (
        <div className={styles.logoWrapper}>
          <Image 
            src={logo.url} 
            alt={logo.alt || 'WaveNation Logo'} 
            width={48} 
            height={48} 
            className={styles.logoImage}
            priority
          />
        </div>
      )}

      <div className={styles.brandText}>
        <span className={styles.siteTitle}>
          {settings.siteTitle || 'WAVENATION'}
        </span>
        <span className={styles.tagline}>
          {settings.tagline || 'Amplify Your Vibe'}
        </span>
      </div>
    </Link>
  )
}