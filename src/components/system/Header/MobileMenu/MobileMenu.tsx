'use client'

import {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeaderContext } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import styles from './MobileMenu.module.css'

/* ======================================================
   Helpers (PURE – no React)
====================================================== */

function findDerivedParent(pathname: string) {
  for (const section of MAIN_NAV) {
    for (const link of section.children ?? []) {
      if (
        link.children?.some(child =>
          pathname.startsWith(child.href)
        )
      ) {
        return {
          label: link.label,
          children: link.children,
        }
      }
    }
  }
  return null
}

/* ======================================================
   Component
====================================================== */

export function MobileMenu() {
  const { mobileOpen, setMobileOpen } =
    useContext(HeaderContext)

  const pathname = usePathname()
  const startX = useRef<number | null>(null)

  /* ---------------------------------------------
     UI state (ONLY user driven)
  ---------------------------------------------- */
  const [uiParent, setUiParent] = useState<{
    label: string
    children: { label: string; href: string }[]
  } | null>(null)

  /* ---------------------------------------------
     Derived active parent (NO STATE)
  ---------------------------------------------- */
  const derivedParent = useMemo(
    () => findDerivedParent(pathname),
    [pathname]
  )

  const activeParent = uiParent ?? derivedParent

  /* ---------------------------------------------
     Lock body scroll
  ---------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen
      ? 'hidden'
      : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  /* ---------------------------------------------
     Swipe handling
  ---------------------------------------------- */
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return

    const delta =
      e.changedTouches[0].clientX - startX.current

    if (delta > 120) {
      if (uiParent) {
        setUiParent(null)
      } else {
        setMobileOpen(false)
      }
    }

    startX.current = null
  }

  if (!mobileOpen) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.panel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ================= HEADER ================= */}
        <header className={styles.header}>
          {activeParent ? (
            <button
              className={styles.back}
              onClick={() => setUiParent(null)}
              aria-label="Back"
            >
              ← Back
            </button>
          ) : (
            <span className={styles.brand}>
              WaveNation
            </span>
          )}

          <button
            className={styles.close}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </header>

        {/* ================= NAV ================= */}
        <nav className={styles.nav}>
          <div
            className={`${styles.slideTrack} ${
              activeParent ? styles.shifted : ''
            }`}
          >
            {/* ROOT LEVEL */}
            <div className={styles.level}>
              {MAIN_NAV.map(section => (
                <div
                  key={section.id}
                  className={styles.section}
                >
                  <h3 className={styles.sectionTitle}>
                    {section.label}
                  </h3>

                  <ul className={styles.links}>
                    {(section.children ?? []).map(
                      link => {
                        const hasChildren =
                          link.children &&
                          link.children.length > 0

                        return (
                          <li
                            key={link.href}
                            className={
                              styles.linkItem
                            }
                          >
                            {hasChildren ? (
                              <button
                                className={
                                  styles.link
                                }
                                onClick={() =>
                                  setUiParent({
                                    label:
                                      link.label,
                                    children:
                                      link.children!,
                                  })
                                }
                              >
                                {link.label}
                                <span
                                  className={
                                    styles.chev
                                  }
                                >
                                  →
                                </span>
                              </button>
                            ) : (
                              <Link
                                href={link.href}
                                className={
                                  styles.link
                                }
                                onClick={() =>
                                  setMobileOpen(
                                    false
                                  )
                                }
                              >
                                {link.label}
                              </Link>
                            )}
                          </li>
                        )
                      }
                    )}
                  </ul>
                </div>
              ))}
            </div>

            {/* SUB LEVEL */}
            <div className={styles.level}>
              {activeParent && (
                <ul className={styles.subLevel}>
                  {activeParent.children.map(
                    child => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={
                            styles.subLink
                          }
                          onClick={() =>
                            setMobileOpen(
                              false
                            )
                          }
                        >
                          {child.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </nav>

        {/* ================= FOOTER ================= */}
        <footer className={styles.footer}>
          <span className={styles.tagline}>
            Culture • Music • Community
          </span>
        </footer>
      </div>
    </div>
  )
}
