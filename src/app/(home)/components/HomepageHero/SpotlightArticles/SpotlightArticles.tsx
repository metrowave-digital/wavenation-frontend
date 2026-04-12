'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { NewsArticle } from '@/app/news/news.types'
import styles from './SpotlightArticles.module.css'

export function SpotlightArticles() {
  const [items, setItems] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/spotlight-articles', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data.slice(0, 2))
        }
      })
      .catch(err => console.error('Failed to load spotlight articles:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.pulseIndicator} />
          <h3 className={styles.heading}>FEATURED STORIES</h3>
        </div>
        <Link href="/news" className={styles.more}>
          VIEW ALL STORIES &rarr;
        </Link>
      </header>

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
                <div className={styles.imageWrap}>
                  <div className={styles.skelImageBg} />
                  <div className={styles.scanlines} />
                  <div className={styles.overlay}>
                    <div className={styles.skelTag} />
                    <div className={styles.skelTitle} />
                    <div className={styles.skelSubtitle} />
                  </div>
                </div>
              </div>
            ))
          : items.map(item => {
              const imageUrl = item.hero?.image?.sizes?.card?.url || item.hero?.image?.url
              const categoryName = item.categories?.[0]?.name || 'FEATURED'

              return (
                <Link key={item.id} href={`/news/${item.slug}`} className={styles.card}>
                  <div className={styles.imageWrap}>
                    {imageUrl ? (
                      <div className={styles.imageContainer}>
                        <Image
                          src={imageUrl}
                          alt={item.hero?.image?.alt || item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={styles.image}
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