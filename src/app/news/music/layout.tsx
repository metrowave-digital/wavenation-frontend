import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './MusicHub.module.css'

export const metadata: Metadata = {
  title: 'Music Desk | WaveNation News',
  description: 'Trending music stories, new releases, and industry shifts.',
}

export default function MusicHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.musicPage}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <header className={styles.hubHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span> MUSIC DESK
          </div>
          <h1 className={styles.mainTitle}>
            The <span className={styles.outlineText}>Sound</span>
          </h1>
          
          <nav className={styles.hubNav}>
            <Link href="/news/music/trending" className={styles.navLink}>Trending</Link>
            <Link href="/news/music/latest" className={styles.navLink}>Latest</Link>
            <Link href="/news/music/new" className={styles.navLink}>New Releases</Link>
            <Link href="/news/music/artists" className={styles.navLink}>Artist Spotlights</Link>
            <Link href="/news/music/industry" className={styles.navLink}>Industry</Link>
            <Link href="/news/music/all" className={styles.navLink}>All Stories</Link>
          </nav>
        </header>

        {children}
      </main>
    </div>
  )
}