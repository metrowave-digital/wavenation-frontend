'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MAIN_NAV } from '../nav/nav.config'
import styles from './SubNav.module.css'

import type {
  MegaMenuItem,
  MegaMenuLink,
} from '../MegaMenu/MegaMenu.types'

/* ======================================================
   Helpers
====================================================== */

function isLink(
  item: MegaMenuLink
): item is MegaMenuLink & { href: string } {
  return typeof item.href === 'string'
}

/* ======================================================
   Component
====================================================== */

export function SubNav() {
  const pathname = usePathname()

  // Find top-level section whose child link matches the path
  const active = MAIN_NAV.find(
    (item: MegaMenuItem) =>
      item.children?.some(
        (child: MegaMenuLink) =>
          isLink(child) &&
          pathname.startsWith(child.href)
      )
  )

  if (!active?.children?.length) return null

  const links = active.children.filter(isLink)

  if (!links.length) return null

  return (
    <div
      className={styles.root}
      role="navigation"
      aria-label={`${active.label} sub navigation`}
    >
      <nav className={styles.nav}>
        {links.map(link => {
          const isActive =
            pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                isActive ? styles.active : ''
              }`}
              aria-current={
                isActive ? 'page' : undefined
              }
            >
              <span className={styles.label}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
