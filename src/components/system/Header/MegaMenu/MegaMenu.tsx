'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import type { MainNavItem } from '../nav/nav.types'
import styles from './MegaMenu.module.css'
import { MegaMenuPanel } from './MegaMenuPanel'
import { trackEvent } from '@/lib/analytics'

interface Props {
  items: MainNavItem[]
  className?: string
  onNavigate?: () => void
}

const OPEN_DELAY_MS = 40
const CLOSE_DELAY_MS = 140

export function MegaMenu({ items, className, onNavigate }: Props) {
  const [activeId, setActiveId] = useState<MainNavItem['id'] | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const topbarRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const activeItem = useMemo(
    () => items.find(item => item.id === activeId) ?? null,
    [activeId, items]
  )

  function clearOpenTimer() {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }

  function clearCloseTimer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function clearAllTimers() {
    clearOpenTimer()
    clearCloseTimer()
  }

  function openMenu(id: MainNavItem['id']) {
    clearCloseTimer()
    setActiveId(prev => {
      if (prev !== id) {
        trackEvent('navigation_open', {
          component: 'mega_menu',
          section: id,
        })
      }
      return id
    })
    setIsOpen(true)
  }

  function scheduleOpen(id: MainNavItem['id']) {
    clearOpenTimer()
    clearCloseTimer()

    openTimerRef.current = window.setTimeout(() => {
      openMenu(id)
    }, OPEN_DELAY_MS)
  }

  function closeMenu() {
    clearAllTimers()
    setIsOpen(false)
    setActiveId(null)
  }

  function scheduleClose() {
    clearOpenTimer()
    clearCloseTimer()

    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false)
      setActiveId(null)
    }, CLOSE_DELAY_MS)
  }

  function keepOpen() {
    clearAllTimers()
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null
      if (!target) return

      if (!rootRef.current?.contains(target)) {
        closeMenu()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return

      closeMenu()

      const activeTrigger = topbarRef.current?.querySelector<HTMLElement>(
        '[data-nav-trigger="true"][data-active="true"]'
      )

      activeTrigger?.focus()
    }

    function handleFocusIn(event: FocusEvent) {
      const target = event.target as Node | null
      if (!target) return

      if (!rootRef.current?.contains(target)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('focusin', handleFocusIn)
      clearAllTimers()
    }
  }, [])

  function handleTriggerKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    id: MainNavItem['id']
  ) {
    const triggers = Array.from(
      topbarRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-nav-trigger="true"]'
      ) ?? []
    )

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown': {
        event.preventDefault()
        openMenu(id)

        const firstPanelLink = panelRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )

        window.setTimeout(() => {
          firstPanelLink?.focus()
        }, 0)
        break
      }

      case 'ArrowRight': {
        event.preventDefault()
        const nextIndex = (index + 1) % triggers.length
        triggers[nextIndex]?.focus()
        scheduleOpen(items[nextIndex].id)
        break
      }

      case 'ArrowLeft': {
        event.preventDefault()
        const prevIndex = (index - 1 + triggers.length) % triggers.length
        triggers[prevIndex]?.focus()
        scheduleOpen(items[prevIndex].id)
        break
      }

      case 'Escape': {
        event.preventDefault()
        closeMenu()
        break
      }

      default:
        break
    }
  }

  return (
    <div
      ref={rootRef}
      className={clsx(styles.megaMenu, className)}
      onMouseEnter={keepOpen}
      onMouseLeave={scheduleClose}
    >
      <div ref={topbarRef} className={styles.topbar}>
        <nav aria-label="Primary navigation">
          <ul className={styles.rootList} role="menubar">
            {items.map((item, index) => {
              const Icon = item.icon
              const isActive = isOpen && activeId === item.id

              return (
                <li
                  key={item.id}
                  className={styles.rootItem}
                  role="none"
                  onMouseEnter={() => scheduleOpen(item.id)}
                >
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    aria-controls={`mega-panel-${item.id}`}
                    data-nav-trigger="true"
                    data-active={isActive ? 'true' : 'false'}
                    className={clsx(
                      styles.rootTrigger,
                      isActive && styles.rootTriggerActive
                    )}
                    onFocus={() => openMenu(item.id)}
                    onClick={() => {
                      if (isActive) {
                        closeMenu()
                        return
                      }

                      openMenu(item.id)
                    }}
                    onKeyDown={event =>
                      handleTriggerKeyDown(event, index, item.id)
                    }
                  >
                    {Icon ? (
                      <Icon size={16} className={styles.rootIcon} aria-hidden />
                    ) : null}

                    <span className={styles.rootLabel}>{item.label}</span>

                    <span className={styles.rootCaret} aria-hidden>
                      ▾
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {isOpen ? <div className={styles.backdrop} aria-hidden /> : null}

      <div
        className={clsx(
          styles.panelWrap,
          isOpen && activeItem && styles.panelWrapOpen
        )}
        role="presentation"
        onMouseEnter={keepOpen}
        onMouseLeave={scheduleClose}
      >
        {activeItem ? (
          <div
            ref={panelRef}
            id={`mega-panel-${activeItem.id}`}
            className={styles.panelSurface}
          >
            <MegaMenuPanel
              item={activeItem}
              onNavigate={() => {
                onNavigate?.()
                closeMenu()
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}