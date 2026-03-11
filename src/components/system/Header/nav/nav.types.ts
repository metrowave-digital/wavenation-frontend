import type { LucideIcon } from 'lucide-react'

export type NavFeatured =
  | boolean
  | {
      eyebrow?: string
      title?: string
      description?: string
      accent?: 'blue' | 'magenta' | 'neutral' | 'news' | string
    }

export interface NavItem {
  id?: string
  label: string
  href?: string
  description?: string
  icon?: LucideIcon
  badge?: string
  accent?: 'blue' | 'magenta' | 'neutral' | 'news' | string
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