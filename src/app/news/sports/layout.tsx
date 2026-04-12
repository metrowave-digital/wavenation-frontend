import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './SportsHub.module.css'

export const metadata: Metadata = {
  title: 'Sports Desk | WaveNation News',
  description: 'Breaking news from the NBA, NFL, and the world of sports culture.',
}

export default function SportsHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.hubPage}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <header className={styles.hubHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span> SPORTS DESK
          </div>
          <h1 className={styles.mainTitle}>
            The <span className={styles.outlineText}>Arena</span>
          </h1>
          
          <nav className={styles.hubNav}>
            <Link href="/news/sports/trending" className={styles.navLink}>Trending</Link>
            <Link href="/news/sports/nba" className={styles.navLink}>NBA</Link>
            <Link href="/news/sports/nfl" className={styles.navLink}>NFL</Link>
            <Link href="/news/sports/college" className={styles.navLink}>College</Link>
            <Link href="/news/sports/culture" className={styles.navLink}>Culture</Link>
            <Link href="/news/sports/all" className={styles.navLink}>All Stories</Link>
          </nav>
        </header>
        {children}
      </main>
    </div>
  )
}