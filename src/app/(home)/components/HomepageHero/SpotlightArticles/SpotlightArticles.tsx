'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { NewsArticle } from '@/app/news/news.types'
import styles from './SpotlightArticles.module.css'

interface SpotlightArticlesProps {
  /** * Array of articles passed from the CMS. 
   * Handled as either fully populated objects or IDs (string/number).
   */
  articles?: (NewsArticle | string | number)[] 
}

export function SpotlightArticles({ articles = [] }: SpotlightArticlesProps) {
  // 1. Return null if no data is present to avoid rendering an empty section
  if (!articles || articles.length === 0) return null

  // 2. We only ever show exactly 2 items for this specific layout row
  const displayItems = articles.slice(0, 2)

  return (
    <section className={styles.root}>
      {/* SECTION HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.pulseIndicator} />
          <h3 className={styles.heading}>FEATURED STORIES</h3>
        </div>
        <Link href="/news" className={styles.more}>
          VIEW ALL STORIES &rarr;
        </Link>
      </header>

      {/* GRID CONTAINER */}
      <div className={styles.grid}>
        {displayItems.map((item) => {
          /**
           * Safety Check: Ensure the item is a populated object.
           * If the CMS returns only an ID (string or number), we skip rendering it 
           * to prevent "undefined" property errors.
           */
          if (!item || typeof item === 'number' || typeof item === 'string') return null

          // Image Priority: Card Size (800x450) -> Hero Size -> Raw URL
          const imageUrl = 
            item.hero?.image?.sizes?.card?.url || 
            item.hero?.image?.sizes?.hero?.url || 
            item.hero?.image?.url

          // Category Priority: First category name -> Default label
          const categoryName = item.categories?.[0]?.name || 'FEATURED'

          return (
            <Link 
              key={item.id} 
              href={`/news/${item.slug}`} 
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                {imageUrl ? (
                  <div className={styles.imageContainer}>
                    <Image
                      src={imageUrl}
                      alt={item.hero?.image?.alt || item.title || 'WaveNation News'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.image}
                      priority={true}
                    />
                  </div>
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
                
                <div className={styles.vignette} />
                <div className={styles.scanlines} />
                
                <div className={styles.overlay}>
                  <span className={styles.category}>{categoryName}</span>
                  <h4 className={styles.title}>{item.title}</h4>
                  
                  {item.subtitle && (
                    <p className={styles.subtitle}>{item.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}