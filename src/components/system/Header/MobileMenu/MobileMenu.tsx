'use client'

import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { HeaderContext } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import type { MainNavItem, NavItem } from '../nav/nav.types'
import { hasChildren, hasHref } from '../nav/nav.types'
import styles from './MobileMenu.module.css'
import { trackEvent } from '@/lib/analytics'

type MobileMenuLevel = {
  label: string
  items: NavItem[]
  parentLabel?: string
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  return pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname
}

function isPathMatch(pathname: string, href?: string): boolean {
  if (!href) return false

  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

function findPathStack(
  items: NavItem[],
  pathname: string,
  parents: MobileMenuLevel[] = []
): MobileMenuLevel[] | null {
  for (const item of items) {
    if (hasHref(item) && isPathMatch(pathname, item.href)) {
      return parents
    }

    if (hasChildren(item)) {
      const nextLevel: MobileMenuLevel = {
        label: item.label,
        items: item.children,
        parentLabel: parents[parents.length - 1]?.label,
      }

      const directChildMatch = item.children.some(child =>
        hasHref(child) ? isPathMatch(pathname, child.href) : false
      )

      if (directChildMatch) {
        return [...parents, nextLevel]
      }

      const nested = findPathStack(item.children, pathname, [...parents, nextLevel])
      if (nested) return nested
    }
  }

  return null
}

function getRootSections(): MobileMenuLevel {
  return {
    label: 'Browse',
    items: MAIN_NAV,
  }
}

function getItemKey(item: NavItem, index: number): string {
  if (item.id) return item.id
  if (item.href) return item.href
  return `${item.label}-${index}`
}

export function MobileMenu() {
  const { mobileOpen, setMobileOpen } = useContext(HeaderContext)

  const pathname = usePathname()
  const startX = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const baseStack = useMemo(() => {
    return findPathStack(MAIN_NAV as MainNavItem[], pathname) ?? []
  }, [pathname])

  /**
   * Only stores user-driven drill-in state beyond the route-derived stack.
   * This avoids syncing derived state inside an effect.
   */
  const [stackOverride, setStackOverride] = useState<MobileMenuLevel[]>([])

  const stack = useMemo(
    () => [...baseStack, ...stackOverride],
    [baseStack, stackOverride]
  )

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (stackOverride.length > 0) {
          setStackOverride(prev => prev.slice(0, -1))
        } else {
          setMobileOpen(false)
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, setMobileOpen, stackOverride.length])

  const currentLevel = stack[stack.length - 1] ?? getRootSections()
  const canGoBack = stack.length > 0

  function closeMenu() {
    setMobileOpen(false)
  }

  function goBack() {
    if (stackOverride.length > 0) {
      setStackOverride(prev => prev.slice(0, -1))
      return
    }

    closeMenu()
  }

  function openChildLevel(item: NavItem) {
    if (!hasChildren(item)) return

    setStackOverride(prev => [
      ...prev,
      {
        label: item.label,
        items: item.children,
        parentLabel:
          prev[prev.length - 1]?.label ??
          baseStack[baseStack.length - 1]?.label ??
          'Browse',
      },
    ])
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    startX.current = e.touches[0]?.clientX ?? null
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (startX.current === null) return

    const endX = e.changedTouches[0]?.clientX ?? startX.current
    const delta = endX - startX.current

    if (delta > 90) {
      if (canGoBack) {
        goBack()
      } else {
        closeMenu()
      }
    }

    startX.current = null
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      closeMenu()
    }
  }

  if (!mobileOpen) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onClick={handleOverlayClick}
    >
      <div
        key={`${pathname}-${mobileOpen}`}
        ref={panelRef}
        className={styles.panel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {canGoBack ? (
              <button
                type="button"
                className={styles.backButton}
                onClick={goBack}
                aria-label="Go back"
              >
                <span className={styles.backArrow} aria-hidden>
                  ←
                </span>
                <span className={styles.backText}>Back</span>
              </button>
            ) : (
              <div className={styles.brandBlock}>
                <span className={styles.brandEyebrow}>WaveNation</span>
                <span className={styles.brandTitle}>Menu</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </header>

        <div className={styles.contextBar}>
          <div className={styles.contextText}>
            <span className={styles.contextEyebrow}>
              {canGoBack ? currentLevel.parentLabel ?? 'Section' : 'Browse'}
            </span>
            <h2 className={styles.contextTitle}>{currentLevel.label}</h2>
          </div>

          {canGoBack ? (
            <span className={styles.depthPill}>{stack.length + 1}</span>
          ) : null}
        </div>

        <nav className={styles.nav} aria-label="Mobile site navigation">
          <ul className={styles.list}>
            {currentLevel.items.map((item, index) => {
              const key = getItemKey(item, index)
              const childMenu = hasChildren(item)
              const href = hasHref(item) ? item.href : undefined
              const active = isPathMatch(pathname, href)

              return (
                <li key={key} className={styles.item}>
                  {childMenu ? (
                    <button
                      type="button"
                      className={styles.navCard}
                      onClick={() => {
                        trackEvent('navigation_click', {
                          component: 'mobile_menu',
                          section: currentLevel.label,
                          label: item.label,
                          href: href ?? 'nested-menu',
                        })
                        openChildLevel(item)
                      }}
                    >
                      <div className={styles.navCardBody}>
                        <div className={styles.navTopline}>
                          <span className={styles.navLabel}>{item.label}</span>
                          {item.badge ? (
                            <span className={styles.badge}>{item.badge}</span>
                          ) : null}
                        </div>

                        {item.description ? (
                          <p className={styles.navDescription}>{item.description}</p>
                        ) : null}
                      </div>

                      <span className={styles.chevron} aria-hidden>
                        →
                      </span>
                    </button>
                  ) : hasHref(item) ? (
                    <Link
                      href={item.href}
                      className={`${styles.navCard} ${active ? styles.navCardActive : ''}`}
                      onClick={() => {
                        trackEvent('navigation_click', {
                          component: 'mobile_menu',
                          section: currentLevel.label,
                          label: item.label,
                          href: item.href,
                        })
                        closeMenu()
                      }}
                    >
                      <div className={styles.navCardBody}>
                        <div className={styles.navTopline}>
                          <span className={styles.navLabel}>{item.label}</span>
                          {item.badge ? (
                            <span className={styles.badge}>{item.badge}</span>
                          ) : null}
                        </div>

                        {item.description ? (
                          <p className={styles.navDescription}>{item.description}</p>
                        ) : null}
                      </div>

                      <span className={styles.chevron} aria-hidden>
                        ↗
                      </span>
                    </Link>
                  ) : (
                    <div className={`${styles.navCard} ${styles.navCardStatic}`}>
                      <div className={styles.navCardBody}>
                        <div className={styles.navTopline}>
                          <span className={styles.navLabel}>{item.label}</span>
                          {item.badge ? (
                            <span className={styles.badge}>{item.badge}</span>
                          ) : null}
                        </div>

                        {item.description ? (
                          <p className={styles.navDescription}>{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <footer className={styles.footer}>
          <div className={styles.footerCard}>
            <span className={styles.footerEyebrow}>WaveNation</span>
            <p className={styles.footerText}>
              Culture-forward radio, news, video, creators, and community.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}