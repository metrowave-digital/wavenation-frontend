'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './ChartPage.module.css'
import { trackEvent } from '@/lib/analytics'
import { 
  Activity, TrendingUp, TrendingDown, Minus, 
  Database, Calendar, Cpu, ExternalLink, Hash, Radio
} from 'lucide-react'
import type { Chart } from '../../../lib/types/chart'

type DerivedEntry = {
  rank: number
  trackTitle: string
  artist: string
  delta: number | null
  isDebut: boolean
}

/* ======================================================
   Helpers
====================================================== */

function normalize(chart: Chart): DerivedEntry[] {
  return chart.entries.map((e) => ({
    rank: e.rank,
    trackTitle: e.trackTitle ?? '—',
    artist: e.artist ?? '—',
    delta: null,
    isDebut: false,
  }))
}

function titleize(key: string) {
  return key
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

function getWeekNumber(slug: string): number | null {
  const match = slug.match(/-W(\d{2})$/)
  return match ? Number(match[1]) : null
}

/* ======================================================
   Component
====================================================== */

export default function ChartPageClient({ chart }: { chart: Chart }) {
  const [weeks, setWeeks] = useState<Chart[]>([])
  const [manualCompareSlug, setManualCompareSlug] = useState<string>('')

  const currentWeekNumber = getWeekNumber(chart.slug)

  /* ================= PAGE IMPRESSION ================= */
  const pageImpressionFired = useRef(false)

  useEffect(() => {
    if (pageImpressionFired.current) return
    pageImpressionFired.current = true

    trackEvent('content_impression', {
      content_type: 'chart_page',
      chartKey: chart.chartKey,
      week: chart.week,
      slug: chart.slug,
    })
  }, [chart])

  /* ================= LOAD WEEKS ================= */
  useEffect(() => {
    fetch(`/api/charts/by-key?chartKey=${chart.chartKey}`)
      .then((r) => r.json())
      .then(setWeeks)
      .catch(() => {})
  }, [chart.chartKey])

  /* ================= LIMIT COMPARABLE WEEKS ================= */
  const comparableWeeks = useMemo(() => {
    if (!currentWeekNumber) return []

    return weeks.filter((w) => {
      const wNum = getWeekNumber(w.slug)
      if (!wNum) return false
      const diff = currentWeekNumber - wNum
      return diff >= 1 && diff <= 5
    })
  }, [weeks, currentWeekNumber])

  /* ================= DERIVED COMPARISON ================= */
  const compareChart = useMemo(() => {
    if (manualCompareSlug) {
      return comparableWeeks.find((w) => w.slug === manualCompareSlug) ?? null
    }
    return comparableWeeks[0] ?? null
  }, [manualCompareSlug, comparableWeeks])

  const compareWeekNumber = compareChart ? getWeekNumber(compareChart.slug) : null
  const weekDiff = currentWeekNumber && compareWeekNumber ? currentWeekNumber - compareWeekNumber : null

  /* ================= NORMALIZED DATA ================= */
  const currentEntries = useMemo(() => normalize(chart), [chart])
  const previousEntries = useMemo(() => (compareChart ? normalize(compareChart) : []), [compareChart])

  /* ================= PREVIOUS RANK LOOKUP ================= */
  const previousRankMap = useMemo(() => {
    const map = new Map<string, number>()
    previousEntries.forEach((e) => {
      map.set(`${e.trackTitle}__${e.artist}`, e.rank)
    })
    return map
  }, [previousEntries])

  /* ================= APPLY COMPARISON ================= */
  const entries = useMemo(() => {
    return currentEntries.map((entry) => {
      const key = `${entry.trackTitle}__${entry.artist}`
      const prevRank = previousRankMap.get(key)

      return {
        ...entry,
        delta: typeof prevRank === 'number' ? prevRank - entry.rank : null,
        isDebut: prevRank === undefined,
      }
    })
  }, [currentEntries, previousRankMap])

  /* ================= DERIVED INSIGHTS ================= */
  const topThree = entries.slice(0, 3)
  const biggestGainer = [...entries]
    .filter((e) => typeof e.delta === 'number' && e.delta! > 0)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))[0]
  const topDebut = entries.find((e) => e.isDebut)
  const droppedTracks = previousEntries.filter(
    (p) => !currentEntries.find((c) => c.trackTitle === p.trackTitle && c.artist === p.artist)
  )

  const isComparing = Boolean(compareChart)

  function comparisonLabel(prevRank: number) {
    if (!weekDiff) return null
    if (weekDiff === 1) return `WAS #${prevRank} LAST WEEK`
    return `WAS #${prevRank} // ${weekDiff} WKS AGO` // This is inside a JS string, so // is safe here
  }

  /* ================= RENDER ================= */
  return (
    <main className={styles.page}>
      {/* ================= COMMAND DECK HERO ================= */}
      <header className={styles.hero}>
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.sysBreadcrumb}>
            <Cpu size={12} className={styles.sysIcon} />
            <span>WN.SYSTEM {'//'} CHARTS {'//'} {chart.chartKey.toUpperCase()}</span>
          </div>

          <h1 className={styles.title}>{titleize(chart.chartKey)}</h1>
          
          <div className={styles.heroMeta}>
            <div className={styles.metaBadge}>
              <Calendar size={14} className={styles.cyan} />
              WEEK OF {chart.week.toUpperCase()}
            </div>
            <div className={styles.metaBadge}>
              <Activity size={14} className={styles.cyan} />
              {isComparing ? 'SYNC: COMPARING WEEKS' : 'SYNC: CURRENT WEEK'}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        
        {/* ================= SYSTEM CONTROLS ================= */}
        <div className={styles.systemControls}>
          <div className={styles.weekSelector}>
            <Database size={14} className={styles.dimIcon} />
            <label>COMPARISON_NODE</label>
            <select
              className={styles.selectInput}
              value={manualCompareSlug}
              onChange={(e) => {
                setManualCompareSlug(e.target.value)
                trackEvent('navigation_click', {
                  action: 'compare_week',
                  chartKey: chart.chartKey,
                  week: chart.week,
                  compareSlug: e.target.value || 'auto',
                })
              }}
            >
              <option value="">AUTO (PREVIOUS)</option>
              {comparableWeeks.map((w) => (
                <option key={w.slug} value={w.slug}>{w.week.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <a href="https://urbaninfluencer.com" target="_blank" rel="noopener noreferrer" className={styles.poweredBy}>
            DATA PROVIDER {'//'} URBAN INFLUENCER <ExternalLink size={12} />
          </a>
        </div>

        {/* ================= TELEMETRY HUD (INSIGHTS) ================= */}
        <div className={styles.telemetryHud}>
          {/* Top 3 Focus */}
          <div className={styles.topThreeGrid}>
            {topThree.map((t) => {
              const prevRank = previousRankMap.get(`${t.trackTitle}__${t.artist}`)
              return (
                <div key={`top-${t.rank}`} className={styles.topCard}>
                  <div className={styles.topRank}>#{t.rank}</div>
                  <div className={styles.topInfo}>
                    <strong className={styles.topTrack}>{t.trackTitle}</strong>
                    <em className={styles.topArtist}>{t.artist}</em>
                  </div>
                  {isComparing && prevRank && (
                    <div className={styles.prevRankReadout}>
                      <Activity size={10} /> {comparisonLabel(prevRank)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Stats Column */}
          <div className={styles.statsColumn}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>BIGGEST_GAINER</span>
              <strong className={styles.statTrack}>{biggestGainer?.trackTitle ?? '—'}</strong>
              <span className={styles.statDelta}>
                {biggestGainer?.delta ? <><TrendingUp size={14} className={styles.cyan} /> +{biggestGainer.delta}</> : '—'}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>TOP_DEBUT</span>
              <strong className={styles.statTrack}>{topDebut?.trackTitle ?? '—'}</strong>
              <span className={styles.statDelta}>
                {topDebut ? <><Radio size={14} className={styles.cyan} /> NEW ENTRY</> : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ================= DATA TERMINAL (CHART LIST) ================= */}
        <section className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <div className={styles.colRank}><Hash size={14} /> INDEX</div>
            <div className={styles.colTrack}>AUDIO_SIGNAL</div>
            <div className={styles.colArtist}>SOURCE</div>
            <div className={styles.colMove}>VELOCITY</div>
          </div>

          <div className={styles.terminalBody}>
            {entries.map((e) => (
              <ChartRowImpression key={`${chart.id}-${e.rank}-${e.trackTitle}`} chartKey={chart.chartKey} week={chart.week} entry={e}>
                <div className={styles.chartRow}>
                  <div className={styles.colRank}>
                    <span className={styles.rankNum}>{e.rank}</span>
                  </div>
                  <div className={styles.colTrack}>
                    <span className={styles.trackName}>{e.trackTitle}</span>
                  </div>
                  <div className={styles.colArtist}>
                    <span className={styles.artistName}>{e.artist}</span>
                  </div>
                  <div className={styles.colMove}>
                    <div className={`${styles.movementBadge} ${e.isDebut ? styles.moveNew : e.delta && e.delta > 0 ? styles.moveUp : e.delta && e.delta < 0 ? styles.moveDown : styles.moveFlat}`}>
                      {e.isDebut ? (
                        <>NEW</>
                      ) : typeof e.delta === 'number' ? (
                        e.delta > 0 ? <><TrendingUp size={14} /> {e.delta}</> : 
                        e.delta < 0 ? <><TrendingDown size={14} /> {Math.abs(e.delta)}</> : 
                        <><Minus size={14} /></>
                      ) : (
                        <><Minus size={14} /></>
                      )}
                    </div>
                  </div>
                </div>
              </ChartRowImpression>
            ))}
          </div>
        </section>

        {/* ================= DROPPED DATA ================= */}
        {droppedTracks.length > 0 && (
          <section className={styles.droppedSection}>
            <div className={styles.droppedHeader}>
              <Database size={14} /> PURGED_FROM_INDEX {'//'} {droppedTracks.length} TRACKS
            </div>
            <div className={styles.droppedList}>
              {droppedTracks.map((d) => (
                <div key={`${d.rank}-${d.trackTitle}`} className={styles.droppedItem}>
                  <span className={styles.droppedTrack}>{d.trackTitle}</span>
                  <span className={styles.droppedArtist}>{'//'} {d.artist}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

/* ======================================================
   ROW IMPRESSION (CLIENT ONLY)
====================================================== */
function ChartRowImpression({ chartKey, week, entry, children }: { chartKey: string, week: string, entry: DerivedEntry, children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entryObs]) => {
        if (entryObs.isIntersecting && !fired.current) {
          fired.current = true
          trackEvent('content_impression', {
            content_type: 'chart_entry',
            chartKey, week, rank: entry.rank,
            trackTitle: entry.trackTitle, artist: entry.artist,
            isDebut: entry.isDebut, delta: entry.delta,
          })
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [chartKey, week, entry])

  return <div ref={ref}>{children}</div>
}