import type { ComponentType } from 'react'
import { Compass, Radio, Sparkles, TrendingUp, Zap } from 'lucide-react'

import type { MainNavItem, NavItem } from '../nav/nav.types'
import { hasHref } from '../nav/nav.types'

export type NavBadge = 'live' | 'new' | 'trending' | 'editor-pick'
export type IconComponent = ComponentType<{ className?: string }>

export type NavItemWithEnhancements = NavItem & {
  icon?: IconComponent
  badge?: NavBadge
}

export type MainNavItemWithEnhancements = MainNavItem & {
  icon?: IconComponent
  badge?: NavBadge
}

export function getItemIcon(
  item: MainNavItemWithEnhancements
): IconComponent {
  if (item.icon) return item.icon

  const id = String(item.id).toLowerCase()

  if (id === 'listen' || id === 'radio') return Radio
  if (id === 'discover' || id === 'explore') return Compass
  if (id === 'trending') return TrendingUp
  if (id === 'live') return Zap

  return Sparkles
}

export function getBadgeLabel(badge?: NavBadge): string | null {
  switch (badge) {
    case 'live':
      return 'Live'
    case 'new':
      return 'New'
    case 'trending':
      return 'Trending'
    case 'editor-pick':
      return "Editor's Pick"
    default:
      return null
  }
}

export function isHrefActive(
  pathname: string,
  href?: string | null
): boolean {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isChildActive(
  pathname: string,
  items?: NavItem[]
): boolean {
  if (!items?.length) return false

  return items.some((child): boolean => {
    if (hasHref(child) && isHrefActive(pathname, child.href)) return true
    return isChildActive(pathname, child.children)
  })
}