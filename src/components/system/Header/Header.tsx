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

export function Header() {
  const pathname = usePathname()
  const navItems = useMemo(() => MAIN_NAV as MainNavItem[], [])

  return (
    <HeaderProvider>
      <header className={styles.root} role="banner">
        <div className={styles.bar}>
          <BrandBar />

          <div className={styles.desktopNav}>
            <MainNav />
          </div>

          <HeaderActions />
        </div>

        <SubNav items={navItems} pathname={pathname} className={styles.desktopSubNav} />
        <MobileSubNav items={navItems} pathname={pathname} className={styles.mobileSubNav} />
      </header>

      <MobileMenu />
      <SearchPopup />
      <ProfilePopup />
    </HeaderProvider>
  )
}