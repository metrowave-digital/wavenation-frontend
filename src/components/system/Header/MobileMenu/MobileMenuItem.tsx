import Link from 'next/link'
import { createElement } from 'react'
import { ChevronRight } from 'lucide-react'

import type { NavItem } from '../nav/nav.types'
import { hasChildren, hasHref } from '../nav/nav.types'
import { trackEvent } from '@/lib/analytics'

import {
  isPathMatch,
  MOBILE_MENU_FALLBACK_ICON,
  MOBILE_MENU_SECTION_ICONS,
} from './mobileMenu.utils'
import styles from './MobileMenuItem.module.css'

interface MobileMenuItemProps {
  item: NavItem
  pathname: string
  sectionLabel: string
  onOpenChild: (item: NavItem) => void
  onNavigate: () => void
}

function MobileMenuItemContent({ item }: { item: NavItem }) {
  const iconKey = item.label.trim().toLowerCase()
  const Icon = MOBILE_MENU_SECTION_ICONS[iconKey] ?? MOBILE_MENU_FALLBACK_ICON

  return (
    <div className={styles.leading}>
      <span className={styles.iconWrap}>
        {createElement(Icon, { className: styles.icon, 'aria-hidden': true })}
      </span>

      <div className={styles.navCardBody}>
        <div className={styles.navTopline}>
          <span className={styles.navLabel}>{item.label}</span>
          {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
        </div>

        {item.description ? (
          <p className={styles.navDescription}>{item.description}</p>
        ) : null}
      </div>
    </div>
  )
}

export function MobileMenuItem({
  item,
  pathname,
  sectionLabel,
  onOpenChild,
  onNavigate,
}: MobileMenuItemProps) {
  const childMenu = hasChildren(item)
  const href = hasHref(item) ? item.href : undefined
  const active = isPathMatch(pathname, href)

  if (childMenu) {
    return (
      <button
        type="button"
        className={styles.navCard}
        onClick={() => {
          trackEvent('navigation_click', {
            component: 'mobile_menu',
            section: sectionLabel,
            label: item.label,
            href: 'nested-menu',
          })
          onOpenChild(item)
        }}
      >
        <MobileMenuItemContent item={item} />

        <span className={styles.chevronWrap} aria-hidden>
          <ChevronRight className={styles.chevron} />
        </span>
      </button>
    )
  }

  if (hasHref(item)) {
    return (
      <Link
        href={item.href}
        className={`${styles.navCard} ${active ? styles.navCardActive : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => {
          trackEvent('navigation_click', {
            component: 'mobile_menu',
            section: sectionLabel,
            label: item.label,
            href: item.href,
          })
          onNavigate()
        }}
      >
        <MobileMenuItemContent item={item} />

        <span className={styles.chevronWrap} aria-hidden>
          <ChevronRight className={styles.chevron} />
        </span>
      </Link>
    )
  }

  return (
    <div className={`${styles.navCard} ${styles.navCardStatic}`}>
      <MobileMenuItemContent item={item} />
    </div>
  )
}