'use client'

import { motion } from 'framer-motion'

import type { NavItem } from '../nav/nav.types'
import styles from './MegaMenuPanel.module.css'
import {
  MegaMenuFeatured,
  type FeaturedCard,
  type FeaturedSeed,
} from './MegaMenuFeatured'
import { MegaMenuGroup } from './MegaMenuGroup'
import { MAX_GROUPS } from './megaMenu.utils'
import { childVariants } from './MegaMenuPanel'
import type { NavItemWithEnhancements } from './megaMenu.helpers'

interface MegaMenuPanelBodyProps {
  sectionId: string
  itemLabel: string
  pathname: string
  groups?: NavItem[]
  featuredSeed: FeaturedSeed
  hero?: FeaturedCard | null
  secondary?: FeaturedCard | null
  loading?: boolean
  onNavigate?: () => void
}

export function MegaMenuPanelBody({
  sectionId,
  itemLabel,
  pathname,
  groups,
  featuredSeed,
  hero,
  secondary,
  loading = false,
  onNavigate,
}: MegaMenuPanelBodyProps) {
  const visibleGroups = groups?.slice(0, MAX_GROUPS) ?? []

  return (
    <div className={styles.body}>
      <motion.nav
        className={styles.columns}
        aria-label={`${itemLabel} navigation`}
        variants={childVariants}
      >
        {visibleGroups.map((group, index) => (
          <MegaMenuGroup
            key={`${sectionId}-${group.label}-${index}`}
            group={group as NavItemWithEnhancements}
            sectionId={sectionId}
            index={index}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        ))}
      </motion.nav>

      <motion.aside
        className={styles.featuredRail}
        aria-label="Featured stories"
        variants={childVariants}
      >
        <MegaMenuFeatured
          sectionId={sectionId}
          hero={hero ?? null}
          secondary={secondary ?? null}
          featuredSeed={featuredSeed}
          loading={loading}
          onNavigate={onNavigate}
        />
      </motion.aside>
    </div>
  )
}