'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import clsx from 'clsx'

import type { MainNavItem, NavItem } from '../nav/nav.types'
import { getItemKey, hasChildren, hasHref } from '../nav/nav.types'
import styles from './SubNav.module.css'
import { trackEvent } from '@/lib/analytics'

interface Props {
  items: MainNavItem[]
  pathname: string
  className?: string
}

function isPathMatch(pathname: string, href?: string) {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function findActiveRoot(items: MainNavItem[], pathname: string): MainNavItem | null {
  for (const item of items) {
    if (isPathMatch(pathname, item.href)) return item

    if (hasChildren(item)) {
      const found = findMatchingInChildren(item.children, pathname)
      if (found) return item
    }
  }

  return null
}

function findMatchingInChildren(items: NavItem[], pathname: string): NavItem | null {
  for (const item of items) {
    if (isPathMatch(pathname, item.href)) return item

    if (hasChildren(item)) {
      const nested = findMatchingInChildren(item.children, pathname)
      if (nested) return nested
    }
  }

  return null
}

function findDirectBranch(root: MainNavItem | null, pathname: string): NavItem | null {
  if (!root?.children?.length) return null

  for (const child of root.children) {
    if (isPathMatch(pathname, child.href)) return child

    if (hasChildren(child)) {
      const nested = findMatchingInChildren(child.children, pathname)
      if (nested) return child
    }
  }

  return null
}

export function SubNav({ items, pathname, className }: Props) {
  const activeRoot = useMemo(() => findActiveRoot(items, pathname), [items, pathname])
  const activeBranch = useMemo(
    () => findDirectBranch(activeRoot, pathname),
    [activeRoot, pathname]
  )

  const links = useMemo(() => {
    if (!activeRoot) return []

    if (activeBranch && hasChildren(activeBranch)) {
      return activeBranch.children
    }

    return activeRoot.children ?? []
  }, [activeRoot, activeBranch])

  if (!activeRoot || links.length === 0) return null

  return (
    <div className={clsx(styles.subNavWrap, className)}>
      <div className={styles.subNavInner}>
        <div className={styles.contextBlock}>
          <span className={styles.contextEyebrow}>Section</span>
          <span className={styles.contextTitle}>
            {activeBranch?.label ?? activeRoot.label}
          </span>
        </div>

        <nav className={styles.nav} aria-label="Section navigation">
          <ul className={styles.list}>
            {links.map((link, index) => {
              const active = isPathMatch(pathname, link.href)
              const href = hasHref(link) ? link.href : '#'

              return (
                <li key={getItemKey(link, index)} className={styles.item}>
                  {hasHref(link) ? (
                    <Link
                      href={href}
                      className={clsx(styles.link, active && styles.linkActive)}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        trackEvent('navigation_click', {
                          component: 'sub_nav',
                          section: activeRoot.id,
                          label: link.label,
                          href,
                        })
                      }}
                    >
                      <span className={styles.linkLabel}>{link.label}</span>
                      {link.badge ? <span className={styles.badge}>{link.badge}</span> : null}
                    </Link>
                  ) : (
                    <span className={styles.linkStatic}>
                      <span className={styles.linkLabel}>{link.label}</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}