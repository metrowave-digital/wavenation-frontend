import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './ChartDetailPage.module.css'

import { getChartBySlug } from '../../../lib/charts/getChartBySlug'
import { formatPublishDate } from '../genres/components/genre.utils'

type ChartEntry = {
  rank: number
  trackTitle: string
  artist: string
}

type ChartDoc = {
  id: string
  slug: string
  chartKey: string
  week: string
  publishDate: string
  entries: ChartEntry[]
}

type Props = {
  params: Promise<{ slug: string }>
}

type ChartRouteMeta = {
  chartLabel: string
  parentHref: string
  parentLabel: string
  currentHref: string
  archiveHref: string
  title: string
  description: string
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) {
    return {
      title: 'Chart Not Found | WaveNation',
    }
  }

  const routeMeta = getChartRouteMeta(chart)

  return {
    title: `${routeMeta.title} | WaveNation`,
    description: routeMeta.description,
  }
}

export const revalidate = 300

export default async function ChartDetailPage({ params }: Props) {
  const { slug } = await params
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) notFound()

  const routeMeta = getChartRouteMeta(chart)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/charts" className={styles.breadcrumbLink}>
            Charts
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href={routeMeta.parentHref} className={styles.breadcrumbLink}>
            {routeMeta.parentLabel}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{chart.slug}</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{routeMeta.chartLabel}</span>
            <h1 className={styles.title}>{routeMeta.title}</h1>
            <p className={styles.description}>{routeMeta.description}</p>

            <div className={styles.actions}>
              <Link href={routeMeta.currentHref} className={styles.primaryCta}>
                View current
              </Link>
              <Link href={routeMeta.archiveHref} className={styles.secondaryCta}>
                Browse archive
              </Link>
            </div>
          </div>

          <aside className={styles.metaPanel}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Chart key</span>
              <strong className={styles.metaValue}>{chart.chartKey}</strong>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Week</span>
              <strong className={styles.metaValue}>{chart.week}</strong>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Published</span>
              <strong className={styles.metaValue}>
                {formatPublishDate(chart.publishDate)}
              </strong>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Entries</span>
              <strong className={styles.metaValue}>{chart.entries.length}</strong>
            </div>
          </aside>
        </header>

        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <span className={styles.tableEyebrow}>Weekly ranking</span>
            <h2 className={styles.tableTitle}>Chart entries</h2>
            <p className={styles.tableDescription}>
              The full published chart for {chart.week}.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.caption}>{chart.slug}</caption>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Track</th>
                  <th scope="col">Artist</th>
                </tr>
              </thead>
              <tbody>
                {chart.entries.map((entry) => (
                  <tr
                    key={`${chart.slug}-${entry.rank}-${entry.trackTitle}-${entry.artist}`}
                  >
                    <td className={styles.rank}>#{entry.rank}</td>
                    <td className={styles.track}>{entry.trackTitle}</td>
                    <td className={styles.artist}>{entry.artist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function getChartRouteMeta(chart: ChartDoc): ChartRouteMeta {
  if (chart.chartKey === 'hitlist') {
    return {
      chartLabel: 'Flagship chart',
      parentHref: '/charts/hitlist',
      parentLabel: 'Hitlist',
      currentHref: '/charts/hitlist/current',
      archiveHref: '/charts/hitlist/archive',
      title: `The Hitlist — ${chart.week}`,
      description:
        'WaveNation’s flagship weekly ranking tracking the songs making the strongest audience, editorial, and cultural impact right now.',
    }
  }

  const genreMap: Record<
    string,
    { title: string; label: string; slug: string; description: string }
  > = {
    'rnb-soul': {
      title: 'R&B / Soul',
      label: 'Genre chart',
      slug: 'rnb-soul',
      description:
        'A weekly chart spotlighting the songs shaping R&B and soul momentum across WaveNation.',
    },
    'hip-hop': {
      title: 'Hip-Hop',
      label: 'Genre chart',
      slug: 'hip-hop',
      description:
        'A weekly chart focused on the records driving hip-hop conversation and movement right now.',
    },
    'southern-soul': {
      title: 'Southern Soul',
      label: 'Genre chart',
      slug: 'southern-soul',
      description:
        'A weekly chart dedicated to the records powering Southern Soul culture and audience loyalty.',
    },
    gospel: {
      title: 'Gospel',
      label: 'Genre chart',
      slug: 'gospel',
      description:
        'A weekly chart tracking the songs and artists moving gospel listeners and praise-centered culture.',
    },
    house: {
      title: 'House',
      label: 'Genre chart',
      slug: 'house',
      description:
        'A weekly chart tracking the records creating movement, discovery, and energy in house culture.',
    },
  }

  const genre = genreMap[chart.chartKey]

  if (genre) {
    return {
      chartLabel: genre.label,
      parentHref: `/charts/genres/${genre.slug}`,
      parentLabel: genre.title,
      currentHref: `/charts/genres/${genre.slug}/current`,
      archiveHref: `/charts/genres/${genre.slug}/archive`,
      title: `${genre.title} — ${chart.week}`,
      description: genre.description,
    }
  }

  return {
    chartLabel: 'Chart issue',
    parentHref: '/charts',
    parentLabel: 'Charts',
    currentHref: '/charts',
    archiveHref: '/charts',
    title: `${chart.chartKey} — ${chart.week}`,
    description: 'Explore this published WaveNation chart issue.',
  }
}