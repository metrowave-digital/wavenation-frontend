import Link from 'next/link'
import styles from './ChartHero.module.css'
import type { ChartEntry } from '../../../lib/charts/getChartsByGenre'

type ChartHeroAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

type ChartHeroVariantKey =
  | 'home'
  | 'hitlist'
  | 'trending'
  | 'features'
  | 'methodology'
  | 'genre'

type ChartHeroVariant = {
  eyebrow: string
  title: string
  description: string
  metaLabel: string
  metaValue: string
  actions: ChartHeroAction[]
  fallbackEntries: ChartEntry[]
}

const HERO_VARIANTS: Record<ChartHeroVariantKey, ChartHeroVariant> = {
  home: {
    eyebrow: 'WaveNation Charts',
    title: 'Follow what is rising, leading, and shifting the culture.',
    description:
      'The Charts hub brings together WaveNation’s flagship rankings, genre-specific movement, breakout artist watchlists, and editorial analysis so audiences can see what is truly connecting in the moment.',
    metaLabel: 'Charts view',
    metaValue: 'Current week',
    actions: [
      {
        label: 'View Hitlist 20',
        href: '/charts/hitlist/current',
        variant: 'primary',
      },
      {
        label: 'Explore trending',
        href: '/charts/trending',
        variant: 'secondary',
      },
    ],
    fallbackEntries: [
      { rank: 1, trackTitle: 'Culture Code', artist: 'Avery Lane' },
      { rank: 2, trackTitle: 'After Midnight', artist: 'Sol Renée' },
      { rank: 3, trackTitle: 'No Static', artist: 'J. Marrow' },
    ],
  },

  hitlist: {
    eyebrow: 'Hitlist 20',
    title: 'The flagship ranking for records making the biggest impact right now.',
    description:
      'Hitlist 20 is WaveNation’s headline chart experience, built to spotlight the songs driving conversation, audience energy, and cultural momentum across the ecosystem.',
    metaLabel: 'Hitlist update',
    metaValue: 'Weekly ranking',
    actions: [
      {
        label: 'View archive',
        href: '/charts/hitlist-20/archive',
        variant: 'primary',
      },
      {
        label: 'Read methodology',
        href: '/charts/methodology',
        variant: 'secondary',
      },
    ],
    fallbackEntries: [
      { rank: 1, trackTitle: 'Top Floor', artist: 'Kendra Vale' },
      { rank: 2, trackTitle: 'Pressure On', artist: 'Rome Darius' },
      { rank: 3, trackTitle: 'Glow Season', artist: 'Mila J' },
    ],
  },

  trending: {
    eyebrow: 'Trending Charts',
    title: 'See which songs and artists are accelerating right now.',
    description:
      'Trending pages focus on movement, velocity, and breakout traction so audiences can spot what is gaining ground before it fully settles into the main chart picture.',
    metaLabel: 'Momentum view',
    metaValue: 'Fast risers',
    actions: [
      {
        label: 'Fast risers',
        href: '/charts/trending/fast-risers',
        variant: 'primary',
      },
      {
        label: 'Breakout artists',
        href: '/charts/trending/breakout-artists',
        variant: 'secondary',
      },
    ],
    fallbackEntries: [
      { rank: 1, trackTitle: 'Can’t Miss', artist: 'Nova Kaye' },
      { rank: 2, trackTitle: 'Late Signal', artist: 'Ty Monroe' },
      { rank: 3, trackTitle: 'Southside Glow', artist: 'Elle Mason' },
    ],
  },

  features: {
    eyebrow: 'Chart Features',
    title: 'Go beyond the rankings with editorial context and deeper chart storytelling.',
    description:
      'WaveNation chart features explain movement, highlight standout performances, and bring more clarity to the records, artists, and weekly shifts shaping the chart landscape.',
    metaLabel: 'Editorial layer',
    metaValue: 'Feature view',
    actions: [
      {
        label: 'Chart analysis',
        href: '/charts/features/chart-analysis',
        variant: 'primary',
      },
      {
        label: 'Biggest movers',
        href: '/charts/features/biggest-movers',
        variant: 'secondary',
      },
    ],
    fallbackEntries: [
      { rank: 1, trackTitle: 'Main Character', artist: 'Cleo Hart' },
      { rank: 2, trackTitle: 'Stay Loud', artist: 'Devin Cross' },
      { rank: 3, trackTitle: 'Velvet Run', artist: 'Sade Monroe' },
    ],
  },

  methodology: {
    eyebrow: 'Chart Methodology',
    title: 'The rankings matter more when the framework is visible.',
    description:
      'Methodology explains how WaveNation evaluates movement, balances signals, and maintains clarity around the structure behind each chart experience.',
    metaLabel: 'Framework',
    metaValue: 'Transparent rules',
    actions: [
      {
        label: 'View charts home',
        href: '/charts',
        variant: 'primary',
      },
      {
        label: 'Browse archive',
        href: '/charts/hitlist-20/archive',
        variant: 'secondary',
      },
    ],
    fallbackEntries: [
      { rank: 1, trackTitle: 'Signal Check', artist: 'Atlas Grey' },
      { rank: 2, trackTitle: 'Pulse Rate', artist: 'Nia Sterling' },
      { rank: 3, trackTitle: 'Ranked Right', artist: 'Jordan Rue' },
    ],
  },

  genre: {
    eyebrow: 'Genre Charts',
    title: 'Track movement inside the lanes shaping the WaveNation sound.',
    description:
      'Genre chart pages spotlight the records, artists, and momentum shifts defining each musical lane, giving audiences a focused view into what is connecting most.',
    metaLabel: 'Genre leaders',
    metaValue: 'Current week',
    actions: [
      {
        label: 'View trending',
        href: '/charts/trending',
        variant: 'primary',
      },
      {
        label: 'Read features',
        href: '/charts/features',
        variant: 'secondary',
      },
    ],
    fallbackEntries: [
      { rank: 1, trackTitle: 'Golden Hour', artist: 'Rae Ellis' },
      { rank: 2, trackTitle: 'Holy Fire', artist: 'King Justice' },
      { rank: 3, trackTitle: 'Backroad Groove', artist: 'June Carter II' },
    ],
  },
}

export type ChartHeroProps = {
  variant?: ChartHeroVariantKey
  eyebrow?: string
  title?: string
  description?: string
  metaLabel?: string
  metaValue?: string
  actions?: ChartHeroAction[]
  entries?: ChartEntry[]
  className?: string
}

function resolveEntries(
  entries: ChartEntry[] | undefined,
  fallback: ChartEntry[],
): ChartEntry[] {
  const base = entries?.length ? entries : fallback

  return [...base]
    .filter(entry => typeof entry.rank === 'number')
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)
}

export function ChartHero({
  variant = 'home',
  eyebrow,
  title,
  description,
  metaLabel,
  metaValue,
  actions,
  entries,
  className,
}: ChartHeroProps) {
  const config = HERO_VARIANTS[variant]

  const resolvedEyebrow = eyebrow ?? config.eyebrow
  const resolvedTitle = title ?? config.title
  const resolvedDescription = description ?? config.description
  const resolvedMetaLabel = metaLabel ?? config.metaLabel
  const resolvedMetaValue = metaValue ?? config.metaValue
  const resolvedActions = actions ?? config.actions
  const resolvedEntries = resolveEntries(entries, config.fallbackEntries)

  const featured = resolvedEntries[0]
  const secondary = resolvedEntries.slice(1)

  return (
    <section className={`${styles.hero} ${className ?? ''}`.trim()}>
      <div className={styles.backgroundGlowA} aria-hidden="true" />
      <div className={styles.backgroundGlowB} aria-hidden="true" />
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copyColumn}>
          <div className={styles.topline}>
            <span className={styles.eyebrow}>{resolvedEyebrow}</span>
            <span className={styles.toplineDot} aria-hidden="true" />
            <span className={styles.toplineText}>{resolvedMetaValue}</span>
          </div>

          <h1 className={styles.title}>{resolvedTitle}</h1>

          <p className={styles.description}>{resolvedDescription}</p>

          {resolvedActions.length > 0 ? (
            <div className={styles.actions}>
              {resolvedActions.map(action => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={
                    action.variant === 'secondary'
                      ? styles.secondaryAction
                      : styles.primaryAction
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.chartColumn}>
          <div className={styles.metaStrip}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{resolvedMetaLabel}</span>
              <span className={styles.metaValue}>{resolvedMetaValue}</span>
            </div>

            <div className={styles.metaDivider} aria-hidden="true" />

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Now showing</span>
              <span className={styles.metaValue}>Top 3 positions</span>
            </div>
          </div>

          {featured ? (
            <article className={styles.featuredCard}>
              <div className={styles.featuredRankWrap}>
                <span className={styles.featuredRankHash}>#</span>
                <span className={styles.featuredRank}>{featured.rank}</span>
              </div>

              <div className={styles.featuredContent}>
                <span className={styles.featuredKicker}>Current leader</span>
                <h2 className={styles.featuredTitle}>{featured.trackTitle}</h2>
                <p className={styles.featuredArtist}>{featured.artist}</p>
                <p className={styles.featuredSummary}>
                  Leading the current chart conversation with visible momentum
                  and headline energy across the WaveNation ecosystem.
                </p>
              </div>
            </article>
          ) : null}

          {secondary.length > 0 ? (
            <div className={styles.secondaryList}>
              {secondary.map(entry => (
                <article
                  key={`${entry.rank}-${entry.trackTitle}-${entry.artist}`}
                  className={styles.secondaryCard}
                >
                  <div className={styles.secondaryRank}>
                    <span className={styles.secondaryRankHash}>#</span>
                    <span className={styles.secondaryRankNumber}>
                      {entry.rank}
                    </span>
                  </div>

                  <div className={styles.secondaryContent}>
                    <h3 className={styles.secondaryTitle}>{entry.trackTitle}</h3>
                    <p className={styles.secondaryArtist}>{entry.artist}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}