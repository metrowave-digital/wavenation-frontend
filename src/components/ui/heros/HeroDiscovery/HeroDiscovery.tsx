'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Sparkles, Music4, TrendingUp, Users, Activity, Globe, Cpu, Play } from 'lucide-react'
import styles from './HeroDiscovery.module.css'

type Category = 'playlists' | 'charts' | 'creators'

const HUB_DATA = {
  playlists: {
    title: 'THE HITLIST 20',
    eyebrow: 'FLAGSHIP CURATION',
    description: 'The definitive sound of right now. High-rotation anthems and cultural shifts.',
    artwork: '/images/playlists/hitlist-20.jpg',
    metric1: { label: 'TRACKS', value: '20' },
    metric2: { label: 'VIBE', value: 'PEAK' },
    accent: '#38bdf8'
  },
  charts: {
    title: 'SOUTHERN SOUL',
    eyebrow: 'TRENDING ALGORITHM',
    description: 'Real-time telemetry on the records catching fire across the Southern grid.',
    artwork: '/images/charts/southern-soul.jpg',
    metric1: { label: 'VELOCITY', value: '+84%' },
    metric2: { label: 'UPDATED', value: 'LIVE' },
    accent: '#FF00FF'
  },
  creators: {
    title: 'JOIN THE NETWORK',
    eyebrow: 'CREATOR SYNDICATE',
    description: 'Upload your signal. The ecosystem built for DJs, curators, and artists.',
    artwork: '/images/creators/join-now.jpg',
    metric1: { label: 'CREATORS', value: '12.4K' },
    metric2: { label: 'STATUS', value: 'OPEN' },
    accent: '#39FF14'
  },
}

export function HeroDiscovery() {
  const [active, setActive] = useState<Category>('playlists')

  const current = HUB_DATA[active]

  return (
    <section className={styles.root}>
      {/* =========================================
          BACKGROUND & FX
      ========================================= */}
      <div className={styles.bgWrapper}>
        <Image
          src="/images/discover/hero-background.jpg" 
          alt="Immersive culture"
          fill
          className={styles.bgImage}
          priority
        />
        <div className={styles.overlayGradient} />
        <div className={styles.scanlines} aria-hidden="true" />
      </div>

      <div className={styles.container}>
        {/* =========================================
            LEFT: THE MISSION CONTROL
        ========================================= */}
        <div className={styles.commandDeck}>
          <div className={styles.systemBreadcrumb}>
            <Cpu size={12} className={styles.sysIcon} />
            <span>WN.SYS_CORE // DISCOVERY_PROTOCOL</span>
            <span className={styles.blinkingDot} />
          </div>

          <header className={styles.header}>
            <h1 className={styles.titleMain}>
              <span className={styles.titleGlow}>DISCOVER</span>
              <br />
              THE BEAT.
            </h1>
            <p className={styles.tagline}>
              Initialize connection to the WaveNation cultural grid. Stream flagship playlists, monitor live charts, and syndicate with global creators.
            </p>
          </header>

          <div className={styles.actionCluster}>
            <Link href="/discover/trending" className={styles.primaryCta}>
              <div className={styles.ctaGlow} />
              <Sparkles size={16} />
              ACQUIRE SIGNAL
            </Link>
            
            <div className={styles.liveTelemetry}>
              <Globe size={14} className={styles.dimIcon} />
              <div className={styles.telemetryData}>
                <span className={styles.tLabel}>NETWORK_LATENCY</span>
                <span className={styles.tValue}>12ms / OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT: BENTO BOX HUD
        ========================================= */}
        <div className={styles.bentoHUD}>
          
          {/* TAB NAV */}
          <nav className={styles.bentoNav}>
            {(Object.keys(HUB_DATA) as Category[]).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={clsx(styles.navBtn, active === key && styles.navBtnActive)}
              >
                {key === 'playlists' && <Music4 size={14} />}
                {key === 'charts' && <TrendingUp size={14} />}
                {key === 'creators' && <Users size={14} />}
                {key.toUpperCase()}
              </button>
            ))}
          </nav>

          {/* DYNAMIC CONTENT GRID */}
          <div className={styles.bentoGrid}>
            
            {/* Main Art Panel */}
            <div className={styles.bentoArtPanel}>
              <Image 
                src={current.artwork} 
                alt={current.title}
                fill 
                className={styles.bentoArt}
              />
              <div className={styles.artOverlay}>
                <button className={styles.quickPlayBtn}>
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className={styles.bentoInfoPanel}>
              <div className={styles.infoTop}>
                <span className={styles.eyebrow} style={{ color: current.accent }}>
                  {current.eyebrow}
                </span>
                <h3 className={styles.infoTitle}>{current.title}</h3>
                <p className={styles.infoDesc}>{current.description}</p>
              </div>
              
              {/* Metrics Row */}
              <div className={styles.metricRow}>
                <div className={styles.metricBox}>
                  <span className={styles.mLabel}>{current.metric1.label}</span>
                  <span className={styles.mValue}>{current.metric1.value}</span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.mLabel}>{current.metric2.label}</span>
                  <span className={styles.mValue} style={{ color: current.accent }}>
                    {current.metric2.value}
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Panel: Live EQ */}
            <div className={styles.bentoMicroPanel}>
              <div className={styles.eqHeader}>
                <Activity size={12} className={styles.eqIcon} style={{ color: current.accent }} />
                <span>DATA_STREAM</span>
              </div>
              <div className={styles.eqBars}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={styles.eqBar} style={{ 
                    backgroundColor: current.accent,
                    animationDelay: `${i * 0.1}s` 
                  }} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}