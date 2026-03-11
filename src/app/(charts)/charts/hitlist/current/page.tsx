import { notFound } from 'next/navigation'
import styles from './HitlistCurrentPage.module.css'
import { HitlistHero } from '../components/HitlistHero'
import { HitlistMetaBar } from '../components/HitlistMetaBar'
import { HitlistEntryTable } from '../components/HitlistEntryTable'
import {
  getCurrentHitlist,
  sortChartsByPublishDateDesc,
  type ChartDoc,
} from '../components/hitlist.utils'
import { getChartsByGenre } from '../../../../lib/charts/getChartsByGenre'
import { getChartMetrics } from '../../../../lib/charts/getChartMetrics'
import type { ChartSnapshot } from '../../../../lib/charts/chartMetrics'

export const metadata = {
  title: 'Current Hitlist | WaveNation',
  description: 'The latest published edition of the WaveNation Hitlist.',
}

export const revalidate = 300

export default async function HitlistCurrentPage() {
  const charts = (await getChartsByGenre('hitlist')) as ChartDoc[]
  const current = getCurrentHitlist(sortChartsByPublishDateDesc(charts))

  if (!current) notFound()

  const metrics = await safeGetMetrics(current.slug)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <HitlistHero
          title={`The Hitlist — ${current.week}`}
          description="The newest published WaveNation Hitlist ranking, built for quick scan and full chart exploration."
          publishDate={current.publishDate}
          weekLabel={current.week}
          currentLabel="You’re viewing current"
        />

        <HitlistMetaBar
          items={[
            { label: 'Week', value: current.week },
            { label: 'Publish date', value: formatMetricDate(current.publishDate) },
            {
              label: 'Entries',
              value: readMetric(metrics, 'entryCount', current.entries.length),
            },
            { label: 'Slug', value: current.slug },
          ]}
        />

        <section className={styles.section}>
          <HitlistEntryTable
            entries={current.entries}
            caption={`WaveNation Hitlist ${current.week}`}
          />
        </section>
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

function formatMetricDate(date?: string | null) {
  if (!date) return 'Date TBA'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}