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
  return (
    <div className={styles.byline}>
      {author.avatar?.url && (
        <div className={styles.avatar}>
          <Image
            src={author.avatar.url}
            alt={author.avatar.alt ?? author.displayName}
            width={44}
            height={44}
          />
        </div>
      )}

      <div className={styles.meta}>
        <span className={styles.name}>
          By {author.displayName}
        </span>

        {publishDate && (
          <span className={styles.date}>
            {new Date(publishDate).toDateString()}
          </span>
        )}

        {author.bio && (
          <div className={styles.bio}>
            {author.bio}
          </div>
        )}
      </div>
    </div>
  )
}
