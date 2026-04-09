'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ArrowRight } from 'lucide-react'
import { useHeader } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import type { NavBadge } from '../nav/nav.types'
import styles from './MobileMenu.module.css'

/* ==========================================================================
   Helper: Badges
   ========================================================================== */
function MobileBadge({ type }: { type?: NavBadge }) {
  if (!type) return null
  return (
    <span className={`${styles.badge} ${styles[`badge_${type}`]}`}>
      {type}
    </span>
  )
}

/* ==========================================================================
   Main Component
   ========================================================================== */
export function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useHeader()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Reset accordion when menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setTimeout(() => setExpandedSection(null), 300) // wait for animation
    }
  }, [isMobileMenuOpen])

  if (!isMobileMenuOpen) return null

  const closeMenu = () => setMobileMenuOpen(false)

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id))
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.brandText}>WAVENATION</span>
          <button 
            className={styles.closeBtn} 
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.content}>
          <nav className={styles.nav}>
            {MAIN_NAV.map((item) => {
              const isExpanded = expandedSection === item.id

              return (
                <div key={item.id} className={styles.section}>
                  {/* Tier 1: Trigger */}
                  <button
                    className={`${styles.trigger} ${isExpanded ? styles.triggerExpanded : ''}`}
                    onClick={() => toggleSection(item.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{item.label}</span>
                    <ChevronDown 
                      size={20} 
                      className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} 
                    />
                  </button>

                  {/* Tier 2 & 3: Accordion Content */}
                  <div className={`${styles.accordionContent} ${isExpanded ? styles.contentOpen : ''}`}>
                    <div className={styles.accordionInner}>
                      
                      {/* Featured Card */}
                      {item.featured && (
                        <div className={styles.featuredWrapper}>
                          <div 
                            className={styles.featuredCard}
                            style={{ 
                              '--card-accent': `var(--wn-color-${item.featured.accent}, #39FF14)` 
                            } as React.CSSProperties}
                          >
                            <span className={styles.featuredEyebrow}>{item.featured.eyebrow}</span>
                            <h4 className={styles.featuredTitle}>{item.featured.title}</h4>
                            <p className={styles.featuredDesc}>{item.featured.description}</p>
                            <Link 
                              href={item.featured.href} 
                              className={styles.featuredBtn}
                              onClick={closeMenu}
                            >
                              Explore <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Columns and Links */}
                      <div className={styles.columnsGrid}>
                        {item.columns.map((col, cIdx) => (
                          <div key={`col-${cIdx}`} className={styles.column}>
                            <div className={styles.columnHeader}>
                              {col.icon && <col.icon size={14} className={styles.colIcon} />}
                              {col.label}
                              <MobileBadge type={col.badge} />
                            </div>
                            
                            {col.links && col.links.length > 0 && (
                              <ul className={styles.linkList}>
                                {col.links.map((link, lIdx) => (
                                  <li key={`link-${lIdx}`}>
                                    <Link 
                                      href={link.href}
                                      className={styles.linkItem}
                                      onClick={closeMenu}
                                    >
                                      <span className={styles.linkLabel}>{link.label}</span>
                                      <MobileBadge type={link.badge} />
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
                </div>
              )
            })}
          </nav>
        </div>
        
      </div>
    </div>
  )
}