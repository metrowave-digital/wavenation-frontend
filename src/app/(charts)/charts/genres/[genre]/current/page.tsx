// src/app/(charts)/charts/genres/[genre]/current/page.tsx

import { notFound } from 'next/navigation'
import styles from './GenreCurrentPage.module.css'
import { getChartsByGenre } from '../../../../../lib/charts/getChartsByGenre'
import { GenreHero } from '../../components/GenreHero'
import { GenreStatsBar } from '../../components/GenreStatsBar'
import { GenreEntryTable } from '../../components/GenreEntryTable'
import { getGenreConfig } from '../../components/genre.config'
import {
  getCurrentChart,
  sortChartsByPublishDateDesc,
  formatPublishDate,
  type ChartDoc,
} from '../../components/genre.utils'

type Props = {
  params: Promise<{ genre: string }>
}

export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  const config = getGenreConfig(genre)

  if (!config) {
    return {
      title: 'Current Genre Chart | WaveNation',
    }
  }

  return {
    title: `${config.title} Current Chart | WaveNation`,
    description: `The latest published ${config.title} chart on WaveNation.`,
  }
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
      <div className={styles.container}>
        <GenreHero
          eyebrow={config.eyebrow}
          title={`${config.title} — ${current.week}`}
          description={`The newest published ${config.title} chart issue on WaveNation.`}
          currentHref={`/charts/genres/${config.slug}/current`}
          archiveHref={`/charts/genres/${config.slug}/archive`}
          publishDate={current.publishDate}
          weekLabel={current.week}
        />

        <GenreStatsBar
          items={[
            { label: 'Week', value: current.week },
            { label: 'Publish date', value: formatPublishDate(current.publishDate) },
            { label: 'Entries', value: current.entries.length },
            { label: 'Slug', value: current.slug },
          ]}
        />

        <GenreEntryTable
          entries={current.entries}
          caption={`${config.title} current chart`}
        />
      </div>
    </main>
  )
}