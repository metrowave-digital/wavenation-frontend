'use client'

import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './MegaMenuCard.module.css'

interface MegaMenuCardProps {
  children: ReactNode
  className?: string
  elevated?: boolean
  interactive?: boolean
  glow?: boolean
  as?: 'div' | 'section' | 'article'
}

export function MegaMenuCard({
  children,
  className,
  elevated = false,
  interactive = false,
  glow = false,
  as = 'div',
}: MegaMenuCardProps) {
  const Component = as

  return (
    <Component
      className={clsx(
        styles.card,
        elevated && styles.elevated,
        interactive && styles.interactive,
        glow && styles.glow,
        className
      )}
    >
      <span className={styles.borderGlow} aria-hidden="true" />
      <span className={styles.noise} aria-hidden="true" />
      {children}
    </Component>
  )
}