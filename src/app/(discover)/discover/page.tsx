'use client'

import Link from 'next/link'
import styles from './DiscoverPage.module.css'
import { HeroDiscovery } from '@/components/ui/heros/HeroDiscovery/HeroDiscovery'

/* ======================================================
   MOCK DATA (Wired to the Layout)
====================================================== */

const quickLinks = [
  { title: 'Trending', href: '/discover/trending', description: 'What listeners are playing and watching.' },
  { title: 'New Releases', href: '/discover/new', description: 'Fresh drops across music and video.' },
  { title: 'Playlists', href: '/discover/playlists', description: 'Editorial and creator curations.' },
  { title: 'Creators', href: '/discover/creators', description: 'Voices shaping the vibe.' },
  { title: 'Podcasts', href: '/discover/podcasts', description: 'Culture, music, and interviews.' },
  { title: 'Videos', href: '/discover/videos', description: 'Live sessions and docs.' },
]

const spotlightCards = [
  { eyebrow: 'Featured Playlist', title: 'Midnight Silk', href: '/discover/playlists/midnight-silk', description: 'Smooth late-night R&B and soul.', meta: 'R&B • Late Night' },
  { eyebrow: 'Chart Watch', title: 'The Hitlist 20', href: '/discover/charts/hitlist', description: 'Flagship chart tracking the culture.', meta: 'Charts • Weekly' },
  { eyebrow: 'Creator Spotlight', title: 'Fresh Voices', href: '/discover/creators/featured', description: 'Rising talent and storytellers.', meta: 'Creators • Featured' },
]

const trendingCards = [
  { eyebrow: 'Trending Music', title: 'Tracks Moving Fast', href: '/discover/trending/music', description: 'Records catching heat this week.' },
  { eyebrow: 'Trending Playlists', title: 'Most-Played Curations', href: '/discover/trending/playlists', description: 'Top destinations for R&B and Hip-Hop.' },
  { eyebrow: 'Trending Videos', title: 'Viral Visuals', href: '/discover/trending/videos', description: 'Interviews and music visuals.' },
]

const genreItems = [
  { name: 'R&B', href: '/discover/genres/rnb' },
  { name: 'Hip-Hop', href: '/discover/genres/hip-hop' },
  { name: 'Southern Soul', href: '/discover/genres/southern-soul' },
  { name: 'Gospel', href: '/discover/genres/gospel' },
  { name: 'Afrobeats', href: '/discover/genres/afrobeats' },
]

const moodItems = [
  { name: 'Chill', href: '/discover/moods/chill' },
  { name: 'Late Night', href: '/discover/moods/late-night' },
  { name: 'Grown Folk', href: '/discover/moods/grown-folk' },
  { name: 'Sunday Vibes', href: '/discover/moods/sunday-vibes' },
]

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function DiscoverPage() {
  return (
    <main className={styles.page}>
      {/* Cinematic Command Deck */}
      <HeroDiscovery />

      {/* Quick Nav Bridge */}
      <section className={styles.quickNav}>
        <div className={styles.container}>
          <div className={styles.quickGrid}>
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.quickCard}>
                <span className={styles.quickTitle}>{item.title}</span>
                <span className={styles.quickDescription}>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Featured Content</p>
            <h2 className={styles.sectionTitle}>Start Here</h2>
          </div>
          <Link href="/discover/trending" className={styles.sectionLink}>View all</Link>
        </div>

        <div className={styles.featureGrid}>
          {spotlightCards.map((card) => (
            <Link key={card.href} href={card.href} className={styles.featureCard}>
              <span className={styles.cardEyebrow}>{card.eyebrow}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
              {card.meta && <span className={styles.cardMeta}>{card.meta}</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Sound / Split Section */}
      <section className={styles.section}>
        <div className={styles.splitSection}>
          <div className={styles.splitPanel}>
            <div className={styles.sectionHeaderCompact}>
              <h2 className={styles.compactTitle}>Genres</h2>
              <Link href="/discover/genres" className={styles.sectionLink}>All</Link>
            </div>
            <div className={styles.tagGrid}>
              {genreItems.map((genre) => (
                <Link key={genre.href} href={genre.href} className={styles.tagPill}>{genre.name}</Link>
              ))}
            </div>
          </div>

          <div className={styles.splitPanel}>
            <div className={styles.sectionHeaderCompact}>
              <h2 className={styles.compactTitle}>Moods</h2>
              <Link href="/discover/moods" className={styles.sectionLink}>All</Link>
            </div>
            <div className={styles.tagGrid}>
              {moodItems.map((mood) => (
                <Link key={mood.href} href={mood.href} className={styles.tagPillAlt}>{mood.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Panel */}
      <section className={styles.bottomSection}>
        <div className={styles.bottomPanel}>
          <div className={styles.bottomCopy}>
            <p className={styles.sectionEyebrow}>The Network</p>
            <h2 className={styles.sectionTitle}>Charts & Creators</h2>
            <p className={styles.bottomDescription}>
              Move from discovery to deeper engagement across the creator ecosystem.
            </p>
          </div>
          <div className={styles.bottomActions}>
            <Link href="/discover/charts" className={styles.primaryCta}>Explore Charts</Link>
            <Link href="/creators" className={styles.secondaryCta}>Meet Creators</Link>
          </div>
        </div>
      </section>
    </main>
  )
}