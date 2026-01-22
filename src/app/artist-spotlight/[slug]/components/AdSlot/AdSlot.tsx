'use client'

import { useEffect, useRef } from 'react'
import styles from './AdSlot.module.css'

/* ======================================================
   Global Type Augmentation (NO any)
====================================================== */

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/* ======================================================
   Props
====================================================== */

interface Props {
  /**
   * Google AdSense slot ID
   * Example: "1234567890"
   */
  slot: string

  /**
   * Ad format (responsive recommended)
   */
  format?: 'auto' | 'fluid' | string

  /**
   * Disclosure label
   */
  label?: string

  /**
   * Optional custom class
   */
  className?: string
}

/* ======================================================
   Component
====================================================== */

export function AdSlot({
  slot,
  format = 'auto',
  label = 'Advertisement',
  className,
}: Props) {
  const adRef = useRef<HTMLModElement | null>(null)

  /* --------------------------------------------------
     Safely request AdSense render
  -------------------------------------------------- */
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.adsbygoogle ||
      !adRef.current
    ) {
      return
    }

    try {
      window.adsbygoogle.push({})
    } catch {
      // AdSense may throw in dev or with ad blockers
    }
  }, [])

  return (
    <aside
      className={`${styles.ad} ${className ?? ''}`}
      aria-label={label}
    >
      <span className={styles.label}>
        {label}
      </span>

      <div className={styles.container}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  )
}
