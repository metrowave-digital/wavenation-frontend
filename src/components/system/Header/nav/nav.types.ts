import type { LucideIcon } from 'lucide-react'

export type NavAccent = 'blue' | 'magenta' | 'neutral' | 'news' | string

export type NavFeatured =
  | boolean
  | {
      eyebrow?: string
      title?: string
      description?: string
      accent?: NavAccent
    }

export interface NavItem {
  id?: string
  label: string
  href?: string
  description?: string
  icon?: LucideIcon
  badge?: string
  accent?: NavAccent
  featured?: NavFeatured
  children?: NavItem[]
}

export type MainNavId =
  | 'discover'
  | 'onair'
  | 'news'
  | 'watch'
  | 'shop'
  | 'connect'

export interface MainNavItem extends NavItem {
  id: MainNavId
  icon: LucideIcon
  children: NavItem[]
}

export function hasChildren(item?: NavItem | null): item is NavItem & { children: NavItem[] } {
  return Array.isArray(item?.children) && item!.children.length > 0
}

export function hasHref(item?: NavItem | null): item is NavItem & { href: string } {
  return typeof item?.href === 'string' && item.href.length > 0
}

export function isFeaturedObject(
  featured?: NavFeatured
): featured is {
  eyebrow?: string
  title?: string
  description?: string
  accent?: NavAccent
} {
  return typeof featured === 'object' && featured !== null
}

export function getItemKey(item: NavItem, index: number): string {
  if (item.id) return item.id
  if (item.href) return item.href
  return `${item.label}-${index}`
}

export function getFirstHref(items?: NavItem[]): string | null {
  if (!items?.length) return null

  for (const item of items) {
    if (hasHref(item)) return item.href

    if (hasChildren(item)) {
      const nested = getFirstHref(item.children)
      if (nested) return nested
    }
  }

  return null
}

export function countDestinations(items?: NavItem[]): number {
  if (!items?.length) return 0

  return items.reduce((count, item) => {
    const own = hasHref(item) ? 1 : 0
    const nested = hasChildren(item) ? countDestinations(item.children) : 0
    return count + own + nested
  }, 0)
}

export function getDefaultSectionHref(item: MainNavItem): string {
  if (hasHref(item)) return item.href

  switch (item.id) {
    case 'discover':
      return '/discover'
    case 'onair':
      return '/radio'
    case 'news':
      return '/news'
    case 'watch':
      return '/tv'
    case 'shop':
      return '/shop'
    case 'connect':
      return '/connect'
    default:
      return '/'
  }
}

export function getFeaturedSeed(item: MainNavItem): {
  eyebrow: string
  title: string
  description: string
  href: string
  accent?: NavAccent
} | null {
  if (!hasChildren(item)) return null

  const firstFeatured = item.children.find(child => Boolean(child.featured))
  if (!firstFeatured) return null

  if (isFeaturedObject(firstFeatured.featured)) {
    return {
      eyebrow: firstFeatured.featured.eyebrow ?? 'Featured',
      title: firstFeatured.featured.title ?? firstFeatured.label,
      description:
        firstFeatured.featured.description ??
        firstFeatured.description ??
        `Explore ${firstFeatured.label}.`,
      href: firstFeatured.href ?? getFirstHref(firstFeatured.children) ?? '#',
      accent: firstFeatured.featured.accent,
    }
  }

  return {
    eyebrow: 'Featured',
    title: firstFeatured.label,
    description: firstFeatured.description ?? `Explore ${firstFeatured.label}.`,
    href: firstFeatured.href ?? getFirstHref(firstFeatured.children) ?? '#',
    accent: firstFeatured.accent,
  }
}