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

type ActiveTrailResult = {
  root: MainNavItem | null
  trail: NavItem[]
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

function isPathMatch(pathname: string, href?: string) {
  if (!href) return false

  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

function isExactPath(pathname: string, href?: string) {
  if (!href) return false
  return normalizePath(pathname) === normalizePath(href)
}

function isHomeLikeItem(item: NavItem) {
  const label = item.label.trim().toLowerCase()
  return label === 'home' || label.endsWith(' home')
}

function dedupeItems(items: NavItem[]) {
  const seen = new Set<string>()
  const result: NavItem[] = []

  for (const [index, item] of items.entries()) {
    const key = getItemKey(item, index)
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }

  return result
}

function filterVisibleItems(items: NavItem[], pathname: string) {
  return dedupeItems(items).filter(item => {
    if (!hasHref(item)) return false
    if (!isHomeLikeItem(item)) return true
    return isExactPath(pathname, item.href)
  })
}

function findActiveTrailInChildren(
  items: NavItem[],
  pathname: string,
  ancestors: NavItem[] = []
): NavItem[] | null {
  for (const item of items) {
    const trail = [...ancestors, item]

    if (hasHref(item) && isPathMatch(pathname, item.href)) {
      if (hasChildren(item)) {
        const deeper = findActiveTrailInChildren(item.children, pathname, trail)
        return deeper ?? trail
      }

      return trail
    }

    if (hasChildren(item)) {
      const nested = findActiveTrailInChildren(item.children, pathname, trail)
      if (nested) return nested
    }
  }

  return null
}

function findActiveTrail(items: MainNavItem[], pathname: string): ActiveTrailResult {
  for (const item of items) {
    const rootTrail: NavItem[] = [item]

    if (item.href && isPathMatch(pathname, item.href)) {
      if (hasChildren(item)) {
        const deeper = findActiveTrailInChildren(item.children, pathname, rootTrail)
        return { root: item, trail: deeper ?? rootTrail }
      }

      return { root: item, trail: rootTrail }
    }

    if (hasChildren(item)) {
      const found = findActiveTrailInChildren(item.children, pathname, rootTrail)
      if (found) return { root: item, trail: found }
    }
  }

  return { root: null, trail: [] }
}

function getVisibleChildren(
  item: NavItem | MainNavItem | null,
  pathname: string
): NavItem[] {
  if (!item || !hasChildren(item)) return []
  return filterVisibleItems(item.children, pathname)
}

function resolveSubNavLevel(
  root: MainNavItem | null,
  trail: NavItem[],
  pathname: string
) {
  if (!root || trail.length === 0) {
    return {
      railLabel: '',
      items: [] as NavItem[],
    }
  }

  const current = trail[trail.length - 1] ?? null
  const parent = trail.length > 1 ? trail[trail.length - 2] : null
  const grandParent = trail.length > 2 ? trail[trail.length - 3] : root

  if (current && hasChildren(current)) {
    const currentChildren = getVisibleChildren(current, pathname)

    if (current.subnavMode === 'hidden') {
      return {
        railLabel: parent?.label ?? root.label,
        items: currentChildren.slice(0, 12),
      }
    }

    if (currentChildren.length > 0) {
      return {
        railLabel: current.label,
        items: currentChildren.slice(0, 12),
      }
    }
  }

  if (parent && hasChildren(parent)) {
    const parentChildren = getVisibleChildren(parent, pathname)

    if (parent.subnavMode === 'hidden') {
      return {
        railLabel: grandParent?.label ?? root.label,
        items: parentChildren.slice(0, 12),
      }
    }

    if (parentChildren.length > 0) {
      return {
        railLabel: parent.label,
        items: parentChildren.slice(0, 12),
      }
    }
  }

  const rootChildren = getVisibleChildren(root, pathname)

  return {
    railLabel: root.label,
    items: rootChildren.slice(0, 12),
  }
}

export function SubNav({ items, pathname, className }: Props) {
  const { root, trail } = useMemo(
    () => findActiveTrail(items, pathname),
    [items, pathname]
  )

  const { railLabel, items: subNavItems } = useMemo(
    () => resolveSubNavLevel(root, trail, pathname),
    [root, trail, pathname]
  )

  if (!root || subNavItems.length === 0) return null

  return (
    <nav
      className={clsx(styles.root, className)}
      aria-label={`${railLabel || root.label} section navigation`}
    >
      <div className={styles.inner}>
        <div className={styles.railLabel} aria-hidden="true">
          <span className={styles.railLabelText}>{railLabel || root.label}</span>
          <span className={styles.railDivider} />
        </div>

        <div className={styles.scroller}>
          <div className={styles.track}>
            {subNavItems.map((item, index) => {
              if (!hasHref(item)) return null

              const isActive = isPathMatch(pathname, item.href)

              return (
                <Link
                  key={getItemKey(item, index)}
                  href={item.href}
                  className={styles.item}
                  data-active={isActive ? 'true' : 'false'}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    trackEvent('subnav_click', {
                      location: 'header',
                      section: root.id,
                      label: item.label,
                      href: item.href,
                    })
                  }}
                >
                  <span className={styles.itemLabel}>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}