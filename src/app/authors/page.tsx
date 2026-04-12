import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAuthors } from '@/services/authors.api'
import styles from './AuthorsPage.module.css'

export const metadata: Metadata = {
  title: 'WaveNation Editorial Desk | Our Authors',
  description: 'Meet the journalists, creators, and voices behind WaveNation Media.',
}

export default async function AuthorsDirectory() {
  const authors = await getAuthors()

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span> THE DESK
          </div>
          <h1 className={styles.mainTitle}>Editorial<br/><span className={styles.outlineText}>Voices</span></h1>
        </header>

        <div className={styles.authorGrid}>
          {authors.map((author, index) => (
            <Link key={author.id} href={`/authors/${author.slug}`} className={styles.authorCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.avatarWrapper}>
                {author.avatar?.url ? (
                  <Image src={author.avatar.sizes?.card?.url || author.avatar.url} alt={author.fullName} fill className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarPlaceholder}>{author.fullName.charAt(0)}</div>
                )}
                <div className={styles.scanlines} />
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorRole}>{author.role || 'WRITER'}</span>
                <h2 className={styles.authorName}>{author.fullName}</h2>
                <span className={styles.viewProfileBtn}>View Desk &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}