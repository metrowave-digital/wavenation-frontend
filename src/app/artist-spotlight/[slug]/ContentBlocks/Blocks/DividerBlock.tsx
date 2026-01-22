'use client'

import styles from './DividerBlock.module.css'

/* ======================================================
   Types (API-aligned)
====================================================== */

export interface DividerBlockData {
  blockType: 'divider'
}

/* ======================================================
   Props
====================================================== */

interface Props {
  block?: DividerBlockData
}

/* ======================================================
   Component
====================================================== */

export function DividerBlock() {
  return (
    <div className={styles.divider} role="separator" />
  )
}
