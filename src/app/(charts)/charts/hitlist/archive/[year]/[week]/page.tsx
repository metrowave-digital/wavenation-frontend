import { notFound } from 'next/navigation'
import styles from './HitlistArchiveWeekPage.module.css'
import { HitlistMetaBar } from '../../../components/HitlistMetaBar'
import { HitlistEntryTable } from '../../../components/HitlistEntryTable'
import { buildHitlistSlug, formatPublishDate } from '../../../components/hitlist.utils'
import { getChartBySlug } from '../../../../../../lib/charts/getChartBySlug'
import { getChartMetrics } from '../../../../../../lib/charts/getChartMetrics'
import type { ChartSnapshot } from '../../../../../../lib/charts/chartMetrics'

type Entry = {
  rank: number
  trackTitle: string
  artist: string
}

type ChartDoc = {
  id: string
  slug: string
  week: string
  publishDate: string
  entries: Entry[]
}

type Props = {
  params: Promise<{ year: string; week: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year, week } = await params
  const normalizedWeek = week.toUpperCase()

  return {
    title: `Hitlist ${year} ${normalizedWeek} | WaveNation`,
    description: `Archived WaveNation Hitlist chart for ${year} ${normalizedWeek}.`,
  }
}

export const revalidate = 300

export default async function HitlistArchiveWeekPage({ params }: Props) {
  const { year, week } = await params
  const slug = buildHitlistSlug(year, week)
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) notFound()

  const metrics = await safeGetMetrics(slug)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Archived chart week</span>
          <h1 className={styles.title}>
            Hitlist {year} {chart.week}
          </h1>
          <p className={styles.description}>
            Archived weekly WaveNation Hitlist issue published {formatPublishDate(chart.publishDate)}.
          </p>
        </header>

        <HitlistMetaBar
          items={[
            { label: 'Week', value: chart.week },
            { label: 'Year', value: year },
            { label: 'Slug', value: chart.slug },
            {
              label: 'Entries',
              value: readMetric(metrics, 'entryCount', chart.entries.length),
            },
          ]}
        />

        <HitlistEntryTable
          entries={chart.entries}
          caption={`WaveNation Hitlist archive ${chart.week}`}
        />
      </div>
    </main>
  )
}

async function safeGetMetrics(slug: string): Promise<ChartSnapshot | null> {
  try {
    return await getChartMetrics(slug)
  } catch {
    return null
  }
}

function readMetric(
  metrics: ChartSnapshot | null,
  key: keyof ChartSnapshot,
  fallback: string | number,
): string | number {
  if (!metrics) return fallback

  const value = metrics[key]
  return typeof value === 'string' || typeof value === 'number'
    ? value
    : fallback
}