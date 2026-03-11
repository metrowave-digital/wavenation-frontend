// src/components/system/Header/MegaMenu/MegaMenu.types.ts

import type { ComponentType } from 'react'

export type MenuAccent = 'blue' | 'magenta' | 'green' | 'neutral'

export type NavIcon = ComponentType<{ size?: number }>

export type FeaturedCard = {
  id?: string | number
  href: string
  title: string
  description?: string
  eyebrow?: string
  image?: {
    url: string
    alt: string
  } | null
}

export type MegaMenuFeatured =
  | boolean
  | {
      eyebrow?: string
      title: string
      description: string
      accent?: MenuAccent
    }

type MegaMenuBase = {
  id?: string
  label: string
  description?: string
  badge?: string
  featured?: MegaMenuFeatured
  children?: MegaMenuItem[]
}

export type MegaMenuLink = MegaMenuBase & {
  href: string
}

export type MegaMenuGroup = MegaMenuBase & {
  href?: string
  children: MegaMenuItem[]
}

export type MegaMenuRoot = {
  id: string
  label: string
  icon?: NavIcon
  href?: string
  description?: string
  badge?: string
  featured?: MegaMenuFeatured
  children: MegaMenuItem[]
}

export type MegaMenuItem = MegaMenuLink | MegaMenuGroup
export type MainNavItem = MegaMenuRoot

export function hasChildren(
  item: MegaMenuRoot | MegaMenuItem
): item is (MegaMenuRoot | MegaMenuItem) & { children: MegaMenuItem[] } {
  return Array.isArray(item.children) && item.children.length > 0
}

export function hasHref(
  item: MegaMenuRoot | MegaMenuItem
): item is (MegaMenuRoot | MegaMenuItem) & { href: string } {
  return typeof item.href === 'string' && item.href.length > 0
}

export function isFeaturedObject(
  featured: MegaMenuFeatured | undefined
): featured is Exclude<MegaMenuFeatured, boolean> {
  return typeof featured === 'object' && featured !== null
}