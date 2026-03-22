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

const OPEN_DELAY_MS = 60
const CLOSE_DELAY_MS = 120

export function MegaMenu({
  items,
  className,
  onNavigate,
}: Props) {
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

  function getTriggerElements() {
    return Array.from(
      topbarRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-nav-trigger="true"]'
      ) ?? []
    )
  }

  function focusTriggerByIndex(index: number) {
    const triggers = getTriggerElements()
    if (!triggers.length) return

    const safeIndex =
      ((index % triggers.length) + triggers.length) % triggers.length

    triggers[safeIndex]?.focus()
  }

  function focusFirstPanelElement() {
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    window.setTimeout(() => {
      firstFocusable?.focus()
    }, 0)
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

      const currentActiveId = activeId
      closeMenu()

      if (currentActiveId) {
        const trigger = topbarRef.current?.querySelector<HTMLElement>(
          `[data-nav-trigger="true"][data-id="${currentActiveId}"]`
        )
        trigger?.focus()
      }
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
  }, [activeId])

  function handleTriggerKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    id: MainNavItem['id']
  ) {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault()

        if (isOpen && activeId === id) {
          closeMenu()
          return
        }

        openMenu(id)
        focusFirstPanelElement()
        break
      }

      case 'ArrowDown': {
        event.preventDefault()
        openMenu(id)
        focusFirstPanelElement()
        break
      }

      case 'ArrowRight': {
        event.preventDefault()
        const nextIndex = (index + 1) % items.length
        focusTriggerByIndex(nextIndex)
        scheduleOpen(items[nextIndex].id)
        break
      }

      case 'ArrowLeft': {
        event.preventDefault()
        const prevIndex = (index - 1 + items.length) % items.length
        focusTriggerByIndex(prevIndex)
        scheduleOpen(items[prevIndex].id)
        break
      }

      case 'Home': {
        event.preventDefault()
        focusTriggerByIndex(0)
        scheduleOpen(items[0].id)
        break
      }

      case 'End': {
        event.preventDefault()
        const lastIndex = items.length - 1
        focusTriggerByIndex(lastIndex)
        scheduleOpen(items[lastIndex].id)
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

  if (!items.length) return null

  return (
    <div
      ref={rootRef}
      className={clsx(
        styles.megaMenu,
        isOpen && styles.megaMenuOpen,
        className
      )}
      data-open={isOpen ? 'true' : 'false'}
      onMouseEnter={keepOpen}
      onMouseLeave={scheduleClose}
    >
      <div ref={topbarRef} className={styles.topbar}>
        <nav aria-label="Primary navigation">
          <ul className={styles.rootList} role="menubar">
            {items.map((item, index) => {
              const Icon = item.icon
              const isActive = isOpen && activeId === item.id
              const panelId = `mega-panel-${item.id}`
              const triggerId = `mega-trigger-${item.id}`

              return (
                <li
                  key={item.id}
                  className={styles.rootItem}
                  role="none"
                  onMouseEnter={() => scheduleOpen(item.id)}
                >
                  <button
                    id={triggerId}
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    data-nav-trigger="true"
                    data-id={item.id}
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
                      <Icon
                        size={15}
                        className={styles.rootIcon}
                        aria-hidden="true"
                      />
                    ) : null}

                    <span className={styles.rootLabel}>{item.label}</span>

                    <span className={styles.rootCaret} aria-hidden="true">
                      ▾
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {isOpen ? <div className={styles.backdrop} aria-hidden="true" /> : null}

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
            role="region"
            aria-labelledby={`mega-trigger-${activeItem.id}`}
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