import type { ComponentType } from 'react'

/* ======================================================
   CORE NAV TYPES
====================================================== */

export type MegaMenuLink = {
  label: string
  href: string
  description?: string

  /** Optional nested links (e.g. Discover → Charts) */
  children?: MegaMenuLink[]
}

export type MegaMenuItem = {
  id: string
  label: string
  icon?: ComponentType<{ size?: number }>
  description?: string

  /** Top-level links for this section */
  children?: MegaMenuLink[]

  /** Editorial cards shown in the right rail */
  editorial?: {
    eyebrow?: string
    title: string
    description?: string
    href: string
  }[]
}

/* ======================================================
   FEATURED EDITORIAL
====================================================== */

export interface FeaturedCard {
  title: string
  description?: string
  eyebrow?: string
  href: string
  image?: {
    url: string
    alt: string
  } | null
}
