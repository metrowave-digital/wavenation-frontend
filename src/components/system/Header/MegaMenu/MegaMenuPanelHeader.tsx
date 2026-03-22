'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import styles from './MegaMenuPanel.module.css'
import { childVariants } from './MegaMenuPanel'
import type {
  IconComponent,
  MainNavItemWithEnhancements,
} from './megaMenu.helpers'
import { trackEvent } from '@/lib/analytics'

interface MegaMenuPanelHeaderProps {
  item: MainNavItemWithEnhancements
  sectionHref: string
  isActive: boolean
  sectionBadge: string | null
  SectionIcon: IconComponent
  onNavigate?: () => void
}

export function MegaMenuPanelHeader({
  item,
  sectionHref,
  isActive,
  sectionBadge,
  SectionIcon,
  onNavigate,
}: MegaMenuPanelHeaderProps) {
  return (
    <motion.div className={styles.header} variants={childVariants}>
      <div className={styles.headerMain}>
        <div className={styles.kickerRow}>
          <span className={styles.kicker}>
            <SectionIcon className={styles.kickerIcon} />
            <span>{String(item.id).toUpperCase()}</span>
          </span>

          <span className={styles.dot} aria-hidden="true" />

          <span className={styles.contextLabel}>Explore the section</span>

          {sectionBadge ? (
            <span className={styles.headerBadge} data-badge={item.badge}>
              {sectionBadge}
            </span>
          ) : null}

          {isActive ? (
            <span className={styles.activePill} aria-label="Current section">
              Current
            </span>
          ) : null}
        </div>

        <div className={styles.titleRow}>
          <h2 className={styles.titleWrap}>
            <SectionIcon className={styles.titleIcon} />
            <span className={styles.title}>{item.label}</span>
          </h2>

          <p className={styles.subtitle}>
            Discover top destinations, editorial lanes, featured stories, and
            curated entry points across the section.
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        <Link
          href={sectionHref}
          className={styles.primaryAction}
          data-megamenu-item
          data-active={isActive ? 'true' : 'false'}
          onClick={() => {
            trackEvent('navigation_click', {
              component: 'mega_menu',
              section: item.id,
              label: `Go to ${item.label}`,
              href: sectionHref,
              activeRoute: isActive,
            })
            onNavigate?.()
          }}
        >
          <span>Go to section</span>
          <ArrowRight className={styles.primaryActionIcon} />
        </Link>
      </div>
    </motion.div>
  )
}