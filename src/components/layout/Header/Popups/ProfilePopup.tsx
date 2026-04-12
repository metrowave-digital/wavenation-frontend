'use client'

import { useEffect, useRef } from 'react'
import { X, User, Settings, CreditCard, Bookmark, LogOut, Sparkles } from 'lucide-react'
import { useHeader } from '../Header.context'
import styles from './ProfilePopup.module.css'
import Link from 'next/link'

export function ProfilePopup() {
  const { popup, setPopup, isProfileOpen } = useHeader()
  const panelRef = useRef<HTMLDivElement | null>(null)

  /* ---------------------------------------------
     Close on ESC
  ---------------------------------------------- */
  useEffect(() => {
    if (!isProfileOpen) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPopup(null)
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isProfileOpen, setPopup])

  if (!isProfileOpen) return null

  const closeMenu = () => setPopup(null)

  return (
    <div
      className={styles.overlay}
      onClick={closeMenu}
      role="dialog"
      aria-modal="true"
      aria-label="Profile menu"
    >
      <div
        ref={panelRef}
        className={styles.panel}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.brandText}>ACCOUNT</span>
          <button
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Close profile menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* USER IDENTIFIER */}
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <User size={28} />
          </div>
          <div className={styles.userInfo}>
            <h3 className={styles.title}>Welcome Back</h3>
            <p className={styles.subtitle}>Sign in to access benefits</p>
          </div>
        </div>

        {/* PROMO / PREMIUM TIER */}
        <div className={styles.premiumPromo}>
          <Sparkles size={16} className={styles.promoIcon} />
          <div className={styles.promoText}>
            <span className={styles.promoTitle}>WaveNation+</span>
            <span className={styles.promoDesc}>Unlock ad-free streaming & exclusive drops.</span>
          </div>
        </div>

        {/* NAVIGATION ACTIONS */}
        <div className={styles.actionList}>
          <Link href="/account" className={styles.actionItem} onClick={closeMenu}>
            <Settings size={18} className={styles.actionIcon} />
            Account Settings
          </Link>
          <Link href="/subscriptions" className={styles.actionItem} onClick={closeMenu}>
            <CreditCard size={18} className={styles.actionIcon} />
            Subscriptions
          </Link>
          <Link href="/saved" className={styles.actionItem} onClick={closeMenu}>
            <Bookmark size={18} className={styles.actionIcon} />
            Saved & Watchlist
          </Link>
        </div>

        {/* FOOTER ACTION */}
        <div className={styles.footer}>
          <button className={styles.signOutBtn} onClick={closeMenu}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}