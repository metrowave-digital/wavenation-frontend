import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './CultureHub.module.css'

export const metadata: Metadata = {
  title: 'Culture & Politics | WaveNation News',
  description: 'US News, Travel, Education, Fashion, and the pulse of global culture.',
}

export default function CultureHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.hubPage}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <header className={styles.hubHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span> CULTURE DESK
          </div>
          <h1 className={styles.mainTitle}>
            The <span className={styles.outlineText}>Pulse</span>
          </h1>
          
          <nav className={styles.hubNav}>
            <Link href="/news/culture/trending" className={styles.navLink}>Trending</Link>
            <Link href="/news/culture/us-news" className={styles.navLink}>US News</Link>
            <Link href="/news/culture/travel" className={styles.navLink}>Travel</Link>
            <Link href="/news/culture/education" className={styles.navLink}>Education</Link>
            <Link href="/news/culture/fashion" className={styles.navLink}>Fashion</Link>
            <Link href="/news/culture/all" className={styles.navLink}>All Stories</Link>
          </nav>
        </header>
        {children}
      </main>
    </div>
  )
}