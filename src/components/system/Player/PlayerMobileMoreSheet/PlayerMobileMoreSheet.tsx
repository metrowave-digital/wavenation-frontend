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
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
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
        <Icon className={styles.actionIcon} aria-hidden />
      </span>

      <span className={styles.actionBody}>
        <span className={styles.actionText}>{label}</span>
        {description ? (
          <span className={styles.actionDescription}>{description}</span>
        ) : null}
      </span>

      <ChevronRight className={styles.actionChevron} aria-hidden />
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
        <div className={styles.glow} aria-hidden />
        <div className={styles.noise} aria-hidden />

        <div className={styles.handleWrap}>
          <div className={styles.handle} aria-hidden />
        </div>

        <div className={styles.header}>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>WaveNation</p>
            <h2 className={styles.title}>Player options</h2>
            <p className={styles.subtitle}>
              Quick access to playback, queue, streams, and account tools.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close sheet"
          >
            <X className={styles.closeIcon} aria-hidden />
          </button>
        </div>

        <div className={styles.menu}>
          <ActionButton
            icon={Expand}
            label="Open full player"
            description="View the expanded player experience"
            onClick={() => {
              onClose()
              onOpenPlayer()
            }}
          />

          <ActionButton
            icon={ListMusic}
            label="Queue & upcoming"
            description="See what is playing next"
            onClick={() => {
              console.log('open queue')
              onClose()
            }}
          />

          <ActionButton
            icon={Radio}
            label="Stations & streams"
            description="Switch between available streams"
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
              <User className={styles.actionIcon} aria-hidden />
            </span>

            <span className={styles.actionBody}>
              <span className={styles.actionText}>Profile</span>
              <span className={styles.actionDescription}>
                Manage your account and listening preferences
              </span>
            </span>

            <ChevronRight className={styles.actionChevron} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}