'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Sparkles, UserPlus, Network } from 'lucide-react'
import styles from './HeroConnect.module.css'

export interface HeroConnectProps {
  title: string
  eyebrow?: string
  lede?: string
  networkStat?: string
  imageUrl?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
}

export function HeroConnect({
  title,
  eyebrow = 'CREATOR NETWORK',
  lede = ' built for the voices shaping what’s next in music and culture.',
  networkStat = '25K+ NODES_ACTIVE',
  imageUrl = '/images/connect/community-fallback.jpg',
  primaryCtaText = 'JOIN THE NETWORK',
  primaryCtaHref = '/connect/join',
  secondaryCtaText = 'SUBMIT MUSIC',
  secondaryCtaHref = '/submit'
}: HeroConnectProps) {
  return (
    <section className={styles.root}>
      <div className={styles.container}>
        {/* Left: Text & CTAs */}
        <div className={styles.dataColumn}>
          <div className={styles.sysBreadcrumb}>
            <Network size={12} className={styles.sysIcon} />
            <span>WN.CONNECT // COMMUNITY_PROTOCOL // SYNC</span>
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>{eyebrow.toUpperCase()}</span>
            <h1 className={styles.title}>{title}</h1>
          </header>
          
          <p className={styles.lede}>
            The decentralized WaveNation ecosystem <span className={styles.dim}> {lede} </span>
          </p>

          <div className={styles.networkPulse}>
            <Sparkles size={14} className={styles.pulse} />
            <span className={styles.stat}>{networkStat.toUpperCase()}</span>
          </div>

          <div className={styles.actions}>
            <Link href={primaryCtaHref} className={styles.primaryBtn}>
              <UserPlus size={18} fill="#000" color="#000" />
              <span>{primaryCtaText.toUpperCase()}</span>
            </Link>
            <Link href={secondaryCtaHref} className={styles.secondaryBtn}>
              {secondaryCtaText.toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Right: Creator Collage */}
        <div className={styles.visualColumn}>
          <div className={styles.glassPanel}>
            <div className={styles.imageWrap}>
              <Image 
                src={imageUrl} 
                alt="Community" 
                fill 
                className={styles.communityImage} 
                priority 
              />
              <div className={styles.overlayGradient} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}