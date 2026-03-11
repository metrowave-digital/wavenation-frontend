import Link from 'next/link'
import styles from './HitlistLanding.module.css'
import { HitlistHero } from './components/HitlistHero'
import { HitlistMetaBar } from './components/HitlistMetaBar'
import { HitlistArchiveGrid } from './components/HitlistArchiveGrid'
import { HitlistSectionHeader } from './components/HitlistSectionHeader'
import {
  getAvailableYears,
  getCurrentHitlist,
  sortChartsByPublishDateDesc,
  type ChartDoc,
} from './components/hitlist.utils'
import { getChartsByGenre } from '../../../lib/charts/getChartsByGenre'
import { getChartMetrics } from '../../../lib/charts/getChartMetrics'
import type { ChartSnapshot } from '../../../lib/charts/chartMetrics'

export const metadata = {
  title: 'Hitlist | WaveNation',
  description:
    'Explore the WaveNation Hitlist — our flagship weekly chart tracking the songs moving culture right now.',
}

export const revalidate = 300

export default async function HitlistLandingPage() {
  const charts = (await getChartsByGenre('hitlist')) as ChartDoc[]
  const sorted = sortChartsByPublishDateDesc(charts)
  const current = getCurrentHitlist(sorted)
  const years = getAvailableYears(sorted)

  const metrics = current ? await safeGetMetrics(current.slug) : null

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <HitlistHero
          title="The Hitlist"
          description="WaveNation’s flagship ranking of the records making the biggest audience, editorial, and cultural impact right now."
          publishDate={current?.publishDate}
          weekLabel={current?.week ?? 'Current'}
        />

        <HitlistMetaBar
          items={[
            { label: 'Chart type', value: 'Weekly' },
            { label: 'Genre mix', value: 'Multi-genre' },
            { label: 'Current week', value: current?.week ?? '—' },
            {
              label: 'Tracked entries',
              value: readMetric(metrics, 'entryCount', 20),
            },
          ]}
        />

        <section className={styles.section}>
          <HitlistSectionHeader
            eyebrow="Start here"
            title="Choose your path"
            description="Jump into the newest rankings, browse previous weeks, or explore a specific chart issue by slug."
          />

          <div className={styles.pathGrid}>
            <Link href="/charts/hitlist/current" className={styles.pathCard}>
              <span className={styles.pathEyebrow}>Now live</span>
              <strong className={styles.pathTitle}>Current chart</strong>
              <span className={styles.pathText}>See the latest published Hitlist week.</span>
            </Link>

            <Link href="/charts/hitlist/archive" className={styles.pathCard}>
              <span className={styles.pathEyebrow}>History</span>
              <strong className={styles.pathTitle}>Archive</strong>
              <span className={styles.pathText}>Browse by year and drill down by week.</span>
            </Link>

            {current ? (
              <Link href={`/charts/hitlist/${current.slug}`} className={styles.pathCard}>
                <span className={styles.pathEyebrow}>Direct access</span>
                <strong className={styles.pathTitle}>{current.slug}</strong>
                <span className={styles.pathText}>Open the current chart detail route.</span>
              </Link>
            ) : null}
          </div>
        </section>

        <section className={styles.section}>
          <HitlistSectionHeader
            eyebrow="Archive years"
            title="Browse the archive by year"
            description="Each archive year groups all published Hitlist weekly chart editions using your slug format."
          />

          <div className={styles.yearGrid}>
            {years.map((year) => (
              <Link
                key={year}
                href={`/charts/hitlist/archive/${year}`}
                className={styles.yearCard}
              >
                {year}
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <HitlistSectionHeader
            eyebrow="Recent weeks"
            title="Recently published Hitlist issues"
            description="Quick access to the newest chart drops."
          />
          <HitlistArchiveGrid items={sorted.slice(0, 6)} />
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