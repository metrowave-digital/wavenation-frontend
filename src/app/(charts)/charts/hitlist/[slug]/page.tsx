import { notFound } from 'next/navigation'
import styles from './HitlistDetailPage.module.css'
import { HitlistMetaBar } from '../components/HitlistMetaBar'
import { HitlistEntryTable } from '../components/HitlistEntryTable'
import { formatPublishDate } from '../components/hitlist.utils'
import { getChartBySlug } from '../../../../lib/charts/getChartBySlug'
import { getChartMetrics } from '../../../../lib/charts/getChartMetrics'
import type { ChartSnapshot } from '../../../../lib/charts/chartMetrics'

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
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  return {
    title: `${slug} | Hitlist | WaveNation`,
    description: `WaveNation chart detail page for ${slug}.`,
  }
}

export const revalidate = 300

export default async function HitlistDetailPage({ params }: Props) {
  const { slug } = await params
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) notFound()

  const metrics = await safeGetMetrics(slug)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Chart issue</span>
          <h1 className={styles.title}>{chart.slug}</h1>
          <p className={styles.description}>
            WaveNation Hitlist issue for {chart.week}, published {formatPublishDate(chart.publishDate)}.
          </p>
        </header>

        <HitlistMetaBar
          items={[
            { label: 'Week', value: chart.week },
            { label: 'Publish date', value: formatPublishDate(chart.publishDate) },
            {
              label: 'Entries',
              value: readMetric(metrics, 'entryCount', chart.entries.length),
            },
            { label: 'Slug', value: chart.slug },
          ]}
        />

        <HitlistEntryTable
          entries={chart.entries}
          caption={`WaveNation chart issue ${chart.slug}`}
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