'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './BrandLogo.module.css'

export function BrandLogo() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Link
      href="/"
      className={styles.root}
      aria-label="WaveNation Home"
      aria-current={isHome ? 'page' : undefined}
    >
      <span className={styles.lockup}>
        {/* Monogram */}
        <span className={styles.monogramShell}>
          <Image
            src="images/branding/wavenation-logo-2.svg"
            alt="WaveNation logo"
            width={40}
            height={40}
            priority
            className={styles.monogram}
          />
        </span>

        {/* Text */}
        <span className={styles.brandText}>
          <span className={styles.wordmark}>
            WAVENATION
          </span>

          <span
            className={`${styles.tagline} ${
              scrolled ? styles.taglineHidden : ''
            }`}
          >
            AMPLIFY YOUR VIBE
          </span>
        </span>
      </span>
    </Link>
  )
}