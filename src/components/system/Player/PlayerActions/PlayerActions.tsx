'use client'

import { useState } from 'react'
import clsx from 'clsx'
import styles from './PlayerActions.module.css'
import { Maximize2, Share2, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface PlayerActionsProps {
  placement?: 'sticky_player' | 'fullscreen_player'
  onExpand?: () => void
}

const SHARE_RESET_MS = 2200

export function PlayerActions({
  placement = 'sticky_player',
  onExpand,
}: PlayerActionsProps) {
  const [copied, setCopied] = useState(false)

  function handleExpand() {
    trackEvent('hero_interaction', {
      action: 'player_expand',
      placement,
    })

    onExpand?.()
  }

  async function handleShare() {
    const shareUrl =
      typeof window !== 'undefined' ? window.location.href : ''
    const shareTitle = 'WaveNation'
    const shareText = 'Listening on WaveNation'

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })

        trackEvent('content_click', {
          action: 'player_share',
          placement,
          method: 'native_share',
        })

        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)

        window.setTimeout(() => {
          setCopied(false)
        }, SHARE_RESET_MS)

        trackEvent('content_click', {
          action: 'player_share',
          placement,
          method: 'clipboard',
        })

        return
      }

      trackEvent('content_click', {
        action: 'player_share',
        placement,
        method: 'unsupported',
      })
    } catch {
      trackEvent('content_click', {
        action: 'player_share',
        placement,
        method: 'error',
      })
    }
  }

  return (
    <div
      className={clsx(
        styles.actions,
        placement === 'fullscreen_player' && styles.isFullscreen
      )}
      role="group"
      aria-label="Player actions"
    >
      <button
        type="button"
        className={clsx(styles.actionButton, styles.expandButton)}
        aria-label="Expand player"
        onClick={handleExpand}
      >
        <span className={styles.buttonGlow} aria-hidden="true" />
        <span className={styles.buttonIcon} aria-hidden="true">
          <Maximize2 size={18} />
        </span>
        <span className={styles.buttonLabel}>Expand</span>
      </button>

      <button
        type="button"
        className={clsx(
          styles.actionButton,
          styles.shareButton,
          copied && styles.isCopied
        )}
        aria-label={copied ? 'Link copied' : 'Share player'}
        onClick={handleShare}
      >
        <span className={styles.buttonGlow} aria-hidden="true" />
        <span className={styles.buttonIcon} aria-hidden="true">
          {copied ? <Check size={18} /> : <Share2 size={18} />}
        </span>
        <span className={styles.buttonLabel}>
          {copied ? 'Copied' : 'Share'}
        </span>
      </button>
    </div>
  )
}