'use client'

import styles from './PullQuoteBlock.module.css'

/* ======================================================
   Types (API-aligned)
====================================================== */

export interface PullQuoteBlockData {
  blockType: 'pullQuote'
  quote: string
  attribution?: string
}

/* ======================================================
   Props
====================================================== */

interface Props {
  block: PullQuoteBlockData
}

/* ======================================================
   Component
====================================================== */

export function PullQuoteBlock({ block }: Props) {
  if (!block?.quote) return null

  return (
    <aside className={styles.pullQuote} aria-label="Pull quote">
      <blockquote className={styles.quote}>
        <span className={styles.mark}>“</span>
        {block.quote}
        <span className={styles.mark}>”</span>
      </blockquote>

      {block.attribution && (
        <cite className={styles.attribution}>
          — {block.attribution}
        </cite>
      )}
    </aside>
  )
}
