import Link from 'next/link'
import styles from './ChartsPage.module.css'
import { ChartHeroCMS } from '../components/ChartHero/ChartHeroCMS'
import { ChartMetaBar } from '../components/ChartHero/ChartMetaBar'
import { CoreCharts } from '../components/CoreCharts/CoreCharts'
import {
  ChartsSpotlight,
  type ChartsSpotlightItem,
} from '../components/ChartsSpotlight/ChartsSpotlight'

export const metadata = {
  title: 'Charts | WaveNation',
  description:
    'Explore WaveNation charts including Hitlist 20, genre charts, trending movements, breakout artists, and chart methodology.',
}

const spotlightItems: ChartsSpotlightItem[] = [
  {
    category: 'Trending',
    title: 'Fast Risers',
    href: '/charts/trending/fast-risers',
    description:
      'A closer look at records gaining serious traction this week across visibility, conversation, and audience movement.',
    badge: 'Movement',
    featured: true,
    ctaLabel: 'Track movement',
  },
  {
    category: 'Features',
    title: 'Biggest Movers',
    href: '/charts/features/biggest-movers',
    description:
      'Editorial analysis around chart jumps, drops, and the stories shaping the strongest shifts.',
    badge: 'Editorial',
    ctaLabel: 'Read feature',
  },
  {
    category: 'Methodology',
    title: 'How WaveNation Charts Work',
    href: '/charts/methodology',
    description:
      'Understand the framework, cadence, and ranking logic behind the WaveNation chart ecosystem.',
    badge: 'Framework',
    ctaLabel: 'View methodology',
  },
]

export default async function ChartsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <ChartHeroCMS
          chartKey="hitlist"
          variant="home"
          eyebrow="WaveNation Charts"
          title="The charts hub for what is leading, rising, and reshaping the culture."
          description="Track the records defining the moment across Hitlist 20, genre rankings, trending movement, and editorial chart analysis."
          metaLabel="Charts snapshot"
        />

        <ChartMetaBar
          className={styles.metaBar}
          items={[
            { label: 'Flagship', value: 'Hitlist 20' },
            { label: 'Genre lanes', value: 'R&B, hip-hop, gospel, house' },
            { label: 'Update cadence', value: 'Weekly' },
            { label: 'Coverage', value: 'Charts, trending, features' },
          ]}
          action={{
            label: 'Read methodology',
            href: '/charts/methodology',
          }}
        />

        <CoreCharts className={styles.section} />

        <ChartsSpotlight
          className={styles.section}
          items={spotlightItems}
        />

        <section className={styles.bottomCta}>
          <div className={styles.bottomCtaInner}>
            <div className={styles.bottomCopy}>
              <span className={styles.bottomEyebrow}>Trust the framework</span>
              <h2 className={styles.bottomTitle}>
                Rankings work better when the rules are visible.
              </h2>
              <p className={styles.bottomText}>
                Explore the methodology, review chart archives, and follow the
                weekly movement with more clarity and context across the
                WaveNation ecosystem.
              </p>
            </div>

            <div className={styles.bottomActions}>
              <Link href="/charts/methodology" className={styles.primaryCta}>
                View methodology
              </Link>
              <Link
                href="/charts/hitlist/archive"
                className={styles.secondaryCta}
              >
                Browse archive
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}