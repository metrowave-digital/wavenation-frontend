import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './FilmTVHub.module.css'

export const metadata: Metadata = {
  title: 'Film & TV Desk | WaveNation News',
  description: 'Trending movies, television reviews, celebrity interviews, and streaming updates.',
}

export default function FilmTVHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.hubPage}>
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        {/* FILM/TV DESK HEADER */}
        <header className={styles.hubHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span> FILM & TV DESK
          </div>
          <h1 className={styles.mainTitle}>
            The <span className={styles.outlineText}>Screen</span>
          </h1>
          
          <nav className={styles.hubNav}>
            <Link href="/news/film-tv/trending" className={styles.navLink}>Trending</Link>
            <Link href="/news/film-tv/latest" className={styles.navLink}>Latest</Link>
            <Link href="/news/film-tv/reviews" className={styles.navLink}>Reviews</Link>
            <Link href="/news/film-tv/interviews" className={styles.navLink}>Interviews</Link>
            <Link href="/news/film-tv/streaming" className={styles.navLink}>Streaming</Link>
            <Link href="/news/film-tv/all" className={styles.navLink}>All Stories</Link>
          </nav>
        </header>

        {/* This renders the content from [feed]/page.tsx */}
        {children}
        
      </main>
    </div>
  )
}