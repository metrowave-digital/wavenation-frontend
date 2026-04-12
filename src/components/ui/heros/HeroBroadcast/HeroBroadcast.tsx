'use client'

import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Activity, Mic2, Zap, Radio, Cpu, Globe } from 'lucide-react'
import styles from './HeroBroadcast.module.css'
import { useAudio } from '../../../player/audio/AudioContext'

export function HeroBroadcast() {
  const { nowPlaying, currentShow, playing, status, play } = useAudio()

  const isLive = nowPlaying.isLive
  const showTitle = currentShow?.title || 'WaveNation Live'
  const hostName = currentShow?.hosts || 'On Air Now'
  const artwork = nowPlaying.artwork || currentShow?.artwork || '/images/player/artwork-fallback.png'

  return (
    <section className={styles.root}>
      <div className={styles.bgWrapper}>
        <Image src={artwork} alt={showTitle} fill className={styles.bgImage} priority />
        <div className={styles.overlayGradient} />
        <div className={styles.scanlines} aria-hidden="true" />
      </div>

      <div className={styles.container}>
        {/* Left: Broadcast Identity */}
        <div className={styles.commandDeck}>
          <div className={styles.systemBreadcrumb}>
            <Cpu size={12} className={styles.sysIcon} />
            <span>WN.SYS_CORE {'//'} BROADCAST_PROTOCOL</span>
            <span className={styles.blinkingDot} />
          </div>

          <header className={styles.header}>
            <div className={clsx(styles.statusBadge, isLive && styles.statusLive)}>
              {isLive ? <Activity size={14} className={styles.pulse} /> : <Radio size={14} />}
              <span>{isLive ? 'ON AIR' : 'RADIO'}</span>
            </div>
            <h1 className={styles.showTitle}>{showTitle}</h1>
            <div className={styles.hostRow}>
              <Mic2 size={18} className={styles.accent} />
              <span className={styles.hosts}>{hostName}</span>
            </div>
          </header>

          <div className={styles.actionCluster}>
            {!playing ? (
              <button className={styles.playBtn} onClick={() => play()}>
                <div className={styles.ctaGlow} />
                <Zap size={18} /> INITIALIZE STREAM
              </button>
            ) : (
              <div className={styles.liveTelemetry}>
                <Globe size={14} className={styles.dimIcon} />
                <div className={styles.telemetryData}>
                  <span className={styles.tLabel}>STREAM_HEALTH</span>
                  {/* Fixed JSX comment issue here */}
                  <span className={styles.tValue} style={{ color: '#39FF14' }}>
                    {status.toUpperCase()} {'//'} OPTIMAL
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Now Playing Bento */}
        <div className={styles.bentoHUD}>
          <div className={styles.bentoArtPanel}>
            <Image src={artwork} alt="Now Playing" fill className={styles.bentoArt} />
            <div className={styles.eqOverlay}>
              <Activity size={24} color="#39FF14" className={styles.pulse} />
            </div>
          </div>
          
          <div className={styles.bentoInfoPanel}>
            <span className={styles.eyebrow}>CURRENTLY TRANSMITTING</span>
            <h3 className={styles.trackTitle}>{nowPlaying.track}</h3>
            <p className={styles.trackArtist}>{nowPlaying.artist}</p>
            
            <div className={styles.techSpecs}>
              <div className={styles.specBox}>
                <span className={styles.sLabel}>FORMAT</span>
                <span className={styles.sValue}>HD-AAC</span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.sLabel}>FREQ</span>
                <span className={styles.sValue}>94.5 FM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}