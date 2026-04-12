import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../GenreDetailPage.module.css' // Reusing shared CSS module
import { FolderArchive, Clock, ArrowRight } from 'lucide-react'

import { getChartsByGenre } from '../../../../../lib/charts/getChartsByGenre'
import { getGenreConfig } from '../../components/genre.config'
import {
  sortChartsByPublishDateDesc,
  formatPublishDate,
  type ChartDoc,
} from '../../components/genre.utils'

type Props = { params: Promise<{ genre: string }> }

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)
  if (!config) return { title: 'Genre Archive | WaveNation' }
  return { title: `${config.title} Archive | WaveNation`, description: `Browse archived ${config.title} chart issues.` }
}

export const revalidate = 300

export default async function GenreArchivePage({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)

  if (!config) notFound()

  const charts = (await getChartsByGenre(config.slug)) as ChartDoc[]
  const sorted = sortChartsByPublishDateDesc(charts)

  return (
    <main className={styles.page}>
      <header className={styles.heroArchive}>
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.container}>
          
          <nav className={styles.sysBreadcrumb}>
            <Link href="/charts" className={styles.breadcrumbLink}>WN.SYS</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href={`/charts/genres/${config.slug}`} className={styles.breadcrumbLink}>{config.slug.toUpperCase()}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>DATABASE</span>
          </nav>

          <h1 className={styles.titleArchive}>{config.title} ARCHIVE</h1>
          <p className={styles.description}>Access the complete historical index of published chart issues.</p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.archiveGrid}>
          {sorted.map((chart) => (
            <Link key={chart.slug} href={`/charts/${chart.slug}`} className={styles.archiveCard}>
              <div className={styles.archiveTop}>
                <span className={styles.archiveWeek}>WK {chart.week}</span>
                <FolderArchive size={14} className={styles.dimIcon} />
              </div>
              <div className={styles.archiveBottom}>
                <span className={styles.archiveDate}>{formatPublishDate(chart.publishDate)}</span>
                <span className={styles.archiveAction}>ACCESS <ArrowRight size={12} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}