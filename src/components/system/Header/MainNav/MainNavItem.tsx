'use client'

import { useContext } from 'react'
import type { ComponentType } from 'react'
import { HeaderContext } from '../Header.context'
import styles from './MainNavItem.module.css'

import type { MegaMenuItem } from '../MegaMenu/MegaMenu.types'

/* ======================================================
   Props
====================================================== */

interface MainNavItemProps {
  item: MegaMenuItem
}

/* ======================================================
   Component
====================================================== */

export function MainNavItem({ item }: MainNavItemProps) {
  const { activeMenu, setActiveMenu } =
    useContext(HeaderContext)

  const Icon = item.icon as
    | ComponentType<{
        size?: number
        strokeWidth?: number
      }>
    | undefined

  const isActive = activeMenu === item.id

  function handleClick() {
    setActiveMenu(isActive ? null : item.id)
  }

  return (
    <button
      type="button"
      className={`${styles.item} ${
        isActive ? styles.active : ''
      }`}
      onClick={handleClick}
      data-active={isActive || undefined}
      aria-haspopup={
        item.children?.length ? 'dialog' : undefined
      }
      aria-expanded={
        item.children?.length ? isActive : undefined
      }
      aria-controls={
        item.children?.length
          ? `mega-${item.id}`
          : undefined
      }
    >
      {Icon && (
        <Icon
          size={18}
          strokeWidth={2}
          aria-hidden
        />
      )}

      <span className={styles.label}>
        {item.label}
      </span>
    </button>
  )
}
