'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import styles from './Header.module.css'
import { HeaderProvider } from './Header.context'

// Child Components
import { BrandLogo } from './BrandLogo/BrandLogo'
import { DynamicTicker } from './DynamicTicker/DynamicTicker'
import { HeaderActions } from './HeaderActions/HeaderActions'
import { BroadcastNav } from './BroadcastNav/BroadcastNav'
import { HeaderMeta } from './HeaderMeta/HeaderMeta'

// Portals & Mobile
import { MobileMenuToggle } from './MobileMenu/MobileMenuToggle'
import { MobileMenu } from './MobileMenu/MobileMenu'
import { SearchPopup } from './Popups/SearchPopup'
import { ProfilePopup } from './Popups/ProfilePopup'
import { NotificationPopup } from './Popups/NotificationPopup' // 1. Added Import

// Utilities
function normalizePathname(pathname: string | null): string {
  if (!pathname) return '/'
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function Header() {
  const pathname = usePathname()

  const currentPath = useMemo(
    () => normalizePathname(pathname),
    [pathname]
  )

  return (
    <HeaderProvider>
      <>
        {/* Skip Link for Accessibility */}
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>

        <header className={styles.root} role="banner">
          {/* =============================
              TOP ROW: Brand, Nav, Actions
              [BrandLogo][BroadcastNav][HeaderActions]
          ============================== */}
          <div className={styles.topRow}>
            <div className={styles.brandZone}>
              <BrandLogo />
            </div>

            <div className={styles.navZone}>
              <BroadcastNav currentPath={currentPath} />
            </div>

            <div className={styles.actionsZone}>
              <div className={styles.desktopActions}>
                <HeaderActions />
              </div>
              <div className={styles.mobileToggleWrapper}>
                <MobileMenuToggle />
              </div>
            </div>
          </div>

          {/* =============================
              BOTTOM ROW: Ticker, Space, Meta
              [DynamicTicker][SPACE][HeaderMeta]
          ============================== */}
          <div className={styles.bottomRow}>
            <div className={styles.tickerZone}>
              <DynamicTicker />
            </div>
            
            {/* The gap/space is handled by justify-content: space-between in CSS */}
            
            <div className={styles.metaZone}>
              <HeaderMeta />
            </div>
          </div>
        </header>

        {/* =============================
            PORTALS
        ============================== */}
        <div className={styles.portalLayer}>
          <MobileMenu />
          <SearchPopup />
          <ProfilePopup />
          <NotificationPopup /> {/* 2. Added to portal layer */}
        </div>
      </>
    </HeaderProvider>
  )
}