import type { LucideIcon } from 'lucide-react'
import {
  Compass,
  Radio,
  Newspaper,
  Tv,
  ShoppingBag,
  Users,
  Music4,
  Sparkles,
} from 'lucide-react'

import type { MainNavItem, NavItem } from '../nav/nav.types'
import { hasChildren, hasHref } from '../nav/nav.types'

export type MobileMenuLevel = {
  label: string
  items: NavItem[]
  parentLabel?: string
}

export type FeaturedAction = {
  label: string
  href: string
  eyebrow: string
}

export function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  return pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname
}

export function isPathMatch(pathname: string, href?: string): boolean {
  if (!href) return false

  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

export function findPathStack(
  items: NavItem[],
  pathname: string,
  parents: MobileMenuLevel[] = []
): MobileMenuLevel[] | null {
  for (const item of items) {
    if (hasHref(item) && isPathMatch(pathname, item.href)) {
      return parents
    }

    if (hasChildren(item)) {
      const nextLevel: MobileMenuLevel = {
        label: item.label,
        items: item.children,
        parentLabel: parents[parents.length - 1]?.label,
      }

      const directChildMatch = item.children.some(child =>
        hasHref(child) ? isPathMatch(pathname, child.href) : false
      )

      if (directChildMatch) {
        return [...parents, nextLevel]
      }

      const nested = findPathStack(item.children, pathname, [...parents, nextLevel])
      if (nested) return nested
    }
  }

  return null
}

export function getRootSections(items: MainNavItem[]): MobileMenuLevel {
  return {
    label: 'Browse',
    items,
  }
}

export function getItemKey(item: NavItem, index: number): string {
  if (item.id) return item.id
  if (item.href) return item.href
  return `${item.label}-${index}`
}

export const MOBILE_MENU_SECTION_ICONS: Record<string, LucideIcon> = {
  discover: Compass,
  radio: Radio,
  listen: Radio,
  news: Newspaper,
  pulse: Newspaper,
  watch: Tv,
  tv: Tv,
  shop: ShoppingBag,
  community: Users,
  creators: Users,
  music: Music4,
}

export const MOBILE_MENU_FALLBACK_ICON: LucideIcon = Sparkles

export function getFeaturedActions(isRootLevel: boolean): FeaturedAction[] {
  if (!isRootLevel) return []

  return [
    {
      eyebrow: 'Live now',
      label: 'Listen Live',
      href: '/listen-live',
    },
    {
      eyebrow: 'Streaming',
      label: 'Watch Live',
      href: '/watch-live',
    },
    {
      eyebrow: 'Editorial',
      label: 'Latest News',
      href: '/news',
    },
    {
      eyebrow: 'Curated',
      label: 'Playlists',
      href: '/music/playlists',
    },
  ]
}