'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import styles from './ChartInsightCards.module.css'
import { TrendingUp, Sparkles, Activity } from 'lucide-react'

/* ======================================================
   Types & Motion
====================================================== */
export type ChartKey = 'hitlist' | 'southern-soul' | 'gospel' | 'rnb-soul' | 'hip-hop'

export interface ChartEntry {
  rank: number
  movement?: 'up' | 'down' | 'same' | 'new'
  trackTitle: string
  artist: string
}

export interface Chart {
  id: number | string
  title: string
  chartKey: ChartKey
  week: string
  entries: ChartEntry[]
}

interface Props {
  charts?: Chart[]
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariant: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
}

export function ChartInsightCards({ charts }: Props) {
  // ==========================================
  // SKELETON LOADER STATE
  // ==========================================
  if (!charts || charts.length === 0) {
    return (
      <div className={styles.stack}>
        {/* Main Leaderboard Skeleton */}
        <article className={`${styles.primaryCard} ${styles.skeletonCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.skelHeaderLeft} />
            <div className={styles.skelWeek} />
          </div>
          <div className={styles.skelTitle} />
          
          <div className={styles.topList}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.row}>
                <div className={styles.skelRank} />
                <div className={styles.details}>
                  <div className={styles.skelTrack} />
                  <div className={styles.skelArtist} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.skelLink} />
        </article>

        {/* Insight Widgets Skeleton */}
        <div className={styles.widgetGrid}>
          {[1, 2].map((i) => (
            <div key={i} className={`${styles.widget} ${styles.skeletonCard}`}>
              <div className={styles.skelWidgetLabel} />
              <div className={styles.skelWidgetValue} />
              <div className={styles.skelWidgetSub} />
            </div>
          ))}
        </div>

        {/* Explore All Skeleton */}
        <div className={`${styles.exploreAll} ${styles.skeletonCard}`}>
          <div className={styles.skelExplore} />
        </div>
      </div>
    )
  }

  // ==========================================
  // LOADED STATE
  // ==========================================
  const hasCharts = Array.isArray(charts) && charts.length > 0
  const hitList = hasCharts ? charts.find((c) => c.chartKey === 'hitlist') || charts[0] : null
  const topFive = hitList ? hitList.entries.slice(0, 5) : []

  const allEntries = hasCharts 
    ? charts.flatMap((c) => c.entries.map((e) => ({ ...e, chartKey: c.chartKey }))) 
    : []
    
  const biggestGainer = allEntries.find((e) => e.movement === 'up') || null
  const highestDebut = allEntries.find((e) => e.movement === 'new') || null

  return (
    <motion.div className={styles.stack} variants={container} initial="hidden" animate="show">
      
      {/* 1. MAIN LEADERBOARD */}
      <motion.article variants={itemVariant} className={styles.primaryCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <Activity size={14} className={styles.iconPurple} />
            <span className={styles.eyebrow}>LATEST CHART RANKINGS</span>
          </div>
          <span className={styles.weekLabel}>{hitList?.week}</span>
        </div>

        <h3 className={styles.chartTitle}>The Hitlist</h3>

        <div className={styles.topList}>
          {topFive.map((entry) => (
            <div key={entry.rank} className={styles.row}>
              <span className={styles.rank}>0{entry.rank}</span>
              <div className={styles.details}>
                <span className={styles.track}>{entry.trackTitle}</span>
                <span className={styles.artist}>{entry.artist}</span>
              </div>
              {entry.movement === 'up' && <TrendingUp size={12} className={styles.trendUp} />}
              {entry.movement === 'new' && <Sparkles size={12} className={styles.trendNew} />}
            </div>
          ))}
        </div>

        <Link href={`/charts/${hitList?.chartKey}`} className={styles.fullLink}>
          Full Chart &rarr;
        </Link>
      </motion.article>

      {/* 2. INSIGHT WIDGETS */}
      <div className={styles.widgetGrid}>
        {biggestGainer && (
          <motion.div variants={itemVariant} className={styles.widget}>
            <p className={styles.widgetLabel}>BIGGEST GAINER</p>
            <p className={styles.widgetValue}>{biggestGainer.trackTitle}</p>
            <p className={styles.widgetSub}>{biggestGainer.artist}</p>
            <div className={styles.widgetGlowGreen} />
          </motion.div>
        )}

        {highestDebut && (
          <motion.div variants={itemVariant} className={styles.widget}>
            <p className={styles.widgetLabel}>HIGHEST DEBUT</p>
            <p className={styles.widgetValue}>#{highestDebut.rank} {highestDebut.trackTitle}</p>
            <p className={styles.widgetSub}>{highestDebut.artist}</p>
            <div className={styles.widgetGlowPurple} />
          </motion.div>
        )}
      </div>

      {/* 3. EXPLORE ALL */}
      <motion.div variants={itemVariant}>
        <Link href="/charts" className={styles.exploreAll}>
          <span>VIEW ALL CHARTS</span>
          <span className={styles.brandTag}>WN CHARTS</span>
        </Link>
      </motion.div>
      
    </motion.div>
  )
}