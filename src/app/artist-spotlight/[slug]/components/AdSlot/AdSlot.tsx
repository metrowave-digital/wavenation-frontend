'use client'

import { useEffect, useRef } from 'react'
import styles from './AdSlot.module.css'

/* ======================================================
   Global Type Augmentation
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
   * Example: "5783687323"
   */
  slot: string

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
  label = 'Advertisement',
  className,
}: Props) {
  const adRef = useRef<HTMLModElement | null>(null)
  const hasRequested = useRef(false)

  /* --------------------------------------------------
     Request AdSense render (safe + idempotent)
  -------------------------------------------------- */
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.adsbygoogle ||
      !adRef.current ||
      hasRequested.current
    ) {
      return
    }

    try {
      window.adsbygoogle.push({})
      hasRequested.current = true
    } catch {
      // Ad blockers / dev mode can throw — safe to ignore
    }
  }, [])

  return (
    <aside
      className={`${styles.ad} ${className ?? ''}`}
      aria-label={label}
    >
      <span className={styles.label}>{label}</span>

      <div className={styles.container}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-6631983121456407"
          data-ad-slot={slot}
        />
      </div>
    </aside>
  )
}
