'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { useHeader } from '../Header.context'
import { IconRenderer } from './IconRenderer'
import type { MainNavItem, NavBadge } from '../nav/nav.types'
import styles from './BroadcastNav.module.css'

const formatHref = (h: string) => (h.startsWith('/') ? h : `/${h}`)

function MenuBadge({ type }: { type?: NavBadge | null }) {
  if (!type || type === 'none') return null
  const classKey = type.replace('-', '_')
  return (
    <span className={`${styles.badge} ${styles[`badge_${classKey}`]}`}>
      {type.replace('-', ' ')}
    </span>
  )
}

export function BroadcastNav({ navData, currentPath }: { navData: MainNavItem[], currentPath: string }) {
  const { activeMenu, setActiveMenu } = useHeader()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      if (navRef.current && !navRef.current.contains(e.relatedTarget as Node)) setActiveMenu(null)
    }
    document.addEventListener('focusout', handleFocusOut)
    return () => document.removeEventListener('focusout', handleFocusOut)
  }, [setActiveMenu])

  return (
    <nav className={styles.root} ref={navRef} onMouseLeave={() => setActiveMenu(null)}>
      <ul className={styles.triggerList}>
        {navData.map((item) => {
          const isActive = activeMenu === item.id
          const itemHref = formatHref(item.href)
          const isCurrent = currentPath === itemHref || (itemHref !== '/' && currentPath.startsWith(itemHref))

          return (
            <li key={item.id} className={styles.triggerItem} onMouseEnter={() => setActiveMenu(item.id)}>
              <Link href={itemHref} className={`${styles.triggerBtn} ${isActive || isCurrent ? styles.active : ''}`}>
                {item.label}
                {item.columns && item.columns.length > 0 && (
                  <ChevronDown size={14} className={`${styles.chevron} ${isActive ? styles.chevronOpen : ''}`} />
                )}
              </Link>

              {isActive && item.columns && item.columns.length > 0 && (
                <div className={styles.megaMenuWrapper}>
                  <div className={styles.megaMenuInner}>
                    {/* Featured Area */}
                    {item.featured?.title && (
                      <div className={styles.featuredArea}>
                        <div 
                          className={styles.featuredCard} 
                          style={{ '--card-accent': `var(--wn-color-${item.featured.accent || 'brand'})` } as React.CSSProperties}
                        >
                          <div className={styles.featuredContent}>
                            <span className={styles.featuredEyebrow}>{item.featured.eyebrow}</span>
                            <h3 className={styles.featuredTitle}>{item.featured.title}</h3>
                            <p className={styles.featuredDesc}>{item.featured.description}</p>
                          </div>
                          <Link href={formatHref(item.featured.href || '/')} className={styles.featuredBtn} onClick={() => setActiveMenu(null)}>
                            Explore <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Links Area */}
                    <div className={styles.linksArea}>
                      {item.columns.map((col) => (
                        <div key={col.id} className={styles.menuColumn}>
                          <div className={styles.columnHeader}>
                            {col.icon && <IconRenderer name={col.icon} size={16} className={styles.colIcon} />}
                            {col.label}
                          </div>
                          <ul className={styles.linkList}>
                            {col.links.map((link) => (
                              <li key={link.id}>
                                <Link href={formatHref(link.href)} className={styles.linkItem} onClick={() => setActiveMenu(null)}>
                                  <span className={styles.linkLabel}>{link.label}</span>
                                  <MenuBadge type={link.badge} />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}