// src/app/(charts)/charts/genres/[genre]/archive/page.tsx

import { notFound } from 'next/navigation'
import styles from './GenreArchivePage.module.css'
import { getChartsByGenre } from '../../../../../lib/charts/getChartsByGenre'
import { GenreSectionHeader } from '../../components/GenreSectionHeader'
import { GenreChartGrid } from '../../components/GenreChartGrid'
import { getGenreConfig } from '../../components/genre.config'
import {
  sortChartsByPublishDateDesc,
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
      title: 'Genre Archive | WaveNation',
    }
  }

  return {
    title: `${config.title} Archive | WaveNation`,
    description: `Browse archived ${config.title} chart issues on WaveNation.`,
  }
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
      <div className={styles.container}>
        <GenreSectionHeader
          eyebrow="Archive"
          title={`${config.title} archive`}
          description={`Browse every published ${config.title} chart issue.`}
        />

        <GenreChartGrid
          items={sorted.map((chart) => ({
            slug: chart.slug,
            week: chart.week,
            publishDate: chart.publishDate,
            href: `/charts/${chart.slug}`,
          }))}
        />
      </div>
    </main>
  )
}