'use client'

import React from 'react'
import type { NewsArticle } from '@/app/news/news.types'
import { LeftRail } from '../Rails/LeftRail'
import { CenterRail } from '../Rails/CenterRail'
import { RightRail } from '../Rails/RightRail'

import { ChartInsightCards } from '../HeroCharts/ChartInsightCards'
import { SpotlightArticles } from '../SpotlightArticles/SpotlightArticles'
import { HeroSlider } from '../HeroSlider/HeroSlider'
import { HeroFeaturedArtist } from '../HeroFeaturedArtist/HeroFeaturedArtist'
import { HeroNewsletter } from '../HeroNewsletter/HeroNewsletter'

import styles from './HomeHero.module.css'

/* ======================================================
   Types
====================================================== */
export type ChartEntry = {
  rank: number
  movement?: 'up' | 'down' | 'same' | 'new'
  trackTitle: string
  artist: string
}

export type Chart = {
  id: number | string
  title: string
  chartKey: 'hitlist' | 'southern-soul' | 'gospel' | 'rnb-soul' | 'hip-hop'
  week: string
  entries: ChartEntry[]
}

interface Props {
  charts: Chart[]
  /** Dynamic articles for the main Hero Slider */
  heroArticles: NewsArticle[]
  /** * Manually selected articles from Payload CMS. 
   * Typed to match SpotlightArticles component to avoid ESLint errors.
   */
  spotlightArticles: (NewsArticle | string | number)[] 
}

export default function HomeHeroClient({ charts, heroArticles, spotlightArticles }: Props) {
  return (
    <section className={styles.root} aria-label="WaveNation Command Center">
      {/* BRAND OVERLAY TEXTURES */}
      <div className={styles.textureOverlay} />
      
      <div className={styles.heroGrid}>
        
        {/* ================= LEFT RAIL: DATA & CHARTS ================= */}
        <div className={styles.railWrapper}>
          <LeftRail>
            <div className={styles.railHeader}>
              <span className={`${styles.liveDot} ${styles.dotPurple}`} />
              <p className={styles.railLabel}>MARKET PULSE</p>
            </div>
            {charts && charts.length > 0 ? (
              <ChartInsightCards charts={charts} />
            ) : null}
          </LeftRail>
        </div>

        {/* ================= CENTER RAIL: MAIN BROADCAST ================= */}
        <div className={styles.centerWrapper}>
          <CenterRail>
            {/* Main Slider: Top news feed */}
            <HeroSlider articles={heroArticles} />
            
            <div className={styles.spotlightWrapper}>
              {/* Manual Selection: Specific stories pinned in CMS */}
              <SpotlightArticles articles={spotlightArticles} />
            </div>
          </CenterRail>
        </div>

        {/* ================= RIGHT RAIL: SOCIAL & UP NEXT ================= */}
        <div className={styles.railWrapper}>
          <RightRail>
            <div className={styles.railHeader}>
              <span className={`${styles.liveDot} ${styles.dotMagenta}`} />
              <p className={styles.railLabel}>ON AIR / TALENT</p>
            </div>
            
            <HeroFeaturedArtist />
            
            <div className={styles.rightContentGap}>
               <HeroNewsletter />
            </div>
          </RightRail>
        </div>

      </div>
    </section>
  )
}