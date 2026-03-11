'use client'

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { X } from 'lucide-react'

import { HeaderContext } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import type { NavItem } from '../nav/nav.types'
import { MegaMenuPanel } from './MegaMenuPanel'
import styles from './MegaMenu.module.css'
import { trackEvent } from '@/lib/analytics'

const EXIT_MS = 260

function lockScroll() {
  const html = document.documentElement
  const body = document.body

  const prevHtmlOverflow = html.style.overflow
  const prevBodyOverflow = body.style.overflow
  const prevBodyPaddingRight = body.style.paddingRight

  const scrollbarWidth = window.innerWidth - html.clientWidth

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`
  }

  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'

  return () => {
    html.style.overflow = prevHtmlOverflow
    body.style.overflow = prevBodyOverflow
    body.style.paddingRight = prevBodyPaddingRight
  }
}

export function MegaMenu() {
  const { activeMenu, setActiveMenu } = useContext(HeaderContext)

  const [closing, setClosing] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const item = useMemo<NavItem | null>(() => {
    if (!activeMenu) return null
    return MAIN_NAV.find(nav => nav.id === activeMenu) ?? null
  }, [activeMenu])

  const isMounted = Boolean(activeMenu && item)
  const isVisible = Boolean(activeMenu && item) && !closing

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const finishClose = useCallback(() => {
    clearCloseTimer()
    setActiveMenu(null)
    setClosing(false)
  }, [clearCloseTimer, setActiveMenu])

  const requestClose = useCallback(
    (reason: string) => {
      if (!activeMenu || closing) return

      trackEvent('navigation_click', {
        component: 'mega_menu',
        action: 'close',
        reason,
        section: activeMenu,
      })

      setClosing(true)

      clearCloseTimer()
      closeTimerRef.current = window.setTimeout(() => {
        finishClose()
      }, EXIT_MS)
    },
    [activeMenu, clearCloseTimer, closing, finishClose]
  )

  useEffect(() => {
    return () => clearCloseTimer()
  }, [clearCloseTimer])

  useEffect(() => {
    if (!isVisible) return
    const unlock = lockScroll()
    return unlock
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose('escape')
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isVisible, requestClose])

  useEffect(() => {
    if (!isVisible || !item) return

    trackEvent('content_impression', {
      component: 'mega_menu',
      section: item.id,
      label: item.label,
    })
  }, [isVisible, item])

  useEffect(() => {
    if (!isVisible) return
    panelRef.current?.focus()
  }, [isVisible, item?.id])

  if (!isMounted || !item) return null

  return (
    <div
      className={[
        styles.overlay,
        isVisible ? styles.overlayOpen : styles.overlayExit,
      ].join(' ')}
      aria-hidden={!isVisible}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={() => requestClose('backdrop')}
        aria-label="Close mega menu"
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        className={[
          styles.container,
          isVisible ? styles.containerOpen : styles.containerExit,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.label} menu`}
        tabIndex={-1}
      >
        <div className={styles.sheet}>
          <div className={styles.topbar}>
            <div className={styles.topbarMeta}>
              <span className={styles.topbarEyebrow}>Explore</span>
              <span className={styles.topbarSlash}>/</span>
              <span className={styles.topbarSection}>{item.label}</span>
            </div>

            <button
              type="button"
              className={styles.close}
              onClick={() => requestClose('x')}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <MegaMenuPanel
            item={item}
            onNavigate={() => requestClose('navigate')}
          />
        </div>
      </div>
    </div>
  )
}