'use client'

import styles from './HeaderMeta.module.css'

export function HeaderMeta() {
  return (
    <div className={styles.root}>
      {/* Metadata - Hidden on mobile, visible on desktop */}
      <div className={styles.infoGroup}>
        <span className={styles.label}>
          Market: <span className={styles.value}>Atlanta</span>
        </span>
        <span className={styles.label}>
          Temp: <span className={styles.value}>78°F</span>
        </span>
      </div>

      {/* Call to Action */}
      <button type="button" className={styles.button}>
        Join Hub
      </button>
    </div>
  )
}