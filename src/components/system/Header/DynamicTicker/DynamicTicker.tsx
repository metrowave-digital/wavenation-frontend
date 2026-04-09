'use client'

import React, { useState, useEffect } from 'react'
import { Radio, Monitor, Zap } from 'lucide-react'
import styles from './DynamicTicker.module.css'

const LIVE_DATA = [
  {
    id: 'fm-1',
    medium: 'FM',
    status: 'NOW PLAYING',
    title: 'THE SOUTHERN BEAT',
    subtext: 'WITH DJ K-FLOW',
    accent: '#39FF14' // Matching the neon green from HeaderMeta
  },
  {
    id: 'one-1',
    medium: 'ONE',
    status: 'LIVE PREMIERE',
    title: 'ATL: THE NEW HOLLYWOOD',
    subtext: 'WAVENATION ORIGINAL',
    accent: '#FF00FF' // Magenta pulse
  },
  {
    id: 'plus-1',
    medium: 'PLUS',
    status: 'UP NEXT',
    title: 'THE UNHEARD SOUTH',
    subtext: 'STARTS AT 9:00 PM',
    accent: '#00FFFF' // Electric Blue
  }
]

export function DynamicTicker() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'in' | 'out'>('in')

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('out')

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LIVE_DATA.length)
        setDirection('in')
      }, 400)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const current = LIVE_DATA[index]

  return (
    <div className={styles.container}>
      {/* Accent border trace */}
      <div
        className={styles.accentTrace}
        style={{ backgroundColor: current.accent }}
      />

      {/* Main Content */}
      <div
        key={current.id}
        className={`${styles.content} ${
          direction === 'in' ? styles.enter : styles.exit
        }`}
      >
        {/* Status Badge */}
        <div
          className={styles.statusBadge}
          style={{ color: current.accent }}
        >
          <Zap size={10} className={styles.icon} />
          <span>{current.status}</span>
        </div>

        {/* Medium Indicator */}
        <div className={styles.mediumTag}>
          {current.medium === 'FM' && <Radio size={10} />}
          {current.medium === 'ONE' && <Monitor size={10} />}
          <span>WN {current.medium}</span>
        </div>

        {/* Details Area */}
        <div className={styles.details}>
          <span className={styles.title}>{current.title}</span>
          <span className={styles.separator}>{'//'}</span>
          <span className={styles.subtext}>{current.subtext}</span>
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className={styles.visualizer}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={styles.waveBar}
            style={{
              backgroundColor: current.accent,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}