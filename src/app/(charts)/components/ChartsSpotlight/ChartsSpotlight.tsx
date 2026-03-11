import Link from 'next/link'
import styles from './ChartsSpotlight.module.css'

export type ChartsSpotlightItem = {
  category: string
  title: string
  href: string
  description: string
  badge?: string
  featured?: boolean
  ctaLabel?: string
}

type ChartsSpotlightProps = {
  className?: string
  eyebrow?: string
  title?: string
  description?: string
  items?: ChartsSpotlightItem[]
}

const defaultItems: ChartsSpotlightItem[] = [
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

function FeaturedSpotlightCard({ item }: { item: ChartsSpotlightItem }) {
  return (
    <Link href={item.href} className={`${styles.card} ${styles.featuredCard}`}>
      <div className={styles.cardTop}>
        <span className={styles.category}>{item.category}</span>
        {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
      </div>

      <div className={styles.featuredBody}>
        <div className={styles.featuredContent}>
          <h3 className={styles.featuredTitle}>{item.title}</h3>
          <p className={styles.featuredDescription}>{item.description}</p>
        </div>

        <div className={styles.featuredAside}>
          <span className={styles.featuredAsideEyebrow}>Why this matters</span>
          <p className={styles.featuredAsideText}>
            Follow the strongest velocity signals, breakout movement, and the
            records creating immediate chart pressure.
          </p>

          <span className={styles.cardCta}>
            {item.ctaLabel ?? 'Explore'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function StandardSpotlightCard({ item }: { item: ChartsSpotlightItem }) {
  return (
    <Link href={item.href} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.category}>{item.category}</span>
        {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
      </div>

      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardDescription}>{item.description}</p>

      <span className={styles.cardCta}>{item.ctaLabel ?? 'Explore'}</span>
    </Link>
  )
}

export function ChartsSpotlight({
  className,
  eyebrow = 'Beyond rankings',
  title = 'Explore movement and context',
  description = 'Move past the main chart lanes and into the editorial, trending, and methodology layers that explain what the numbers mean.',
  items = defaultItems,
}: ChartsSpotlightProps) {
  const featuredItem = items.find(item => item.featured) ?? items[0]
  const secondaryItems = items.filter(item => item.href !== featuredItem.href)

  return (
    <section className={`${styles.section} ${className ?? ''}`.trim()}>
      <div className={styles.shell}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerMain}>
            <span className={styles.sectionEyebrow}>{eyebrow}</span>
            <h2 className={styles.sectionTitle}>{title}</h2>
          </div>

          <p className={styles.sectionText}>{description}</p>
        </div>

        <div className={styles.layout}>
          <FeaturedSpotlightCard item={featuredItem} />

          <div className={styles.sideStack}>
            {secondaryItems.map(item => (
              <StandardSpotlightCard key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}