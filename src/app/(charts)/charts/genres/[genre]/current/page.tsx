import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../GenreDetailPage.module.css' // Reusing the shared CSS module
import { Hash, Activity, Calendar, Cpu, ArrowRight } from 'lucide-react'

import { getChartsByGenre } from '../../../../../lib/charts/getChartsByGenre'
import { getGenreConfig } from '../../components/genre.config'
import {
  getCurrentChart,
  sortChartsByPublishDateDesc,
  formatPublishDate,
  type ChartDoc,
} from '../../components/genre.utils'

type Props = { params: Promise<{ genre: string }> }

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)
  if (!config) return { title: 'Current Genre Chart | WaveNation' }
  return { title: `${config.title} Current Chart | WaveNation`, description: `The latest published ${config.title} chart on WaveNation.` }
}

export const revalidate = 300

export default async function GenreCurrentPage({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)

  if (!config) notFound()

  const charts = (await getChartsByGenre(config.slug)) as ChartDoc[]
  const current = getCurrentChart(sortChartsByPublishDateDesc(charts))

  if (!current) notFound()

  return (
    <main className={styles.page}>
      {/* =========================================
          COMMAND DECK HERO
      ========================================= */}
      <header className={styles.hero}>
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.container}>
          
          <nav className={styles.sysBreadcrumb}>
            <Link href="/charts" className={styles.breadcrumbLink}>WN.SYS</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href={`/charts/genres/${config.slug}`} className={styles.breadcrumbLink}>{config.slug.toUpperCase()}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>CURRENT_SYNC</span>
          </nav>

          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{config.eyebrow.toUpperCase()} // ACTIVE</span>
              <h1 className={styles.title}>{config.title}</h1>
              <p className={styles.description}>The newest published chart issue on the WaveNation network.</p>
            </div>

            <aside className={styles.techPanel}>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Cpu size={12} /> WEEK</span>
                <span className={styles.sValue}>{current.week}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Calendar size={12} /> PUBLISHED</span>
                <span className={styles.sValue}>{formatPublishDate(current.publishDate)}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.sLabel}><Hash size={12} /> ENTRIES</span>
                <span className={styles.sValue} style={{ color: '#00F0FF' }}>{current.entries.length}</span>
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
              <span className={styles.terminalEyebrow}>INDEXED ENTRIES</span>
              <h2 className={styles.terminalTitle}>CURRENT_CHART_DATA</h2>
            </div>
            <Link href={`/charts/${current.slug}`} className={styles.viewFullBtn}>
              FULL ANALYSIS <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.terminal}>
            <div className={styles.tHead}>
              <div className={styles.colRank}>INDEX</div>
              <div className={styles.colTrack}>AUDIO_SIGNAL</div>
              <div className={styles.colArtist}>SOURCE</div>
            </div>

            <div className={styles.tBody}>
              {current.entries.map((entry) => (
                <div key={`${current.slug}-${entry.rank}-${entry.trackTitle}-${entry.artist}`} className={styles.tRow}>
                  <div className={styles.colRank}>
                    <span className={styles.rankNum}>{entry.rank}</span>
                  </div>
                  
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