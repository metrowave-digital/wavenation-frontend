'use client'

import { Menu, X } from 'lucide-react'
import styles from './MobileMenuToggle.module.css'
import { useHeader } from '../Header.context'

export function MobileMenuToggle() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useHeader()

  return (
    <button
      className={styles.button}
      onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
    >
      {isMobileMenuOpen ? (
        <X className={styles.icon} />
      ) : (
        <Menu className={styles.icon} />
      )}
    </button>
  )
}