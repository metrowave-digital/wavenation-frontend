import type { RefObject } from 'react'
import { Menu, ArrowLeft } from 'lucide-react'
import styles from './MobileMenuHeader.module.css'

interface MobileMenuHeaderProps {
  canGoBack: boolean
  onBack: () => void
  onClose: () => void
  closeButtonRef?: RefObject<HTMLButtonElement | null>
}

export function MobileMenuHeader({
  canGoBack,
  onBack,
  onClose,
  closeButtonRef,
}: MobileMenuHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {canGoBack ? (
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className={styles.backIcon} aria-hidden />
            <span className={styles.backText}>Back</span>
          </button>
        ) : (
          <div className={styles.brandBlock}>
            <span className={styles.brandEyebrow}>WaveNation</span>
            <div className={styles.brandRow}>
              <Menu className={styles.brandIcon} aria-hidden />
              <span className={styles.brandTitle}>Menu</span>
            </div>
          </div>
        )}
      </div>

      <button
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>
    </header>
  )
}