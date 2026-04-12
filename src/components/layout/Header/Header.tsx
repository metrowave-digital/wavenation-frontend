'use client'

import { useMemo, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { HeaderProvider } from './Header.context'

// Sub-components
import { BrandLogo } from './BrandLogo/BrandLogo'
import { BroadcastNav } from './BroadcastNav/BroadcastNav'
import { HeaderActions } from './HeaderActions/HeaderActions'
import { MobileMenuToggle } from './MobileMenu/MobileMenuToggle'
import { MobileMenu } from './MobileMenu/MobileMenu'

// Types
import type { MainNavItem } from './nav/nav.types'
import type { SiteSettings } from '@/services/settings.api'

interface HeaderProps {
  navData: MainNavItem[]
  settings: SiteSettings | null
}

export function Header({ navData, settings }: HeaderProps) {
  const pathname = usePathname()
  const [isShrunk, setIsShrunk] = useState(false)

  /* ======================================================
     1. Shrink on Scroll Logic
     ====================================================== */
  useEffect(() => {
    const handleScroll = () => {
      // Shrunk state triggers after 50px of vertical scrolling
      setIsShrunk(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ======================================================
     2. Path Normalization
     ====================================================== */
  // Ensures active states work regardless of trailing slashes
  const currentPath = useMemo(() => 
    pathname === '/' ? '/' : pathname.replace(/\/$/, ''), 
    [pathname]
  )

  return (
    <HeaderProvider>
      {/* The dynamic class 'styles.shrunk' is applied based on scroll position.
          This triggers the height, padding, and backdrop transitions in CSS.
      */}
      <header 
        className={`${styles.root} ${isShrunk ? styles.shrunk : ''}`} 
        role="banner"
      >
        <div className={styles.topRow}>
          
          {/* BRAND ZONE: Dynamic Logo, Site Title, and Tagline */}
          <div className={styles.brandZone}>
            <BrandLogo settings={settings} />
          </div>

          {/* NAV ZONE: Desktop Navigation Links */}
          <div className={styles.navZone}>
            <BroadcastNav navData={navData} currentPath={currentPath} />
          </div>

          {/* ACTIONS ZONE: Search, Global Switcher, and Mobile Toggle */}
          <div className={styles.actionsZone}>
            <div className={styles.desktopActions}>
              <HeaderActions />
            </div>
            
            <div className={styles.mobileToggleWrapper}>
              <MobileMenuToggle />
            </div>
          </div>
        </div>
      </header>

      {/* PORTAL LAYER: Contains the MobileMenu. 
          Passing settings ensures the menu has access to social links and brand info.
      */}
      <div className={styles.portalLayer}>
        <MobileMenu navData={navData} settings={settings} />
      </div>
    </HeaderProvider>
  )
}