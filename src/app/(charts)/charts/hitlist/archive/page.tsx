// app/(charts)/charts/hitlist/archive/page.tsx

import Link from 'next/link'
import styles from './HitlistArchivePage.module.css'
import { HitlistSectionHeader } from '../components/HitlistSectionHeader'
import {
  getAvailableYears,
  type ChartDoc,
} from '../components/hitlist.utils'
import { getChartsByGenre } from '../../../../lib/charts/getChartsByGenre'

export const metadata = {
  title: 'Hitlist Archive | WaveNation',
  description: 'Browse the full WaveNation Hitlist archive by year.',
}

export const revalidate = 300

export default async function HitlistArchivePage() {
  const charts = (await getChartsByGenre('hitlist')) as ChartDoc[]
  const years = getAvailableYears(charts)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <HitlistSectionHeader
          eyebrow="Hitlist archive"
          title="Browse archived Hitlist years"
          description="Select a year to explore each published weekly chart issue."
        />

        <div className={styles.grid}>
          {years.map((year) => (
            <Link key={year} href={`/charts/hitlist/archive/${year}`} className={styles.card}>
              <span className={styles.label}>Archive year</span>
              <strong className={styles.year}>{year}</strong>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}