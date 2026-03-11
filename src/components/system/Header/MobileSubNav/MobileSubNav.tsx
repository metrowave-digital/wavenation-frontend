'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import clsx from 'clsx'

import type { MainNavItem, NavItem } from '../nav/nav.types'
import { getItemKey, hasChildren, hasHref } from '../nav/nav.types'
import styles from './MobileSubNav.module.css'
import { trackEvent } from '@/lib/analytics'

interface Props {
  items: MainNavItem[]
  pathname: string
  className?: string
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  return pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname
}

function isPathMatch(pathname: string, href?: string) {
  if (!href) return false

  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

function findMatchingInChildren(items: NavItem[], pathname: string): NavItem | null {
  for (const item of items) {
    if (hasHref(item) && isPathMatch(pathname, item.href)) return item

    if (hasChildren(item)) {
      const nested = findMatchingInChildren(item.children, pathname)
      if (nested) return nested
    }
  }

  return null
}

function findActiveRoot(items: MainNavItem[], pathname: string): MainNavItem | null {
  for (const item of items) {
    if (hasHref(item) && isPathMatch(pathname, item.href)) return item

    if (hasChildren(item)) {
      const found = findMatchingInChildren(item.children, pathname)
      if (found) return item
    }
  }

  return null
}

function findDirectBranch(root: MainNavItem | null, pathname: string): NavItem | null {
  if (!root?.children?.length) return null

  for (const child of root.children) {
    if (hasHref(child) && isPathMatch(pathname, child.href)) return child

    if (hasChildren(child)) {
      const nested = findMatchingInChildren(child.children, pathname)
      if (nested) return child
    }
  }

  return null
}

export function MobileSubNav({ items, pathname, className }: Props) {
  const activeRoot = useMemo(() => findActiveRoot(items, pathname), [items, pathname])

  const activeBranch = useMemo(
    () => findDirectBranch(activeRoot, pathname),
    [activeRoot, pathname]
  )

  const links = useMemo(() => {
    if (!activeRoot) return []

    if (activeBranch && hasChildren(activeBranch)) {
      return activeBranch.children.filter(hasHref)
    }

    return (activeRoot.children ?? []).filter(hasHref)
  }, [activeRoot, activeBranch])

  if (!activeRoot || links.length === 0) return null

  return (
    <div className={clsx(styles.wrap, className)}>
      <div className={styles.inner}>
        <div className={styles.contextRow}>
          <span className={styles.contextEyebrow}>Explore</span>
          <span className={styles.contextTitle}>
            {activeBranch?.label ?? activeRoot.label}
          </span>
        </div>

        <nav className={styles.nav} aria-label="Mobile section navigation">
          <ul className={styles.list}>
            {links.map((link, index) => {
              const href = link.href
              const active = isPathMatch(pathname, href)

              return (
                <li key={getItemKey(link, index)} className={styles.item}>
                  <Link
                    href={href}
                    className={clsx(styles.link, active && styles.linkActive)}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => {
                      trackEvent('navigation_click', {
                        component: 'mobile_sub_nav',
                        section: activeRoot.id,
                        label: link.label,
                        href,
                      })
                    }}
                  >
                    <span className={styles.linkLabel}>{link.label}</span>
                    {link.badge ? <span className={styles.badge}>{link.badge}</span> : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}