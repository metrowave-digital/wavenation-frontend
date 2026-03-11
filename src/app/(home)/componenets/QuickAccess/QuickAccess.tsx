import Link from 'next/link'
import styles from './QuickAccess.module.css'

const quickAccessItems = [
  {
    href: '/listen-live',
    label: 'Listen',
    title: 'Stream WaveNation FM',
    description: 'Enjoy non-stop music, engaging hosts, and the energy of WaveNation’s live station around the clock.',
  },
  {
    href: '/watch',
    label: 'Watch',
    title: 'WaveNation TV',
    description:
      'Immerse yourself in culture through exclusive interviews, live performances, and compelling visual stories.',
  },
  {
    href: '/playlists',
    label: 'Discover',
    title: 'Curated Playlists',
    description: 'Find the perfect soundtrack for any mood or moment with thoughtfully crafted playlists made just for you.',
  },
  {
    href: '/news',
    label: 'Read',
    title: 'WaveNation News',
    description: 'Stay informed with in-depth stories and updates on music, culture, and the voices shaping today’s conversation.',
  },
]

export default function QuickAccess() {
  return (
    <section className={styles.section} aria-labelledby="quick-access-title">
      <div className={styles.sectionHeader}>
        <p className={styles.eyebrow}>Start Here</p>

        <h2 id="quick-access-title" className={styles.sectionTitle}>
          Tap into the WaveNation experience
        </h2>

        <p className={styles.sectionDescription}>
          Connect instantly — listen live, explore vibrant playlists, watch exclusive video content, and stay updated on the latest music and cultural news.
        </p>
      </div>

      <div className={styles.quickGrid}>
        {quickAccessItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.quickCard}>
            <span className={styles.quickLabel}>{item.label}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDescription}>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}