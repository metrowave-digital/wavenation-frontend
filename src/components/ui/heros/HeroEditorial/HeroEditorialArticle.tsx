import React from 'react'
import Image from 'next/image'
import { Clock, Share2, Bookmark } from 'lucide-react'
import styles from './HeroEditorialArticle.module.css'

export interface HeroEditorialArticleProps {
  slug?: string
  kicker?: string
  date?: string
  title: string
  excerpt?: string
  authorName?: string
  authorRole?: string
  authorImage?: string
  readTime?: string
  heroImage?: string
}

export function HeroEditorialArticle({
  slug,
  kicker = 'ARTICLE',
  date,
  title,
  excerpt,
  authorName = 'WAVENATION STAFF',
  authorRole = 'CONTRIBUTOR',
  authorImage = '/images/authors/default.jpg',
  readTime = '4 MIN READ',
  heroImage,
}: HeroEditorialArticleProps) {
  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <div className={styles.kickerRow}>
          <span className={styles.category}>{kicker}</span>
          {date && <span className={styles.date}>{date}</span>}
        </div>

        <h1 className={styles.articleTitle}>{title}</h1>
        
        {excerpt && (
          <p className={styles.articleExcerpt}>{excerpt}</p>
        )}

        <div className={styles.metaConsole}>
          <div className={styles.authorBlock}>
            <div className={styles.avatar}>
              <Image 
                src={authorImage} 
                alt={authorName} 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.authorData}>
              <span className={styles.authorName}>BY {authorName}</span>
              <span className={styles.authorRole}>{authorRole}</span>
            </div>
          </div>

          <div className={styles.utilityBlock}>
            <span className={styles.readTime}>
              <Clock size={14} /> {readTime}
            </span>
            <div className={styles.actionBtns}>
              <button className={styles.iconBtn} aria-label="Share">
                <Share2 size={16} />
              </button>
              <button className={styles.iconBtn} aria-label="Save">
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {heroImage && (
        <div className={styles.heroImageWrapper}>
          <Image 
            src={heroImage} 
            alt={title} 
            fill 
            className={styles.heroImage} 
            priority 
          />
        </div>
      )}
    </header>
  )
}