'use client'

import Link from 'next/link'
import {
  X,
  User,
  ListMusic,
  Expand,
  Radio,
  ChevronRight,
} from 'lucide-react'
import styles from './PlayerMobileMoreSheet.module.css'

type PlayerMobileMoreSheetProps = {
  open: boolean
  onClose: () => void
  onOpenPlayer: () => void
}

type ActionButtonProps = {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean; size?: number }>
  label: string
  description?: string
  onClick: () => void
}

function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
}: ActionButtonProps) {
  return (
    <button type="button" className={styles.action} onClick={onClick}>
      <span className={styles.actionIconWrap}>
        <Icon size={20} className={styles.actionIcon} aria-hidden />
      </span>

      <span className={styles.actionBody}>
        <span className={styles.actionText}>{label}</span>
        {description && (
          <span className={styles.actionDescription}>{description}</span>
        )}
      </span>

      <ChevronRight size={18} className={styles.actionChevron} aria-hidden />
    </button>
  )
}

export function PlayerMobileMoreSheet({
  open,
  onClose,
  onOpenPlayer,
}: PlayerMobileMoreSheetProps) {
  if (!open) return null

  return (
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-label="More player options"
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close more options"
      />

      <div className={styles.sheet}>
        <div className={styles.handleWrap}>
          <div className={styles.handle} aria-hidden />
        </div>

        <div className={styles.header}>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>WAVENATION LIVE</p>
            <h2 className={styles.title}>Player Options</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close sheet"
          >
            <X size={24} className={styles.closeIcon} aria-hidden />
          </button>
        </div>

        <div className={styles.menu}>
          <ActionButton
            icon={Expand}
            label="Open Full Player"
            description="View the expanded broadcast experience"
            onClick={() => {
              onClose()
              onOpenPlayer()
            }}
          />

          <ActionButton
            icon={ListMusic}
            label="Queue & Up Next"
            description="See the daily schedule and next tracks"
            onClick={() => {
              console.log('open queue')
              onClose()
            }}
          />

          <ActionButton
            icon={Radio}
            label="Stations & Streams"
            description="Switch between available broadcast streams"
            onClick={() => {
              console.log('open station selector')
              onClose()
            }}
          />

          <Link
            href="/profile"
            className={styles.actionLink}
            onClick={onClose}
          >
            <span className={styles.actionIconWrap}>
              <User size={20} className={styles.actionIcon} aria-hidden />
            </span>

            <span className={styles.actionBody}>
              <span className={styles.actionText}>Your Profile</span>
              <span className={styles.actionDescription}>
                Manage your account and settings
              </span>
            </span>

            <ChevronRight size={18} className={styles.actionChevron} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}