import type { LucideIcon } from 'lucide-react'

export type NavAccent = 'blue' | 'magenta' | 'neutral' | 'news' | string
export type NavBadge = 'live' | 'new' | 'trending' | 'editor-pick'

// Tier 3: The actual links
export interface MenuLink {
  label: string
  href: string
  description?: string
  badge?: NavBadge
}

// Tier 2: The columns inside the mega menu
export interface MenuColumn {
  label: string
  href?: string
  icon?: LucideIcon
  badge?: NavBadge
  links: MenuLink[]
}

// Featured Card Definition
export interface FeaturedCard {
  eyebrow: string
  title: string
  description: string
  href: string
  accent?: NavAccent
}

// Tier 1: The Top Header Triggers
export interface MainNavItem {
  id: string
  label: string
  href: string // Default click destination
  featured?: FeaturedCard
  columns: MenuColumn[] // Flat array of columns
}