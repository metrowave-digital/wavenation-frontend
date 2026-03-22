'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  Compass,
  Headphones,
  Newspaper,
  Radio,
  Sparkles,
  TrendingUp,
  Tv,
  Zap,
} from 'lucide-react'

import type { NavItem } from '../nav/nav.types'
import { getFirstHref, hasChildren, hasHref } from '../nav/nav.types'
import styles from './MegaMenuGroup.module.css'
import { trackEvent } from '@/lib/analytics'
import {
  getBadgeLabel,
  isHrefActive,
  type NavItemWithEnhancements,
} from './megaMenu.helpers'

interface MegaMenuGroupProps {
  group: NavItemWithEnhancements
  sectionId: string
  index: number
  pathname: string
  onNavigate?: () => void
}

function getGroupHref(group: NavItem): string | undefined {
  if (hasHref(group)) return group.href ?? undefined
  if (hasChildren(group)) return getFirstHref(group.children) ?? undefined
  return undefined
}

function renderGroupIcon(
  group: NavItemWithEnhancements,
  className: string
): ReactNode {
  if (group.icon) {
    const Icon = group.icon
    return <Icon className={className} />
  }

  const id = String(group.id ?? '').toLowerCase()
  const label = String(group.label ?? '').toLowerCase()

  if (
    id.includes('radio') ||
    label.includes('radio') ||
    label.includes('station')
  ) {
    return <Radio className={className} />
  }

  if (
    id.includes('listen') ||
    label.includes('listen') ||
    label.includes('audio') ||
    label.includes('playlist')
  ) {
    return <Headphones className={className} />
  }

  if (
    id.includes('news') ||
    label.includes('news') ||
    label.includes('editorial')
  ) {
    return <Newspaper className={className} />
  }

  if (
    id.includes('tv') ||
    id.includes('watch') ||
    label.includes('watch') ||
    label.includes('video')
  ) {
    return <Tv className={className} />
  }

  if (id.includes('live') || label.includes('live')) {
    return <Zap className={className} />
  }

  if (id.includes('trend') || label.includes('trend')) {
    return <TrendingUp className={className} />
  }

  if (id.includes('discover') || label.includes('discover')) {
    return <Compass className={className} />
  }

  return <Sparkles className={className} />
}

export function MegaMenuGroup({
  group,
  sectionId,
  index,
  pathname,
  onNavigate,
}: MegaMenuGroupProps) {
  const href = getGroupHref(group)
  const isActive = isHrefActive(pathname, href)
  const badge = getBadgeLabel(group.badge)
  const children = hasChildren(group) ? group.children.slice(0, 5) : []

  return (
    <motion.div
      className={styles.groupCard}
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.34,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      data-active={isActive ? 'true' : 'false'}
    >
      <div className={styles.groupAmbient} aria-hidden="true" />
      <div className={styles.groupShimmer} aria-hidden="true" />
      <div className={styles.groupBorderGlow} aria-hidden="true" />

      <div className={styles.groupInner}>
        {href ? (
          <Link
            href={href}
            className={styles.groupHeader}
            onClick={() => {
              trackEvent('navigation_click', {
                component: 'mega_menu_group',
                section: sectionId,
                label: group.label,
                href,
              })
              onNavigate?.()
            }}
          >
            <span className={styles.groupTitleWrap}>
              <span className={styles.groupIconWrap}>
                <span className={styles.groupIconGlow} aria-hidden="true" />
                {renderGroupIcon(group, styles.groupIcon)}
              </span>

             <span className={styles.groupTitleBlock}>
  <span className={styles.groupTitle}>{group.label}</span>
</span>
            </span>

            <span className={styles.groupHeaderMeta}>
              {badge ? (
                <span className={styles.groupBadge} data-badge={group.badge}>
                  {badge}
                </span>
              ) : null}
              <ArrowUpRight className={styles.groupArrow} />
            </span>
          </Link>
        ) : (
          <div className={styles.groupHeader}>
            <span className={styles.groupTitleWrap}>
              <span className={styles.groupIconWrap}>
                <span className={styles.groupIconGlow} aria-hidden="true" />
                {renderGroupIcon(group, styles.groupIcon)}
              </span>

              <span className={styles.groupTitleBlock}>
  <span className={styles.groupTitle}>{group.label}</span>
</span>
            </span>

            {badge ? (
              <span className={styles.groupBadge} data-badge={group.badge}>
                {badge}
              </span>
            ) : null}
          </div>
        )}

        {group.description ? (
          <p className={styles.groupDescription}>{group.description}</p>
        ) : null}

        {children.length ? (
          <div className={styles.groupLinks}>
            {children.map((child, childIndex) => {
              if (!hasHref(child) || !child.href) return null

              const childHref = child.href
              const childActive = isHrefActive(pathname, childHref)

              return (
                <Link
                  key={`${group.label}-${child.label}-${childIndex}`}
                  href={childHref}
                  className={styles.groupLink}
                  data-active={childActive ? 'true' : 'false'}
                  onClick={() => {
                    trackEvent('navigation_click', {
                      component: 'mega_menu_group_link',
                      section: sectionId,
                      parent: group.label,
                      label: child.label,
                      href: childHref,
                    })
                    onNavigate?.()
                  }}
                >
                  <span className={styles.groupLinkAccent} aria-hidden="true" />

                  <span className={styles.groupLinkText}>
                    <span className={styles.groupLinkLabel}>{child.label}</span>
                    {child.description ? (
                      <span className={styles.groupLinkDescription}>
                        {child.description}
                      </span>
                    ) : null}
                  </span>

                  <ArrowUpRight className={styles.groupLinkArrow} />
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}