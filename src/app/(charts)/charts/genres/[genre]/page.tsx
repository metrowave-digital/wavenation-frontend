// src/app/(charts)/charts/genres/[genre]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './GenreDetailPage.module.css'
import { getChartsByGenre } from '../../../../lib/charts/getChartsByGenre'
import { GenreHero } from '../components/GenreHero'
import { GenreSectionHeader } from '../components/GenreSectionHeader'
import { GenreStatsBar } from '../components/GenreStatsBar'
import { GenreChartGrid } from '../components/GenreChartGrid'
import { getGenreConfig } from '../components/genre.config'
import {
  getCurrentChart,
  sortChartsByPublishDateDesc,
  type ChartDoc,
} from '../components/genre.utils'

type Props = {
  params: Promise<{ genre: string }>
}

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)

  if (!config) {
    return {
      title: 'Genre Chart | WaveNation',
    }
  }

  return {
    title: `${config.title} Charts | WaveNation`,
    description: config.description,
  }
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
      <div className={styles.container}>
        <GenreHero
          eyebrow={config.eyebrow}
          title={config.title}
          description={config.description}
          currentHref={`/charts/genres/${config.slug}/current`}
          archiveHref={`/charts/genres/${config.slug}/archive`}
          publishDate={current?.publishDate}
          weekLabel={current?.week ?? 'Current'}
        />

        <GenreStatsBar
          items={[
            { label: 'Chart cadence', value: 'Weekly' },
            { label: 'Published issues', value: sorted.length },
            { label: 'Current week', value: current?.week ?? '—' },
            { label: 'Current entries', value: current?.entries?.length ?? 0 },
          ]}
        />

        <section className={styles.section}>
          <GenreSectionHeader
            eyebrow="Quick access"
            title={`Explore ${config.shortTitle}`}
            description="Move quickly between the latest published chart and the full archive."
          />

          <div className={styles.pathGrid}>
            <Link
              href={`/charts/genres/${config.slug}/current`}
              className={styles.pathCard}
            >
              <span className={styles.pathEyebrow}>Now live</span>
              <strong className={styles.pathTitle}>Current chart</strong>
              <span className={styles.pathText}>
                Open the newest published {config.shortTitle} week.
              </span>
            </Link>

            <Link
              href={`/charts/genres/${config.slug}/archive`}
              className={styles.pathCard}
            >
              <span className={styles.pathEyebrow}>History</span>
              <strong className={styles.pathTitle}>Archive</strong>
              <span className={styles.pathText}>
                Browse past weeks and previous chart drops.
              </span>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <GenreSectionHeader
            eyebrow="Recent chart issues"
            title={`Recent ${config.shortTitle} weeks`}
            description="Quick entry points into the latest published chart issues."
          />

          <GenreChartGrid
            items={sorted.slice(0, 6).map((chart) => ({
              slug: chart.slug,
              week: chart.week,
              publishDate: chart.publishDate,
              href: `/charts/${chart.slug}`,
            }))}
          />
        </section>
      </div>
    </main>
  )
}