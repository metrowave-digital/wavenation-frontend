import Link from 'next/link'
import styles from './ChartsPage.module.css'
import { HeroChartsHub } from '@/components/ui/heros/HeroCharts/HeroChartsHub'
import { ArrowRight, BarChart, TrendingUp, BookOpen, Activity } from 'lucide-react'

export const metadata = {
  title: 'Charts | WaveNation',
  description:
    'Explore WaveNation charts including Hitlist 20, genre charts, trending movements, breakout artists, and chart methodology.',
}

const spotlightItems = [
  {
    category: 'Trending',
    title: 'Fast Risers',
    href: '/charts/trending/fast-risers',
    description: 'A closer look at records gaining serious traction this week across visibility, conversation, and audience movement.',
    badge: 'MOVEMENT',
    icon: TrendingUp
  },
  {
    category: 'Features',
    title: 'Biggest Movers',
    href: '/charts/features/biggest-movers',
    description: 'Editorial analysis around chart jumps, drops, and the stories shaping the strongest shifts.',
    badge: 'EDITORIAL',
    icon: Activity
  },
  {
    category: 'Methodology',
    title: 'How WaveNation Charts Work',
    href: '/charts/methodology',
    description: 'Understand the framework, cadence, and ranking logic behind the WaveNation chart ecosystem.',
    badge: 'FRAMEWORK',
    icon: BookOpen
  },
]

// Mock Core Charts (Replace with your actual CMS data loop)
const coreCharts = [
  { title: 'The Hitlist 20', desc: 'The flagship multi-genre ranking.', href: '/charts/hitlist' },
  { title: 'R&B / Soul', desc: 'Top streaming & requested R&B.', href: '/charts/rnb' },
  { title: 'Southern Soul', desc: 'The pulse of the Southern grid.', href: '/charts/southern-soul' },
  { title: 'Hip-Hop', desc: 'Leading rap and culture tracks.', href: '/charts/hip-hop' },
]

export default async function ChartsPage() {
  return (
    <main className={styles.page}>
      
      {/* 1. New Cinematic Hero */}
      <HeroChartsHub 
        eyebrow="WaveNation Charts"
        title="THE CHARTS HUB"
        description="Track the records defining the moment across Hitlist 20, genre rankings, trending movement, and editorial chart analysis."
        lastUpdated="UPDATED_WEEKLY"
      />

      <div className={styles.container}>
        
        {/* 2. System Meta Readout (Replaces ChartMetaBar) */}
        <div className={styles.systemReadout}>
          <div className={styles.readoutGrid}>
            <div className={styles.readoutItem}>
              <span className={styles.rLabel}>FLAGSHIP</span>
              <span className={styles.rValue}>HITLIST 20</span>
            </div>
            <div className={styles.readoutItem}>
              <span className={styles.rLabel}>GENRE LANES</span>
              <span className={styles.rValue}>R&B, HIP-HOP, SOUL, GOSPEL</span>
            </div>
            <div className={styles.readoutItem}>
              <span className={styles.rLabel}>CADENCE</span>
              <span className={styles.rValue} style={{ color: '#00F0FF' }}>WEEKLY_SYNC</span>
            </div>
          </div>
          <Link href="/charts/methodology" className={styles.readoutAction}>
            READ METHODOLOGY <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3. Core Charts Bento Grid */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>CORE <span className={styles.cyan}>CHARTS</span></h2>
            <div className={styles.headerLine} />
          </div>

          <div className={styles.bentoGrid}>
            {coreCharts.map((chart, idx) => (
              <Link key={idx} href={chart.href} className={styles.chartCard}>
                <div className={styles.cardTop}>
                  <BarChart size={20} className={styles.cardIcon} />
                  <span className={styles.rankBadge}>TOP_50</span>
                </div>
                <div className={styles.cardBottom}>
                  <h3 className={styles.chartTitle}>{chart.title}</h3>
                  <p className={styles.chartDesc}>{chart.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Data Modules (Replaces ChartsSpotlight) */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>DATA <span className={styles.cyan}>MODULES</span></h2>
            <div className={styles.headerLine} />
          </div>

          <div className={styles.moduleGrid}>
            {spotlightItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <Link key={idx} href={item.href} className={styles.dataModule}>
                  <div className={styles.moduleMeta}>
                    <span className={styles.moduleBadge}>{item.badge}</span>
                    <Icon size={16} className={styles.moduleIcon} />
                  </div>
                  <h3 className={styles.moduleTitle}>{item.title}</h3>
                  <p className={styles.moduleDesc}>{item.description}</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 5. Terminal Bottom CTA */}
        <section className={styles.terminalCta}>
          <div className={styles.terminalHeader}>
            <span className={styles.termLabel}>SYSTEM // METHODOLOGY</span>
            <div className={styles.termDots}>
              <span /> <span /> <span />
            </div>
          </div>
          <div className={styles.terminalBody}>
            <h2 className={styles.termTitle}>TRUST THE FRAMEWORK.</h2>
            <p className={styles.termText}>
              Rankings work better when the rules are visible. Explore the methodology, review chart archives, and follow the weekly movement with complete transparency.
            </p>
            <div className={styles.termActions}>
              <Link href="/charts/methodology" className={styles.termBtnPrimary}>
                VIEW METHODOLOGY
              </Link>
              <Link href="/charts/hitlist/archive" className={styles.termBtnSecondary}>
                BROWSE ARCHIVES
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}