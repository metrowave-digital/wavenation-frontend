'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './FooterNav.module.css'
import { trackEvent } from '@/lib/analytics'
import { FooterColumn } from '../footer.types'

export function FooterNav({ columns }: { columns: FooterColumn[] }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterNav',
      sectionCount: columns.length,
    })
    hasTracked.current = true
  }, [columns.length])

  function handleNavClick(section: string, label: string, href: string) {
    trackEvent('navigation_click', {
      placement: 'footer',
      component: 'FooterNav',
      section,
      label,
      href,
    })
  }

  return (
    <nav className={styles.nav} aria-label="Footer navigation">
      {columns.map(section => {
        const sectionId = `footer-nav-${section.label.toLowerCase().replace(/\s+/g, '-')}`

        return (
          <section key={section.id} className={styles.section} aria-labelledby={sectionId}>
            <h4 id={sectionId} className={styles.heading}>
              {section.label}
            </h4>

            <ul className={styles.list}>
              {section.links.map(link => (
                <li key={link.id} className={styles.item}>
                  <Link
                    href={link.href}
                    className={styles.link}
                    onClick={() => handleNavClick(section.label, link.label, link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </nav>
  )
}