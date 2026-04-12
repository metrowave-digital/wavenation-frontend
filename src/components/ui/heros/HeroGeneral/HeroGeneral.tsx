import React from 'react'
import { Cpu } from 'lucide-react'
import styles from './HeroGeneral.module.css'

export interface HeroGeneralProps {
  title: string
  kicker?: string
  subtitle?: string
  accentColor?: string // Allows overrides per page (e.g., Red for Privacy, Cyan for About)
}

export function HeroGeneral({
  title,
  kicker = 'SYSTEM_CORE // INFORMATION',
  subtitle,
  accentColor = '#39FF14' // Neon Green Default
}: HeroGeneralProps) {
  return (
    <header className={styles.root}>
      {/* Background Texture Overlay */}
      <div className={styles.gridOverlay} aria-hidden="true" />
      
      <div className={styles.container}>
        <div className={styles.sysRow} style={{ borderBottomColor: `rgba(${accentColor === '#39FF14' ? '57, 255, 20' : '255, 255, 255'}, 0.1)` }}>
          <span className={styles.sysLabel}>
            <Cpu size={12} className={styles.sysIcon} style={{ color: accentColor }} />
            WN.SYSTEM {'//'} {kicker.toUpperCase()}
          </span>
          <span className={styles.statusBlink}>ACQUIRED</span>
        </div>

        <h1 className={styles.title}>{title}</h1>
        
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </div>
    </header>
  )
}