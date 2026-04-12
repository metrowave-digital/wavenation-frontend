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
export type HeaderPopup = 'search' | 'profile' | 'notification' | null

export interface HeaderState {
  compact: boolean
  activeMenu: string | null
  setActiveMenu: (id: string | null) => void
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  popup: HeaderPopup
  setPopup: (p: HeaderPopup) => void
  isSearchOpen: boolean
  isProfileOpen: boolean
  isNotificationOpen: boolean
}

/* ======================================================
   Context & Hook
====================================================== */
const HeaderContext = createContext<HeaderState | null>(null)

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
export function HeaderProvider({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [popup, setPopup] = useState<HeaderPopup>(null)

  const isSearchOpen = popup === 'search'
  const isProfileOpen = popup === 'profile'
  const isNotificationOpen = popup === 'notification'

  // Scroll → Compact Header
  useEffect(() => {
    const onScroll = () => {
      const isCompact = window.scrollY > 64
      setCompact(isCompact)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when overlays open
  useEffect(() => {
    const shouldLock = isMobileMenuOpen || popup !== null

    if (shouldLock) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px` // Prevents layout shift
      document.body.style.touchAction = 'none' // Mobile scroll lock
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.body.style.touchAction = ''
    }
  }, [isMobileMenuOpen, popup])

  // Close on Escape & Resize
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null)
        setPopup(null)
        setMobileMenuOpen(false)
      }
    }
    const onResize = () => {
      if (window.innerWidth > 1024) setMobileMenuOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const value = useMemo(() => ({
    compact,
    activeMenu,
    setActiveMenu,
    isMobileMenuOpen,
    setMobileMenuOpen,
    popup,
    setPopup,
    isSearchOpen,
    isProfileOpen,
    isNotificationOpen,
  }), [compact, activeMenu, isMobileMenuOpen, popup, isSearchOpen, isProfileOpen, isNotificationOpen])

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
}