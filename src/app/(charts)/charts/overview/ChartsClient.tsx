'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import { Activity, TrendingUp, Radio, Database, ArrowRight, Target, Hash } from 'lucide-react'
import styles from './ChartsOverview.module.css'

/* ======================================================
   TYPES
====================================================== */

type ChartEntry = {
  rank: number
  trackTitle: string
  artist: string
}

type ChartOverview = {
  chartKey: string
  label: string
  week: number
  updatedDaysAgo: number
  href: string
  topFive: ChartEntry[]
  biggestGainer?: ChartEntry
  highestDebut?: ChartEntry
  dropped: ChartEntry[]
}

/* ======================================================
   COMPONENT
====================================================== */

export default function ChartsClient({ charts }: { charts: ChartOverview[] }) {
  const [activeLane, setActiveLane] = useState<string | null>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  /* ======================================================
     ANALYTICS: Lane impressions (fire once)
  ====================================================== */
  const seenLanes = useRef<Set<string>>(new Set())

  /* ======================================================
     SCROLL SPY
  ====================================================== */
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>('[data-chart-row]')
    if (!rows.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lane = entry.target.id
            setActiveLane(lane)

            if (!seenLanes.current.has(lane)) {
              seenLanes.current.add(lane)
              trackEvent('content_impression', {
                content_type: 'chart_lane',
                chartKey: lane,
              })
            }
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  /* ======================================================
     AUTO-CENTER ACTIVE STRIP ITEM
  ====================================================== */
  useEffect(() => {
    if (!activeLane) return
    itemRefs.current[activeLane]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeLane])

  return (
    <div className={styles.wrapper}>
      {/* ================= NODE SELECTOR STRIP ================= */}
      <nav className={styles.latestStrip} aria-label="Chart Navigation">
        <div className={styles.latestInner}>
          {charts.map((c) => {
            const isActive = activeLane === c.chartKey
            const isToday = c.updatedDaysAgo === 0

            return (
              <a
                key={c.chartKey}
                href={`#${c.chartKey}`}
                ref={(el) => {
                  if (el) itemRefs.current[c.chartKey] = el
                }}
                className={`${styles.navItem} ${c.chartKey === 'hitlist' ? styles.navPrimary : ''} ${isActive ? styles.navActive : ''}`}
                onClick={() =>
                  trackEvent('navigation_click', {
                    location: 'charts_overview_strip',
                    chartKey: c.chartKey,
                    label: c.label,
                  })
                }
              >
                <span className={styles.navLabel}>{c.label.toUpperCase()}</span>
                <span className={styles.navMeta}>
                  {isToday && isActive && <span className={styles.liveDot} aria-hidden />}
                  {isToday ? 'SYNC: TODAY' : c.updatedDaysAgo === 1 ? 'SYNC: 1 DAY AGO' : `SYNC: ${c.updatedDaysAgo} DAYS AGO`}
                </span>
              </a>
            )
          })}
        </div>
      </nav>

      {/* ================= DATA SECTORS (ROWS) ================= */}
      <section className={styles.rows}>
        {charts.map((chart) => (
          <article
            key={chart.chartKey}
            id={chart.chartKey}
            data-chart-row
            className={`${styles.row} ${chart.chartKey === 'hitlist' ? styles.hitlistRow : ''}`}
          >
            {/* ---------- HEADER ---------- */}
            <header className={styles.rowHeader}>
              <div className={styles.headerLeft}>
                <h2 className={styles.rowTitle}>{chart.label}</h2>
                <span className={styles.weekBadge}>WK {chart.week}</span>
              </div>
              {chart.chartKey === 'hitlist' && (
                <div className={styles.flagshipBadge}>
                  <Activity size={12} className={styles.pulse} /> FLAGSHIP_INDEX
                </div>
              )}
            </header>

            {/* ---------- BENTO GRID ---------- */}
            <div className={styles.rowGrid}>
              
              {/* TOP 5 PANEL */}
              <div className={styles.topFivePanel}>
                <h4 className={styles.panelTitle}><Target size={14} /> TOP_5_VELOCITY</h4>
                <div className={styles.topFiveList}>
                  {chart.topFive.map((e, index) => (
                    <div key={index} className={styles.topFiveItem}>
                      <span className={styles.rankNum}>#{index + 1}</span>
                      <div className={styles.trackInfo}>
                        <strong className={styles.trackTitle}>{e.trackTitle}</strong>
                        <span className={styles.trackArtist}>{e.artist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATS COLUMN */}
              <div className={styles.statsColumn}>
                
                {/* BIGGEST GAINER */}
                <div className={styles.statCard}>
                  <h4 className={styles.panelTitle}><TrendingUp size={14} /> BIGGEST_GAINER</h4>
                  <div className={styles.statBody}>
                    {chart.biggestGainer ? (
                      <>
                        <strong className={styles.statTrack}>{chart.biggestGainer.trackTitle}</strong>
                        <span className={styles.statArtist}>{chart.biggestGainer.artist}</span>
                      </>
                    ) : (
                      <span className={styles.emptyStat}>—</span>
                    )}
                  </div>
                </div>

                {/* HIGHEST DEBUT */}
                <div className={styles.statCard}>
                  <h4 className={styles.panelTitle}><Radio size={14} /> HIGHEST_DEBUT</h4>
                  <div className={styles.statBody}>
                    {chart.highestDebut ? (
                      <>
                        <strong className={styles.statTrack}>{chart.highestDebut.trackTitle}</strong>
                        <span className={styles.statArtist}>{chart.highestDebut.artist}</span>
                      </>
                    ) : (
                      <span className={styles.emptyStat}>—</span>
                    )}
                  </div>
                </div>

                {/* DROPPED */}
                <div className={styles.statCardDropped}>
                  <h4 className={styles.panelTitleDropped}><Database size={14} /> PURGED_FROM_INDEX</h4>
                  <div className={styles.droppedList}>
                    {chart.dropped.length ? (
                      chart.dropped.map((e, i) => (
                        <div key={i} className={styles.droppedItem}>
                          <span className={styles.droppedTrack}>{e.trackTitle}</span>
                          <span className={styles.droppedArtist}>{'//'} {e.artist}</span>
                        </div>
                      ))
                    ) : (
                      <span className={styles.emptyStat}>—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- FOOTER ---------- */}
            <footer className={styles.rowFooter}>
              <span className={styles.poweredBy}>
                DATA_SRC: URBAN INFLUENCER™
              </span>

              <Link
                href={chart.href}
                className={styles.viewFullBtn}
                onClick={() =>
                  trackEvent('content_click', {
                    content_type: 'chart',
                    chartKey: chart.chartKey,
                    label: chart.label,
                  })
                }
              >
                INITIALIZE FULL CHART <ArrowRight size={14} />
              </Link>
            </footer>
          </article>
        ))}
      </section>
    </div>
  )
}