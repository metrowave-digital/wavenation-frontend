import Link from 'next/link'
import styles from './CoreCharts.module.css'
import {
  getChartsByGenre,
  type ChartDoc,
  type ChartEntry,
} from '../../../lib/charts/getChartsByGenre'

type ChartTone = 'hitlist' | 'rnb' | 'hiphop' | 'gospel' | 'house'

type CoreChartConfig = {
  key: string
  title: string
  href: string
  eyebrow: string
  description: string
  badge?: string
  featured?: boolean
  tags: string[]
  tone: ChartTone
}

type CoreChartsProps = {
  className?: string
  title?: string
  eyebrow?: string
  description?: string
}

type BuiltChartCard = {
  key: string
  title: string
  href: string
  eyebrow: string
  description: string
  badge?: string
  featured?: boolean
  tags: string[]
  tone: ChartTone
  latest: ChartDoc | null
  topThree: ChartEntry[]
}

const CHARTS: CoreChartConfig[] = [
  {
    key: 'hitlist',
    title: 'Hitlist 20',
    href: '/charts/hitlist/current',
    eyebrow: 'Flagship chart',
    description:
      'WaveNation’s headline ranking focused on the songs making the biggest cultural and audience impact right now.',
    badge: 'Weekly',
    featured: true,
    tags: ['Culture leaders', 'Breakout momentum', 'Weekly ranking'],
    tone: 'hitlist',
  },
  {
    key: 'rnb-soul',
    title: 'R&B / Soul',
    href: '/charts/genres/rnb-soul/current',
    eyebrow: 'Genre chart',
    description:
      'Track leading records shaping the current R&B and soul lane across WaveNation.',
    badge: 'Current',
    tags: ['Neo-soul', 'Adult R&B', 'Slow jams'],
    tone: 'rnb',
  },
  {
    key: 'hip-hop',
    title: 'Hip-Hop',
    href: '/charts/genres/hip-hop/current',
    eyebrow: 'Genre chart',
    description:
      'See the records pushing conversation, movement, and momentum in hip-hop.',
    badge: 'Current',
    tags: ['Southern rap', 'Trap', 'Viral records'],
    tone: 'hiphop',
  },
  {
    key: 'gospel',
    title: 'Gospel',
    href: '/charts/genres/gospel/current',
    eyebrow: 'Genre chart',
    description:
      'Follow the songs defining inspiration, impact, and audience connection in gospel.',
    badge: 'Current',
    tags: ['Urban gospel', 'Praise', 'Inspirational'],
    tone: 'gospel',
  },
  {
    key: 'house',
    title: 'House',
    href: '/charts/genres/house/current',
    eyebrow: 'Genre chart',
    description:
      'Track house records, club energy, rhythmic movement, and dancefloor-driven momentum across the WaveNation ecosystem.',
    badge: 'New',
    tags: ['Dancefloor', 'Afro-house', 'Night movement'],
    tone: 'house',
  },
]

function formatChartDate(dateString?: string | null): string {
  if (!dateString) return 'Unavailable'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Unavailable'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatWeekLabel(week?: string | null): string {
  return week || 'Current'
}

function buildCards(chartDocs: ChartDoc[][]): BuiltChartCard[] {
  return CHARTS.map((config, index) => {
    const docs = chartDocs[index] ?? []
    const latest = docs[0] ?? null
    const topThree = latest?.entries?.slice(0, 3) ?? []

    return {
      ...config,
      latest,
      topThree,
    }
  })
}

function getToneClass(tone: ChartTone): string {
  switch (tone) {
    case 'hitlist':
      return styles.toneHitlist
    case 'rnb':
      return styles.toneRnb
    case 'hiphop':
      return styles.toneHipHop
    case 'gospel':
      return styles.toneGospel
    case 'house':
      return styles.toneHouse
    default:
      return ''
  }
}

function ChartTags({
  tags,
  tone,
}: {
  tags: string[]
  tone: ChartTone
}) {
  if (!tags.length) return null

  return (
    <div className={styles.tagRow}>
      {tags.map(tag => (
        <span key={tag} className={`${styles.tag} ${getToneClass(tone)}`}>
          {tag}
        </span>
      ))}
    </div>
  )
}

function ChartStats({
  latest,
  tone,
}: {
  latest: ChartDoc | null
  tone: ChartTone
}) {
  return (
    <div className={styles.statsRow}>
      <div className={`${styles.stat} ${getToneClass(tone)}`}>
        <span className={styles.statLabel}>Week</span>
        <span className={styles.statValue}>{formatWeekLabel(latest?.week)}</span>
      </div>

      <div className={`${styles.stat} ${getToneClass(tone)}`}>
        <span className={styles.statLabel}>Entries</span>
        <span className={styles.statValue}>{latest?.entries?.length ?? 0}</span>
      </div>

      <div className={`${styles.stat} ${getToneClass(tone)}`}>
        <span className={styles.statLabel}>Updated</span>
        <span className={styles.statValue}>{formatChartDate(latest?.publishDate)}</span>
      </div>
    </div>
  )
}

function ChartPreviewList({
  entries,
  tone,
}: {
  entries: ChartEntry[]
  tone: ChartTone
}) {
  if (!entries.length) {
    return (
      <div className={styles.previewEmpty}>
        Latest rankings will appear here once a chart is published.
      </div>
    )
  }

  return (
    <div className={styles.previewList}>
      {entries.map(entry => (
        <div
          key={`${entry.rank}-${entry.trackTitle}-${entry.artist}`}
          className={`${styles.previewRow} ${getToneClass(tone)}`}
        >
          <span className={`${styles.previewRank} ${getToneClass(tone)}`}>
            {entry.rank}
          </span>

          <div className={styles.previewMeta}>
            <span className={styles.previewTitle}>{entry.trackTitle}</span>
            <span className={styles.previewArtist}>{entry.artist}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function LeadChartCard({ card }: { card: BuiltChartCard }) {
  return (
    <Link
      href={card.href}
      className={`${styles.card} ${styles.leadCard} ${getToneClass(card.tone)}`}
    >
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.cardEyebrow}>{card.eyebrow}</span>
          <h3 className={styles.leadTitle}>{card.title}</h3>
        </div>

        {card.badge ? <span className={styles.badge}>{card.badge}</span> : null}
      </div>

      <p className={styles.leadDescription}>{card.description}</p>

      <ChartTags tags={card.tags} tone={card.tone} />
      <ChartStats latest={card.latest} tone={card.tone} />

      <div className={styles.leadBody}>
        <div className={styles.leadPreview}>
          <div className={styles.blockHeader}>
            <span className={styles.blockEyebrow}>Top 3 this week</span>
          </div>
          <ChartPreviewList entries={card.topThree} tone={card.tone} />
        </div>

        <div className={`${styles.leadAside} ${getToneClass(card.tone)}`}>
          <span className={styles.leadAsideEyebrow}>Why it matters</span>
          <p className={styles.leadAsideText}>
            Start here for the broadest snapshot of what is leading the culture
            across momentum, visibility, and audience attention.
          </p>

          <span className={styles.cta}>View rankings</span>
        </div>
      </div>
    </Link>
  )
}

function GenreChartCard({ card }: { card: BuiltChartCard }) {
  return (
    <Link
      href={card.href}
      className={`${styles.card} ${styles.genreCard} ${getToneClass(card.tone)}`}
    >
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.cardEyebrow}>{card.eyebrow}</span>
          <h3 className={styles.cardTitle}>{card.title}</h3>
        </div>

        {card.badge ? <span className={styles.badge}>{card.badge}</span> : null}
      </div>

      <p className={styles.cardDescription}>{card.description}</p>

      <ChartTags tags={card.tags} tone={card.tone} />
      <ChartStats latest={card.latest} tone={card.tone} />

      <div className={styles.blockHeader}>
        <span className={styles.blockEyebrow}>Now leading</span>
      </div>

      <ChartPreviewList entries={card.topThree} tone={card.tone} />

      <span className={styles.cta}>Open chart</span>
    </Link>
  )
}

export async function CoreCharts({
  className,
  title = 'Start with the main lanes',
  eyebrow = 'Core charts',
  description = 'Move through the foundational WaveNation chart destinations with live snapshots from the latest published rankings.',
}: CoreChartsProps) {
  const chartDocs = await Promise.all(
    CHARTS.map(chart => getChartsByGenre(chart.key)),
  )

  const cards = buildCards(chartDocs)
  const leadCard = cards.find(card => card.featured) ?? cards[0]
  const genreCards = cards.filter(card => card.key !== leadCard.key)

  return (
    <section className={`${styles.section} ${className ?? ''}`.trim()}>
      <div className={styles.shell}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>{eyebrow}</span>
            <h2 className={styles.sectionTitle}>{title}</h2>
          </div>

          <p className={styles.sectionText}>{description}</p>
        </div>

        <div className={styles.rail}>
          <LeadChartCard card={leadCard} />

          <div className={styles.genreGrid}>
            {genreCards.map(card => (
              <GenreChartCard key={card.key} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}