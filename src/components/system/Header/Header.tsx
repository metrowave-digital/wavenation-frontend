'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import styles from './Header.module.css'
import { HeaderProvider } from './Header.context'

import { BrandBar } from './BrandBar/BrandBar'
import { MainNav } from './MainNav/MainNav'
import { SubNav } from './SubNav/SubNav'
import { MobileSubNav } from './MobileSubNav/MobileSubNav'
import { HeaderActions } from './HeaderActions/HeaderActions'
import { MobileMenu } from './MobileMenu/MobileMenu'
import { SearchPopup } from './Popups/SearchPopup'
import { ProfilePopup } from './Popups/ProfilePopup'

import { MAIN_NAV } from './nav/nav.config'
import type { MainNavItem } from './nav/nav.types'

function normalizePathname(pathname: string | null): string {
  if (!pathname) return '/'
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function Header() {
  const pathname = usePathname()

  const currentPath = useMemo(() => normalizePathname(pathname), [pathname])
  const navItems = useMemo(() => MAIN_NAV as MainNavItem[], [])

  return (
    <HeaderProvider>
      <>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>

        <header className={styles.root} role="banner">
          <div className={styles.surface} aria-hidden="true" />

          <div className={styles.topBar}>
            <div className={styles.topBarInner}>
              <div className={styles.brandZone}>
                <BrandBar />
              </div>

              <div
                className={styles.desktopNavZone}
                aria-label="Primary navigation"
              >
                <MainNav />
              </div>

              <div className={styles.actionsZone}>
                <HeaderActions />
              </div>
            </div>
          </div>

          <div className={styles.subNavRail}>
            <div className={styles.subNavRailInner}>
              <SubNav
                items={navItems}
                pathname={currentPath}
                className={styles.desktopSubNav}
              />

              <MobileSubNav
                items={navItems}
                pathname={currentPath}
                className={styles.mobileSubNav}
              />
            </div>
          </div>

          <div className={styles.bottomLine} aria-hidden="true" />
        </header>

        <div className={styles.portalLayer}>
          <MobileMenu />
          <SearchPopup />
          <ProfilePopup />
        </div>
      </>
    </HeaderProvider>
  )
}