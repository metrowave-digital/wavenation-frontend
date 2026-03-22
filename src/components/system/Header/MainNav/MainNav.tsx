'use client'

import { MAIN_NAV } from '../nav/nav.config'
import { MegaMenu } from '../MegaMenu/MegaMenu'
import type { MainNavItem } from '../nav/nav.types'
import styles from './MainNav.module.css'

export function MainNav() {
  return (
    <nav
      className={styles.root}
      aria-label="Primary navigation"
    >
      <MegaMenu
        items={MAIN_NAV as MainNavItem[]}
        className={styles.menu}
      />
    </nav>
  )
}