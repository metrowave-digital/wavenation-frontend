'use client'

import { Search, User, ShoppingBag, Menu } from 'lucide-react'
import { useContext } from 'react'
import { HeaderContext } from '../Header.context'
import styles from './HeaderActions.module.css'

export function HeaderActions() {
  const { setPopup, setMobileOpen } = useContext(HeaderContext)

  return (
    <div className={styles.actions}>
      <button
        type="button"
        aria-label="Search"
        className={styles.action}
        onClick={() => setPopup('search')}
      >
        <Search />
      </button>

      <button
        type="button"
        aria-label="Profile"
        className={styles.action}
        onClick={() => setPopup('profile')}
      >
        <User />
      </button>

      <a
        href="/shop"
        aria-label="Shop"
        className={styles.action}
      >
        <ShoppingBag />
        {/* Future badge support */}
        {/* <span className={styles.badge}>2</span> */}
      </a>

      {/* Mobile menu toggle */}
      <button
        type="button"
        aria-label="Open menu"
        className={`${styles.action} ${styles.mobileOnly}`}
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </button>
    </div>
  )
}