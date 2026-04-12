import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './BusinessTech.module.css'

export const metadata: Metadata = {
  title: 'Business & Tech | WaveNation News',
  description: 'The business of culture: Music industry moves, creator strategies, and digital media trends.',
}

export default function BusinessTechHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.hubPage}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <header className={styles.hubHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span> BUSINESS DESK
          </div>
          <h1 className={styles.mainTitle}>
            The <span className={styles.outlineText}>Capital</span>
          </h1>
          
          <nav className={styles.hubNav}>
            <Link href="/news/business-tech/trending" className={styles.navLink}>Trending</Link>
            <Link href="/news/business-tech/music-biz" className={styles.navLink}>Music Biz</Link>
            <Link href="/news/business-tech/creator-tips" className={styles.navLink}>Creator Tips</Link>
            <Link href="/news/business-tech/digital-media" className={styles.navLink}>Digital Media</Link>
            <Link href="/news/business-tech/legal" className={styles.navLink}>Legal & Finance</Link>
            <Link href="/news/business-tech/all" className={styles.navLink}>All Stories</Link>
          </nav>
        </header>
        {children}
      </main>
    </div>
  )
}