'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { useHeader } from '../Header.context'

// Import your new simplified configuration and types
import { MAIN_NAV } from '../nav/nav.config'
import type { MainNavItem, NavBadge } from '../nav/nav.types'

import styles from './BroadcastNav.module.css'

/* ==========================================================================
   Helper: Badges
   ========================================================================== */
function MenuBadge({ type }: { type?: NavBadge }) {
  if (!type) return null
  return (
    <span className={`${styles.badge} ${styles[`badge_${type}`]}`}>
      {type}
    </span>
  )
}

/* ==========================================================================
   Sub-Component: Mega Menu Panel
   ========================================================================== */
function MegaMenu({ item, closeMenu }: { item: MainNavItem; closeMenu: () => void }) {
  const { featured, columns } = item

  // Map the accent string to a CSS variable (fallback to standard cyan)
  const accentVar = featured?.accent 
    ? `var(--wn-color-${featured.accent}, #39FF14)` 
    : 'var(--wn-color-electric-blue, #00FFFF)'

  return (
    <div className={styles.megaMenuWrapper}>
      <div className={styles.megaMenuInner}>
        
        {/* LEFT COLUMN: Featured Area */}
        {featured ? (
          <div className={styles.featuredArea}>
            <div 
              className={styles.featuredCard} 
              style={{ '--card-accent': accentVar } as React.CSSProperties}
            >
              <div className={styles.featuredContent}>
                <span className={styles.featuredEyebrow}>{featured.eyebrow}</span>
                <h3 className={styles.featuredTitle}>{featured.title}</h3>
                <p className={styles.featuredDesc}>{featured.description}</p>
              </div>
              <Link 
                href={featured.href} 
                className={styles.featuredBtn}
                onClick={closeMenu}
              >
                Explore <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.emptyFeaturedSpace} /> 
        )}

        {/* RIGHT COLUMNS: Navigation Links */}
        <div className={styles.linksArea}>
          {columns.map((col, idx) => (
            <div key={`col-${idx}`} className={styles.menuColumn}>
              {/* Column Header (Tier 2) */}
              <div className={styles.columnHeader}>
                {col.icon && <col.icon size={16} className={styles.colIcon} />}
                {col.label}
                <MenuBadge type={col.badge} />
              </div>

              {/* Column Links (Tier 3) */}
              {col.links && col.links.length > 0 && (
                <ul className={styles.linkList}>
                  {col.links.map((link, lIdx) => (
                    <li key={`link-${lIdx}`}>
                      <Link 
                        href={link.href}
                        className={styles.linkItem}
                        onClick={closeMenu}
                      >
                        <div className={styles.linkTextWrapper}>
                          <span className={styles.linkLabel}>{link.label}</span>
                          {link.description && (
                            <span className={styles.linkDesc}>{link.description}</span>
                          )}
                        </div>
                        <MenuBadge type={link.badge} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ==========================================================================
   Main Component: Broadcast Nav
   ========================================================================== */
export function BroadcastNav({ currentPath }: { currentPath: string }) {
  const { activeMenu, setActiveMenu } = useHeader()
  const navRef = useRef<HTMLElement>(null)

  // Close menu if user tabs away / focus moves outside the nav completely
  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      if (navRef.current && !navRef.current.contains(e.relatedTarget as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('focusout', handleFocusOut)
    return () => document.removeEventListener('focusout', handleFocusOut)
  }, [setActiveMenu])

  return (
    <nav className={styles.root} ref={navRef} onMouseLeave={() => setActiveMenu(null)}>
      <ul className={styles.triggerList}>
        {MAIN_NAV.map((item) => {
          const isActive = activeMenu === item.id
          const isCurrentSection = currentPath.startsWith(item.href)

          return (
            <li 
              key={item.id} 
              className={styles.triggerItem}
              onMouseEnter={() => setActiveMenu(item.id)}
            >
              <Link 
                href={item.href}
                className={`${styles.triggerBtn} ${isActive || isCurrentSection ? styles.active : ''}`}
                onClick={() => setActiveMenu(null)}
                aria-expanded={isActive}
              >
                {item.label}
                {item.columns && item.columns.length > 0 && (
                  <ChevronDown 
                    size={14} 
                    className={`${styles.chevron} ${isActive ? styles.chevronOpen : ''}`} 
                  />
                )}
              </Link>

              {/* Mega Menu Dropdown */}
              {isActive && item.columns && item.columns.length > 0 && (
                <MegaMenu item={item} closeMenu={() => setActiveMenu(null)} />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}