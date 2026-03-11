// app/(charts)/charts/hitlist/archive/[year]/page.tsx

import { notFound } from 'next/navigation'
import styles from './HitlistArchiveYearPage.module.css'
import { HitlistArchiveGrid } from '../../components/HitlistArchiveGrid'
import { HitlistSectionHeader } from '../../components/HitlistSectionHeader'
import {
  getWeeksForYear,
  type ChartDoc,
} from '../../components/hitlist.utils'
import { getChartsByGenre } from '../../../../../lib/charts/getChartsByGenre'

type Props = {
  params: Promise<{ year: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year } = await params

  return {
    title: `Hitlist Archive ${year} | WaveNation`,
    description: `Browse all archived WaveNation Hitlist weekly chart issues for ${year}.`,
  }
}

export const revalidate = 300

export default async function HitlistArchiveYearPage({ params }: Props) {
  const { year } = await params
  const charts = (await getChartsByGenre('hitlist')) as ChartDoc[]
  const yearCharts = getWeeksForYear(charts, year)

  if (!yearCharts.length) notFound()

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <HitlistSectionHeader
          eyebrow="Archive year"
          title={`Hitlist ${year}`}
          description="Select a chart week to open the archived issue."
        />

        <HitlistArchiveGrid
          items={yearCharts}
          hrefBase={`/charts/hitlist/archive/${year}`}
          mode="week"
        />
      </div>
    </main>
  )
}