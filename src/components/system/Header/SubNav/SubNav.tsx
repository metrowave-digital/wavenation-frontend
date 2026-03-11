'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import { MAIN_NAV } from '../nav/nav.config'
import type { MainNavItem, NavItem } from '../nav/nav.types'
import styles from './SubNav.module.css'
import { trackEvent } from '@/lib/analytics'

function hasHref(item: NavItem): item is NavItem & { href: string } {
  return typeof item.href === 'string' && item.href.length > 0
}

function hasChildren(item: NavItem): item is NavItem & { children: NavItem[] } {
  return Array.isArray(item.children) && item.children.length > 0
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  if (pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

function isPathMatch(pathname: string, href?: string): boolean {
  if (!href) return false

  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

function sortBySpecificity(items: NavItem[]): NavItem[] {
  return [...items].sort((a, b) => {
    const aLen = a.href?.length ?? 0
    const bLen = b.href?.length ?? 0
    return bLen - aLen
  })
}

function findActiveRoot(pathname: string): MainNavItem | null {
  const roots = MAIN_NAV as MainNavItem[]
  const matches = roots.filter(item => {
    const rootHref = getDefaultRootHref(item)
    return isPathMatch(pathname, rootHref)
  })

  if (!matches.length) return null

  return sortBySpecificity(matches)[0] as MainNavItem
}

function findDeepestMatch(items: NavItem[], pathname: string): NavItem | null {
  const sorted = sortBySpecificity(items)

  for (const item of sorted) {
    if (hasHref(item) && isPathMatch(pathname, item.href)) {
      const nestedMatch = hasChildren(item)
        ? findDeepestMatch(item.children, pathname)
        : null

      return nestedMatch ?? item
    }

    if (hasChildren(item)) {
      const nestedMatch = findDeepestMatch(item.children, pathname)
      if (nestedMatch) return nestedMatch
    }
  }

  return null
}

function findDirectChildForPath(root: MainNavItem, pathname: string): NavItem | null {
  const children = root.children ?? []
  const sorted = sortBySpecificity(children)

  for (const child of sorted) {
    if (hasHref(child) && isPathMatch(pathname, child.href)) {
      return child
    }

    if (hasChildren(child)) {
      const nestedMatch = findDeepestMatch(child.children, pathname)
      if (nestedMatch) return child
    }
  }

  return null
}

function getDefaultRootHref(item: MainNavItem): string {
  const explicit = item.href
  if (explicit) return explicit

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

function getSubNavItems(root: MainNavItem, pathname: string): NavItem[] {
  const activeChild = findDirectChildForPath(root, pathname)

  if (activeChild && hasChildren(activeChild) && activeChild.children.length > 0) {
    return activeChild.children
  }

  return root.children ?? []
}

function getSubNavTitle(root: MainNavItem, pathname: string): string {
  const activeChild = findDirectChildForPath(root, pathname)
  return activeChild?.label ?? root.label
}

function getItemKey(item: NavItem, index: number): string {
  if (item.id) return item.id
  if (item.href) return item.href
  return `${item.label}-${index}`
}

export function SubNav() {
  const pathname = usePathname()

  const model = useMemo(() => {
    const currentPath = normalizePath(pathname ?? '/')
    const root = findActiveRoot(currentPath)

    if (!root) return null

    const items = getSubNavItems(root, currentPath)
    if (!items.length) return null

    return {
      root,
      title: getSubNavTitle(root, currentPath),
      items,
      pathname: currentPath,
    }
  }, [pathname])

  if (!model) return null

  return (
    <nav className={styles.subnav} aria-label={`${model.title} sub navigation`}>
      <div className={styles.inner}>
        <div className={styles.rail}>
          {model.items.map((item, index) => {
            const href =
              item.href ??
              (hasChildren(item)
                ? item.children.find(hasHref)?.href
                : undefined)

            const isActive =
              Boolean(href) && isPathMatch(model.pathname, href)

            if (!href) {
              return (
                <div
                  key={getItemKey(item, index)}
                  className={[styles.link, styles.linkDisabled].join(' ')}
                  aria-disabled="true"
                >
                  <span className={styles.label}>{item.label}</span>

                  {item.description ? (
                    <span className={styles.description}>{item.description}</span>
                  ) : null}
                </div>
              )
            }

            return (
              <Link
                key={getItemKey(item, index)}
                href={href}
                className={[
                  styles.link,
                  isActive ? styles.linkActive : '',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  trackEvent('navigation_click', {
                    component: 'sub_nav',
                    section: model.root.id,
                    label: item.label,
                    href,
                  })
                }}
              >
                <span className={styles.label}>{item.label}</span>

                {item.description ? (
                  <span className={styles.description}>{item.description}</span>
                ) : null}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}