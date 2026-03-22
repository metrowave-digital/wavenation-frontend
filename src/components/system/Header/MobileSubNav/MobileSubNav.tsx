'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'

import type {
  MainNavItem,
  NavItem,
  NavBadge,
  MainNavId,
} from '../nav/nav.types'
import { getItemKey, hasChildren, hasHref } from '../nav/nav.types'
import styles from './MobileSubNav.module.css'
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

type SubNavLink = {
  href: string
  label: string
  badge?: NavBadge
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

function resolveMobileLinks(
  root: MainNavItem | null,
  trail: NavItem[],
  pathname: string
) {
  if (!root || trail.length === 0) {
    return {
      contextTitle: '',
      links: [] as SubNavLink[],
    }
  }

  const current = trail[trail.length - 1] ?? null
  const parent = trail.length > 1 ? trail[trail.length - 2] : null
  const grandParent = trail.length > 2 ? trail[trail.length - 3] : root

  if (current && hasChildren(current)) {
    const currentChildren = getVisibleChildren(current, pathname)

    if (current.subnavMode === 'hidden') {
      return {
        contextTitle: parent?.label ?? root.label,
        links: currentChildren.slice(0, 12).map(item => ({
          href: item.href!,
          label: item.label,
          badge: item.badge,
        })),
      }
    }

    if (currentChildren.length > 0) {
      return {
        contextTitle: current.label,
        links: currentChildren.slice(0, 12).map(item => ({
          href: item.href!,
          label: item.label,
          badge: item.badge,
        })),
      }
    }
  }

  if (parent && hasChildren(parent)) {
    const parentChildren = getVisibleChildren(parent, pathname)

    if (parent.subnavMode === 'hidden') {
      return {
        contextTitle: grandParent?.label ?? root.label,
        links: parentChildren.slice(0, 12).map(item => ({
          href: item.href!,
          label: item.label,
          badge: item.badge,
        })),
      }
    }

    if (parentChildren.length > 0) {
      return {
        contextTitle: parent.label,
        links: parentChildren.slice(0, 12).map(item => ({
          href: item.href!,
          label: item.label,
          badge: item.badge,
        })),
      }
    }
  }

  return {
    contextTitle: root.label,
    links: getVisibleChildren(root, pathname).slice(0, 12).map(item => ({
      href: item.href!,
      label: item.label,
      badge: item.badge,
    })),
  }
}

function getSectionTone(root: MainNavItem | null): MainNavId | 'default' {
  if (!root) return 'default'
  return root.id
}

function getBadgeText(badge?: NavBadge): string | undefined {
  switch (badge) {
    case 'live':
      return 'Live'
    case 'new':
      return 'New'
    case 'trending':
      return 'Trending'
    case 'editor-pick':
      return 'Editor’s Pick'
    default:
      return undefined
  }
}

export function MobileSubNav({
  items,
  pathname,
  className,
}: Props) {
  const listRef = useRef<HTMLUListElement | null>(null)

  const { root, trail } = useMemo(
    () => findActiveTrail(items, pathname),
    [items, pathname]
  )

  const { contextTitle, links } = useMemo(
    () => resolveMobileLinks(root, trail, pathname),
    [root, trail, pathname]
  )

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const activeLink = list.querySelector(
      '[aria-current="page"]'
    ) as HTMLElement | null

    if (!activeLink) return

    activeLink.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [pathname, links])

  if (!root || links.length === 0) return null

  const sectionTone = getSectionTone(root)

  return (
    <div
      className={clsx(styles.wrap, className)}
      data-section-tone={sectionTone}
    >
      <div className={styles.inner}>
        <div className={styles.contextBlock}>
          <div className={styles.contextRow}>
            <span className={styles.contextEyebrow}>Explore</span>
            <span className={styles.contextDivider} aria-hidden="true" />
            <span className={styles.contextTitle}>{contextTitle}</span>
          </div>

          <span className={styles.contextRule} aria-hidden="true" />
        </div>

        <nav
          className={styles.nav}
          aria-label={`${contextTitle} mobile section navigation`}
        >
          <span className={styles.edgeFadeLeft} aria-hidden="true" />
          <span className={styles.edgeFadeRight} aria-hidden="true" />

          <ul ref={listRef} className={styles.list}>
            {links.map((link, index) => {
              const active = isPathMatch(pathname, link.href)
              const badgeText = getBadgeText(link.badge)

              return (
                <li key={`${link.href}-${index}`} className={styles.item}>
                  <Link
                    href={link.href}
                    className={clsx(
                      styles.link,
                      active && styles.linkActive
                    )}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => {
                      trackEvent('navigation_click', {
                        component: 'mobile_sub_nav',
                        section: root.id,
                        label: link.label,
                        href: link.href,
                        badge: link.badge ?? null,
                      })
                    }}
                  >
                    <span className={styles.linkLabel}>{link.label}</span>

                    {badgeText ? (
                      <span
                        className={clsx(
                          styles.badge,
                          link.badge === 'live' && styles.badgeLive,
                          link.badge === 'new' && styles.badgeNew,
                          link.badge === 'trending' && styles.badgeTrending,
                          link.badge === 'editor-pick' && styles.badgeEditorPick
                        )}
                      >
                        {badgeText}
                      </span>
                    ) : null}

                    {active ? (
                      <span
                        className={styles.activeUnderline}
                        aria-hidden="true"
                      />
                    ) : null}
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