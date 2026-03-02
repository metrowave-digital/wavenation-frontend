'use client'

import Image from 'next/image'
import styles from './Byline.module.css'

interface Author {
  displayName: string
  avatar?: {
    url: string
    alt?: string | null
  }
  bio?: string | null
}

export function Byline({
  author,
  publishDate,
}: {
  author: Author
  publishDate?: string | null
}) {
  const dateObj = publishDate ? new Date(publishDate) : null
  const dateLabel = dateObj
    ? dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <section className={styles.byline} aria-label="Article byline">
      {author.avatar?.url ? (
        <div className={styles.avatarWrap}>
          <Image
            className={styles.avatarImg}
            src={author.avatar.url}
            alt={author.avatar.alt ?? author.displayName}
            width={48}
            height={48}
            priority={false}
          />
        </div>
      ) : (
        <div className={styles.avatarFallback} aria-hidden="true">
          {author.displayName?.slice(0, 1)?.toUpperCase()}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.name}>
            <span className={styles.by}>By</span> {author.displayName}
          </span>

          {dateObj && dateLabel && (
            <time className={styles.date} dateTime={dateObj.toISOString()}>
              {dateLabel}
            </time>
          )}
        </div>

        {author.bio && (
          <p className={styles.bio} title={author.bio}>
            {author.bio}
          </p>
        )}
      </div>
    </section>
  )
}