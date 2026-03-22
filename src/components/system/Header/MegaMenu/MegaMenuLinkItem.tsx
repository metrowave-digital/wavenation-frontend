'use client'

import Link from 'next/link'

import type { NavItem } from '../nav/nav.types'
import styles from './MegaMenuLinkItem.module.css'
import {
  getItemDescription,
  getItemEyebrow,
  getResolvedHref,
} from './megaMenu.utils'
import { trackEvent } from '@/lib/analytics'

interface MegaMenuLinkItemProps {
  item: NavItem
  sectionId: string
  parentLabel?: string
  onNavigate?: () => void
}

export function MegaMenuLinkItem({
  item,
  sectionId,
  parentLabel,
  onNavigate,
}: MegaMenuLinkItemProps) {
  const href = getResolvedHref(item)
  const description = getItemDescription(item)
  const eyebrow = getItemEyebrow(item)

  const isDisabled = href === '#'

  if (isDisabled) {
    return (
      <div className={styles.linkItemDisabled} aria-disabled="true">
        <div className={styles.linkGlow} aria-hidden="true" />
        <div className={styles.linkAccent} aria-hidden="true" />
        <div className={styles.linkBody}>
          {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}

          <div className={styles.labelRow}>
            <span className={styles.label}>{item.label}</span>
          </div>

          {description ? (
            <div className={styles.description}>{description}</div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={styles.linkItem}
      data-megamenu-item
      onClick={() => {
        trackEvent('navigation_click', {
          component: 'mega_menu',
          section: sectionId,
          parent: parentLabel,
          label: item.label,
          href,
        })
        onNavigate?.()
      }}
    >
      <div className={styles.linkGlow} aria-hidden="true" />
      <div className={styles.linkAccent} aria-hidden="true" />

      <div className={styles.linkBody}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}

        <div className={styles.labelRow}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </div>

        {description ? (
          <div className={styles.description}>{description}</div>
        ) : null}
      </div>
    </Link>
  )
}