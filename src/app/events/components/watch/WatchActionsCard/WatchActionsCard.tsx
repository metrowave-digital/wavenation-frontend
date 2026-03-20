'use client'

import { useState } from 'react'
import styles from './WatchActionsCard.module.css'

type WatchActionsCardProps = {
  ctaLabel?: string | null
  ctaUrl?: string | null
  eventbriteUrl?: string | null
}

export function WatchActionsCard({
  ctaLabel,
  ctaUrl,
  eventbriteUrl,
}: WatchActionsCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Event Links</h3>

      <div className={styles.actions}>
        {ctaUrl ? (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.primaryButton}
          >
            {ctaLabel || 'Open event'}
          </a>
        ) : null}

        {eventbriteUrl ? (
          <a
            href={eventbriteUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
          >
            View on Eventbrite
          </a>
        ) : null}

        <button
          type="button"
          onClick={handleCopy}
          className={styles.ghostButton}
        >
          {copied ? 'Link copied' : 'Copy watch link'}
        </button>
      </div>
    </section>
  )
}