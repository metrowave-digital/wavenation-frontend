import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './GenreDetailPage.module.css'
import { Cpu, Activity, Clock, FolderArchive, ArrowRight, Radio } from 'lucide-react'

import { getChartsByGenre } from '../../../../lib/charts/getChartsByGenre'
import { getGenreConfig } from '../components/genre.config'
import {
  getCurrentChart,
  sortChartsByPublishDateDesc,
  formatPublishDate,
  type ChartDoc,
} from '../components/genre.utils'

type Props = { params: Promise<{ genre: string }> }

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)
  if (!config) return { title: 'Genre Chart | WaveNation' }
  return { title: `${config.title} Charts | WaveNation`, description: config.description }
}

export const revalidate = 300

export default async function GenreDetailPage({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)

  if (!config) notFound()

  const charts = (await getChartsByGenre(config.slug)) as ChartDoc[]
  const sorted = sortChartsByPublishDateDesc(charts)
  const current = getCurrentChart(sorted)

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
            <span className={styles.breadcrumbCurrent}>{config.slug.toUpperCase()}</span>
          </nav>

          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{config.eyebrow.toUpperCase()}</span>
              <h1 className={styles.title}>{config.title}</h1>
              <p className={styles.description}>{config.description}</p>
            </div>

            <aside className={styles.techPanel}>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Activity size={12} /> CADENCE</span>
                <span className={styles.sValue}>WEEKLY_SYNC</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><FolderArchive size={12} /> INDEXED_ISSUES</span>
                <span className={styles.sValue}>{sorted.length}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Radio size={12} /> ACTIVE_WEEK</span>
                <span className={styles.sValue} style={{ color: '#00F0FF' }}>{current?.week ?? '—'}</span>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* =========================================
            QUICK ACCESS NODES
        ========================================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>SYSTEM <span className={styles.cyan}>ACCESS</span></h2>
            <div className={styles.headerLine} />
          </div>

          <div className={styles.pathGrid}>
            <Link href={`/charts/genres/${config.slug}/current`} className={styles.pathCardActive}>
              <div className={styles.pathMeta}>
                <span className={styles.pathEyebrow}>LIVE_SYNC</span>
                <Radio size={16} className={styles.pulse} />
              </div>
              <strong className={styles.pathTitle}>CURRENT CHART</strong>
              <span className={styles.pathText}>Open the newest published {config.shortTitle} week.</span>
              <div className={styles.pathFooter}>INITIALIZE <ArrowRight size={14} /></div>
            </Link>

            <Link href={`/charts/genres/${config.slug}/archive`} className={styles.pathCard}>
              <div className={styles.pathMeta}>
                <span className={styles.pathEyebrowArchive}>DATABASE</span>
                <FolderArchive size={16} className={styles.dimIcon} />
              </div>
              <strong className={styles.pathTitle}>ARCHIVE</strong>
              <span className={styles.pathText}>Browse past weeks and previous chart drops.</span>
              <div className={styles.pathFooterArchive}>ACCESS_LOGS <ArrowRight size={14} /></div>
            </Link>
          </div>
        </section>

        {/* =========================================
            RECENT ISSUES GRID
        ========================================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>RECENT <span className={styles.cyan}>ISSUES</span></h2>
            <div className={styles.headerLine} />
          </div>

          <div className={styles.archiveGrid}>
            {sorted.slice(0, 6).map((chart) => (
              <Link key={chart.slug} href={`/charts/${chart.slug}`} className={styles.archiveCard}>
                <div className={styles.archiveTop}>
                  <span className={styles.archiveWeek}>WK {chart.week}</span>
                  <Clock size={14} className={styles.cyan} />
                </div>
                <div className={styles.archiveBottom}>
                  <span className={styles.archiveDate}>{formatPublishDate(chart.publishDate)}</span>
                  <span className={styles.archiveAction}>VIEW <ArrowRight size={12} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}