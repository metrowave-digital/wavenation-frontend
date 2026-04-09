'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'

/* ======================================================
   Types
====================================================== */

// 1. Added 'notification' to the allowable popups
export type HeaderPopup = 'search' | 'profile' | 'notification' | null

export interface HeaderState {
  compact: boolean

  activeMenu: string | null
  setActiveMenu: (id: string | null) => void

  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  popup: HeaderPopup
  setPopup: (p: HeaderPopup) => void

  /* Derived helpers (cleaner for components) */
  isSearchOpen: boolean
  isProfileOpen: boolean
  isNotificationOpen: boolean // 2. Added to state interface
}

/* ======================================================
   Context
====================================================== */

// RESTORED: This line was missing from your snippet!
const HeaderContext = createContext<HeaderState | null>(null)

/* ======================================================
   Hook (IMPORTANT)
====================================================== */

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within HeaderProvider')
  }
  return context
}

/* ======================================================
   Provider
====================================================== */

interface HeaderProviderProps {
  children: ReactNode
}

export function HeaderProvider({ children }: HeaderProviderProps) {
  const [compact, setCompact] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [popup, setPopup] = useState<HeaderPopup>(null)

  /* ---------------------------------------------
     Derived State
  ---------------------------------------------- */
  const isSearchOpen = popup === 'search'
  const isProfileOpen = popup === 'profile'
  const isNotificationOpen = popup === 'notification' // 3. Added derived variable

  /* ---------------------------------------------
     Scroll → Compact Header
  ---------------------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const isCompact = window.scrollY > 64
      setCompact(isCompact)
      document.body.classList.toggle('header--compact', isCompact)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('header--compact')
    }
  }, [])

  /* ---------------------------------------------
     Lock body scroll when overlays open
  ---------------------------------------------- */
  useEffect(() => {
    const shouldLock =
      isMobileMenuOpen || popup !== null

    document.body.style.overflow = shouldLock ? 'hidden' : 'unset'
  }, [isMobileMenuOpen, popup])

  /* ---------------------------------------------
     Close menus on Escape
  ---------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null)
        setPopup(null)
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* ---------------------------------------------
     Auto-close mobile menu on resize
  ---------------------------------------------- */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ---------------------------------------------
     Memoized Context Value
  ---------------------------------------------- */
  const value = useMemo<HeaderState>(
    () => ({
      compact,

      activeMenu,
      setActiveMenu,

      isMobileMenuOpen,
      setMobileMenuOpen,

      popup,
      setPopup,

      isSearchOpen,
      isProfileOpen,
      isNotificationOpen, // 4. Exposed in the provider
    }),
    [
      compact,
      activeMenu,
      isMobileMenuOpen,
      popup,
      isSearchOpen,
      isProfileOpen,
      isNotificationOpen, // 5. Added to dependencies
    ]
  )

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  )
}