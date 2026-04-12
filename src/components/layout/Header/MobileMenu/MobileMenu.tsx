'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronDown, ArrowRight, Instagram, Youtube, Facebook, Music2 } from 'lucide-react'
import { X as XIcon } from 'lucide-react' // Renaming for the X (Twitter) icon
import { useHeader } from '../Header.context'
import { IconRenderer } from '../BroadcastNav/IconRenderer'
import { trackEvent } from '@/lib/analytics'
import type { MainNavItem, NavBadge } from '../nav/nav.types'
import type { SiteSettings } from '@/services/settings.api'
import styles from './MobileMenu.module.css'

/* ==========================================================================
   Helpers
   ========================================================================== */
const formatHref = (h: string) => (h.startsWith('/') ? h : `/${h}`)

function MobileBadge({ type }: { type?: NavBadge | null }) {
  if (!type || type === 'none') return null
  const classKey = type.replace('-', '_')
  return (
    <span className={`${styles.badge} ${styles[`badge_${classKey}`]}`}>
      {type.replace('-', ' ')}
    </span>
  )
}

/* ==========================================================================
   Main Component
   ========================================================================== */
interface MobileMenuProps {
  navData: MainNavItem[]
  settings: SiteSettings | null
}

export function MobileMenu({ navData, settings }: MobileMenuProps) {
  const { isMobileMenuOpen, setMobileMenuOpen } = useHeader()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Sync scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  if (!isMobileMenuOpen) return null

  const closeMenu = () => setMobileMenuOpen(false)

  const handleSocialClick = (platform: string, url: string) => {
    trackEvent('navigation_click', { 
      placement: 'mobile_menu', 
      platform, 
      href: url, 
      external: true 
    })
  }

  return (
    <div className={styles.overlay} onClick={closeMenu}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER SECTION */}
        <div className={styles.header}>
          <div className={styles.brand}>
            {settings?.logoDark?.url && (
              <Image 
                src={settings.logoDark.url} 
                alt="Logo" 
                width={32} 
                height={32} 
                className={styles.logo}
              />
            )}
            <span className={styles.brandText}>
              {settings?.siteTitle || 'WAVENATION'}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={closeMenu}>
            <X size={24} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className={styles.content}>
          <nav className={styles.nav}>
            {navData.map((item) => {
              const isExpanded = expandedSection === item.id
              const hasFeatured = item.featured && (item.featured.title || item.featured.description)

              return (
                <div key={item.id} className={styles.section}>
                  <button
                    className={`${styles.trigger} ${isExpanded ? styles.triggerExpanded : ''}`}
                    onClick={() => setExpandedSection(isExpanded ? null : item.id)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={20} className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} />
                  </button>

                  <div className={`${styles.accordionContent} ${isExpanded ? styles.contentOpen : ''}`}>
                    <div className={styles.accordionInner}>
                      {hasFeatured && (
                        <div className={styles.featuredWrapper}>
                          <div className={styles.featuredCard}>
                            <h4 className={styles.featuredTitle}>{item.featured?.title}</h4>
                            <p className={styles.featuredDesc}>{item.featured?.description}</p>
                            <Link href={formatHref(item.featured?.href || '/')} className={styles.featuredBtn} onClick={closeMenu}>
                              Explore <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className={styles.columnsGrid}>
                        {item.columns?.map((col) => (
                          <div key={col.id} className={styles.column}>
                            <div className={styles.columnHeader}>{col.label}</div>
                            <ul className={styles.linkList}>
                              {col.links.map((link) => (
                                <li key={link.id}>
                                  <Link href={formatHref(link.href)} className={styles.linkItem} onClick={closeMenu}>
                                    <span className={styles.linkLabel}>{link.label}</span>
                                    <MobileBadge type={link.badge} />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* MOBILE MENU FOOTER (Socials & Contact) */}
          <div className={styles.menuFooter}>
            <div className={styles.socials}>
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener" onClick={() => handleSocialClick('instagram', settings.instagramUrl!)}>
                  <Instagram size={22} />
                </a>
              )}
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener" onClick={() => handleSocialClick('facebook', settings.facebookUrl!)}>
                  <Facebook size={22} />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener" onClick={() => handleSocialClick('youtube', settings.youtubeUrl!)}>
                  <Youtube size={22} />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener" onClick={() => handleSocialClick('x', settings.twitterUrl!)}>
                  <XIcon size={20} />
                </a>
              )}
              {settings?.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener" onClick={() => handleSocialClick('tiktok', settings.tiktokUrl!)}>
                  <Music2 size={22} />
                </a>
              )}
            </div>

            <div className={styles.contactInfo}>
              <a href={`mailto:${settings?.email || 'hello@wavenation.online'}`} className={styles.email}>
                {settings?.email || 'hello@wavenation.online'}
              </a>
              <p className={styles.tagline}>{settings?.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}