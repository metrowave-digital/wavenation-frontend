'use client'

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

import { HeaderContext } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import type { MainNavItem, NavItem } from '../nav/nav.types'
import { hasChildren } from '../nav/nav.types'
import { trackEvent } from '@/lib/analytics'

import { MobileMenuHeader } from './MobileMenuHeader'
import { MobileMenuContextBar } from './MobileMenuContextBar'
import { MobileMenuFeatured } from './MobileMenuFeatured'
import { MobileMenuList } from './MobileMenuList'
import { MobileMenuFooter } from './MobileMenuFooter'
import {
  findPathStack,
  getFeaturedActions,
  getRootSections,
  type MobileMenuLevel,
} from './mobileMenu.utils'

import styles from './MobileMenu.module.css'

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_IN = [0.4, 0, 1, 1] as const

const panelVariants: Variants = {
  hidden: { x: '100%', opacity: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.42,
      ease: EASE_OUT,
    },
  },
  exit: {
    x: '100%',
    opacity: 0.92,
    transition: {
      duration: 0.28,
      ease: EASE_IN,
    },
  },
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18 },
  },
}

const levelVariants: Variants = {
  initial: { opacity: 0, x: 22, scale: 0.985 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: EASE_OUT,
      staggerChildren: 0.035,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    scale: 0.99,
    transition: {
      duration: 0.18,
      ease: EASE_IN,
    },
  },
}

type MenuSessionState = {
  drillStack: MobileMenuLevel[]
  forceRoot: boolean
}

const INITIAL_SESSION_STATE: MenuSessionState = {
  drillStack: [],
  forceRoot: false,
}

export function MobileMenu() {
  const { mobileOpen, setMobileOpen } = useContext(HeaderContext)

  const pathname = usePathname()
  const startX = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const baseStack = useMemo(() => {
    return findPathStack(MAIN_NAV as MainNavItem[], pathname) ?? []
  }, [pathname])

  const [session, setSession] = useState<MenuSessionState>(INITIAL_SESSION_STATE)

  const stack = useMemo(() => {
    if (session.forceRoot) return session.drillStack
    return [...baseStack, ...session.drillStack]
  }, [baseStack, session])

  const currentLevel =
    stack[stack.length - 1] ?? getRootSections(MAIN_NAV as MainNavItem[])

  const canGoBack = stack.length > 0
  const isRootLevel = stack.length === 0

  const featuredActions = useMemo(
    () => getFeaturedActions(isRootLevel),
    [isRootLevel]
  )

  const breadcrumbs = useMemo(() => {
    const root = ['Browse']
    const labels = stack.map(level => level.label)
    return [...root, ...labels]
  }, [stack])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => closeButtonRef.current?.focus())

    trackEvent('navigation_open', {
      component: 'mobile_menu',
      pathname,
      section: currentLevel.label,
    })

    return () => {
      previousFocusRef.current?.focus?.()
    }
  }, [mobileOpen, pathname, currentLevel.label])

  const closeMenu = useCallback(
    (reason: 'button' | 'overlay' | 'swipe' | 'link' = 'button') => {
      trackEvent('navigation_close', {
        component: 'mobile_menu',
        action: reason,
        section: currentLevel.label,
      })

      setSession(INITIAL_SESSION_STATE)
      setMobileOpen(false)
    },
    [currentLevel.label, setMobileOpen]
  )

  const openChildLevel = useCallback(
    (item: NavItem) => {
      if (!hasChildren(item)) return

      trackEvent('navigation_click', {
        component: 'mobile_menu',
        section: currentLevel.label,
        label: item.label,
        href: 'nested-menu',
      })

      setSession(prev => ({
        ...prev,
        drillStack: [
          ...prev.drillStack,
          {
            label: item.label,
            items: item.children,
            parentLabel: currentLevel.label,
          },
        ],
      }))
    },
    [currentLevel.label]
  )

  const goBack = useCallback(
    (reason: 'button' | 'swipe' | 'escape' = 'button') => {
      if (session.drillStack.length > 0) {
        trackEvent('navigation_back', {
          component: 'mobile_menu',
          action: reason,
          level: currentLevel.label,
          depth: stack.length,
        })

        setSession(prev => ({
          ...prev,
          drillStack: prev.drillStack.slice(0, -1),
        }))
        return
      }

      if (!session.forceRoot && baseStack.length > 0) {
        trackEvent('navigation_back', {
          component: 'mobile_menu',
          action: reason,
          level: currentLevel.label,
          depth: stack.length,
        })

        setSession(prev => ({
          ...prev,
          forceRoot: true,
        }))
        return
      }

      closeMenu(reason === 'button' ? 'button' : 'swipe')
    },
    [
      baseStack.length,
      closeMenu,
      currentLevel.label,
      session.drillStack.length,
      session.forceRoot,
      stack.length,
    ]
  )

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    startX.current = e.touches[0]?.clientX ?? null
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (startX.current === null) return

    const endX = e.changedTouches[0]?.clientX ?? startX.current
    const delta = endX - startX.current

    if (delta > 90) {
      if (canGoBack) {
        goBack('swipe')
      } else {
        closeMenu('swipe')
      }
    }

    startX.current = null
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      closeMenu('overlay')
    }
  }

  useEffect(() => {
    if (!mobileOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (canGoBack) {
          goBack('escape')
        } else {
          closeMenu('button')
        }
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )

      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, canGoBack, closeMenu, goBack])

  if (!mobileOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleOverlayClick}
      >
        <div className={styles.backdropGlow} aria-hidden />
        <div className={styles.backdropNoise} aria-hidden />

        <motion.div
          ref={panelRef}
          className={styles.panel}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.panelInner}>
            <MobileMenuHeader
              canGoBack={canGoBack}
              onBack={() => goBack('button')}
              onClose={() => closeMenu('button')}
              closeButtonRef={closeButtonRef}
            />

            <MobileMenuContextBar
              currentLabel={currentLevel.label}
              parentLabel={currentLevel.parentLabel}
              breadcrumbs={breadcrumbs}
              depth={stack.length + 1}
              canGoBack={canGoBack}
            />

            <div className={styles.scrollRegion}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLevel.label}
                  className={styles.level}
                  variants={levelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {isRootLevel ? (
                    <MobileMenuFeatured actions={featuredActions} />
                  ) : null}

                  <MobileMenuList
                    sectionLabel={currentLevel.label}
                    items={currentLevel.items}
                    pathname={pathname}
                    onOpenChild={openChildLevel}
                    onNavigate={() => closeMenu('link')}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <MobileMenuFooter />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}