'use client'

import { MAIN_NAV } from '../nav/nav.config'
import { MegaMenu } from '../MegaMenu/MegaMenu'
import type { MainNavItem } from '../nav/nav.types'

export function MainNav() {
  return <MegaMenu items={MAIN_NAV as MainNavItem[]} />
}