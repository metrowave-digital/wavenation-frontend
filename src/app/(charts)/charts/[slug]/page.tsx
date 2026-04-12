import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './ChartDetailPage.module.css'
import { Hash, Activity, Calendar, Fingerprint, FolderArchive, ArrowLeft } from 'lucide-react'

import { getChartBySlug } from '../../../lib/charts/getChartBySlug'
import { formatPublishDate } from '../genres/components/genre.utils'

type ChartEntry = {
  rank: number
  trackTitle: string
  artist: string
}

type ChartDoc = {
  id: string
  slug: string
  chartKey: string
  week: string
  publishDate: string
  entries: ChartEntry[]
}

type Props = {
  params: Promise<{ slug: string }>
}

type ChartRouteMeta = {
  chartLabel: string
  parentHref: string
  parentLabel: string
  currentHref: string
  archiveHref: string
  title: string
  description: string
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) return { title: 'Chart Not Found | WaveNation' }

  const routeMeta = getChartRouteMeta(chart)
  return { title: `${routeMeta.title} | WaveNation`, description: routeMeta.description }
}

export const revalidate = 300

export default async function ChartDetailPage({ params }: Props) {
  const { slug } = await params
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) notFound()

  const routeMeta = getChartRouteMeta(chart)

  return (
    <main className={styles.page}>
      {/* =========================================
          COMMAND DECK HERO
      ========================================= */}
      <header className={styles.hero}>
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.container}>
          
          <nav className={styles.sysBreadcrumb}>
            <Link href="/charts" className={styles.breadcrumbLink}>WN.SYS // CHARTS</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href={routeMeta.parentHref} className={styles.breadcrumbLink}>{routeMeta.parentLabel.toUpperCase()}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{chart.slug.toUpperCase()}</span>
          </nav>

          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{routeMeta.chartLabel}</span>
              <h1 className={styles.title}>{routeMeta.title}</h1>
              <p className={styles.description}>{routeMeta.description}</p>

              <div className={styles.actions}>
                <Link href={routeMeta.currentHref} className={styles.primaryCta}>
                  <Activity size={18} /> SYNC TO CURRENT
                </Link>
                <Link href={routeMeta.archiveHref} className={styles.secondaryCta}>
                  <FolderArchive size={16} /> BROWSE ARCHIVE
                </Link>
              </div>
            </div>

            <aside className={styles.techPanel}>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Fingerprint size={12} /> CHART_KEY</span>
                <span className={styles.sValue}>{chart.chartKey.toUpperCase()}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Calendar size={12} /> PUBLISHED</span>
                <span className={styles.sValue}>{formatPublishDate(chart.publishDate)}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Hash size={12} /> ENTRIES</span>
                <span className={styles.sValue} style={{ color: '#00F0FF' }}>{chart.entries.length}</span>
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* =========================================
          DATA TERMINAL (CHART LIST)
      ========================================= */}
      <section className={styles.terminalSection}>
        <div className={styles.container}>
          
          <div className={styles.terminalHeaderRow}>
            <div>
              <span className={styles.terminalEyebrow}>WEEKLY RANKING</span>
              <h2 className={styles.terminalTitle}>INDEXED ENTRIES</h2>
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.tHead}>
              <div className={styles.colRank}>INDEX</div>
              <div className={styles.colTrack}>AUDIO_SIGNAL</div>
              <div className={styles.colArtist}>SOURCE</div>
            </div>

            <div className={styles.tBody}>
              {chart.entries.map((entry) => (
                <div key={`${chart.slug}-${entry.rank}-${entry.trackTitle}-${entry.artist}`} className={styles.tRow}>
                  <div className={styles.colRank}>
                    <span className={styles.rankNum}>{entry.rank}</span>
                  </div>
                  
                  {/* Mobile stacks Track + Artist, Desktop separates them */}
                  <div className={styles.colTrack}>
                    <span className={styles.trackName}>{entry.trackTitle}</span>
                    <span className={styles.artistMobile}>{entry.artist}</span>
                  </div>
                  
                  <div className={styles.colArtist}>
                    <span className={styles.artistName}>{entry.artist}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}

function getChartRouteMeta(chart: ChartDoc): ChartRouteMeta {
  if (chart.chartKey === 'hitlist') {
    return {
      chartLabel: 'FLAGSHIP CHART',
      parentHref: '/charts/hitlist',
      parentLabel: 'Hitlist',
      currentHref: '/charts/hitlist/current',
      archiveHref: '/charts/hitlist/archive',
      title: `THE HITLIST — ${chart.week}`,
      description: 'WaveNation’s flagship weekly ranking tracking the songs making the strongest audience, editorial, and cultural impact right now.',
    }
  }

  const genreMap: Record<string, { title: string; label: string; slug: string; description: string }> = {
    'rnb-soul': { title: 'R&B / Soul', label: 'GENRE CHART', slug: 'rnb-soul', description: 'A weekly chart spotlighting the songs shaping R&B and soul momentum across WaveNation.' },
    'hip-hop': { title: 'Hip-Hop', label: 'GENRE CHART', slug: 'hip-hop', description: 'A weekly chart focused on the records driving hip-hop conversation and movement right now.' },
    'southern-soul': { title: 'Southern Soul', label: 'GENRE CHART', slug: 'southern-soul', description: 'A weekly chart dedicated to the records powering Southern Soul culture and audience loyalty.' },
    'gospel': { title: 'Gospel', label: 'GENRE CHART', slug: 'gospel', description: 'A weekly chart tracking the songs and artists moving gospel listeners and praise-centered culture.' },
    'house': { title: 'House', label: 'GENRE CHART', slug: 'house', description: 'A weekly chart tracking the records creating movement, discovery, and energy in house culture.' },
  }

  const genre = genreMap[chart.chartKey]

  if (genre) {
    return {
      chartLabel: genre.label,
      parentHref: `/charts/genres/${genre.slug}`,
      parentLabel: genre.title,
      currentHref: `/charts/genres/${genre.slug}/current`,
      archiveHref: `/charts/genres/${genre.slug}/archive`,
      title: `${genre.title.toUpperCase()} — ${chart.week}`,
      description: genre.description,
    }
  }

  return {
    chartLabel: 'CHART ISSUE',
    parentHref: '/charts',
    parentLabel: 'Charts',
    currentHref: '/charts',
    archiveHref: '/charts',
    title: `${chart.chartKey.toUpperCase()} — ${chart.week}`,
    description: 'Explore this published WaveNation chart issue.',
  }
}