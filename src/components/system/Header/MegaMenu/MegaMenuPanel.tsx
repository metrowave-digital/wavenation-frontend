'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import type { CSSProperties } from 'react'
import clsx from 'clsx'

import type { MainNavItem } from '../nav/nav.types'
import {
  getDefaultSectionHref,
  getFeaturedSeed,
  getFirstHref,
} from '../nav/nav.types'

import styles from './MegaMenuPanel.module.css'
import type { FeaturedCard } from './MegaMenuFeatured'
import { MegaMenuPanelHeader } from './MegaMenuPanelHeader'
import { MegaMenuPanelBody } from './MegaMenuPanelBody'
import {
  getBadgeLabel,
  getItemIcon,
  isChildActive,
  isHrefActive,
  type MainNavItemWithEnhancements,
} from './megaMenu.helpers'
import { MEGA_MENU_TOKENS } from './megaMenu.tokens'

interface Props {
  item: MainNavItem
  onNavigate?: () => void
  className?: string
}

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.985,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.38,
      ease: MEGA_MENU_TOKENS.motion.easeStandard,
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    filter: 'blur(4px)',
    transition: {
      duration: 0.22,
      ease: MEGA_MENU_TOKENS.motion.easeExit,
    },
  },
}

export const childVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: MEGA_MENU_TOKENS.motion.easeStandard,
    },
  },
}

export function MegaMenuPanel({ item, onNavigate, className }: Props) {
  const pathname = usePathname()
  const enhancedItem = item as MainNavItemWithEnhancements

  const [featured, setFeatured] = useState<FeaturedCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function loadFeatured() {
      try {
        setLoading(true)

        const response = await fetch(
          `/api/menu-featured?context=${encodeURIComponent(item.id)}`,
          {
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load featured content')
        }

        const json = (await response.json()) as FeaturedCard[]

        if (!isMounted) return
        setFeatured(Array.isArray(json) ? json.slice(0, 2) : [])
      } catch {
        if (!isMounted) return
        setFeatured([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadFeatured()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [item.id])

  const sectionHref = useMemo(() => {
    return getFirstHref(item.children) ?? getDefaultSectionHref(item)
  }, [item])

  const featuredSeed = useMemo(() => getFeaturedSeed(item), [item])
  const primaryFeatured = featured[0] ?? null
  const secondaryFeatured = featured[1] ?? null

  const SectionIcon = getItemIcon(enhancedItem)
  const sectionBadge = getBadgeLabel(enhancedItem.badge)

  const isActive = useMemo(() => {
    return (
      isHrefActive(pathname, sectionHref) ||
      isChildActive(pathname, item.children)
    )
  }, [item.children, pathname, sectionHref])

  const panelVars: CSSProperties = {
    ['--mega-radius' as string]: MEGA_MENU_TOKENS.radius.panel,
    ['--mega-radius-card' as string]: MEGA_MENU_TOKENS.radius.card,
    ['--mega-space-panel' as string]: MEGA_MENU_TOKENS.spacing.panel,
    ['--mega-space-gap' as string]: MEGA_MENU_TOKENS.spacing.gap,
    ['--mega-space-header-gap' as string]: MEGA_MENU_TOKENS.spacing.headerGap,
    ['--mega-ease-standard' as string]:
      MEGA_MENU_TOKENS.motion.cssEaseStandard,
    ['--mega-ease-emphasis' as string]:
      MEGA_MENU_TOKENS.motion.cssEaseEmphasis,
    ['--mega-shadow-panel' as string]: MEGA_MENU_TOKENS.shadow.panel,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        className={styles.panelDock}
        style={panelVars}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={styles.panelViewport}>
          <section
            className={clsx(styles.panel, className)}
            aria-label={`${item.label} menu panel`}
            data-active={isActive ? 'true' : 'false'}
          >
            <div className={styles.panelBackground} aria-hidden="true" />
            <div className={styles.panelGlow} aria-hidden="true" />

            <MegaMenuPanelHeader
              item={enhancedItem}
              sectionHref={sectionHref}
              isActive={isActive}
              sectionBadge={sectionBadge}
              SectionIcon={SectionIcon}
              onNavigate={onNavigate}
            />

            <MegaMenuPanelBody
              sectionId={item.id}
              itemLabel={item.label}
              pathname={pathname}
              groups={item.children}
              featuredSeed={featuredSeed}
              hero={primaryFeatured}
              secondary={secondaryFeatured}
              loading={loading}
              onNavigate={onNavigate}
            />
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}