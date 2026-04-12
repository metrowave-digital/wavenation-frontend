'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { NewsArticle } from '@/app/news/news.types'
import styles from './FeaturedEditorialSlider.module.css'

interface Props {
  articles: NewsArticle[]
}

export default function FeaturedEditorialClient({ articles }: Props) {
  const [index, setIndex] = useState(0)

  // Auto-rotate slider
  useEffect(() => {
    if (articles.length <= 1) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % articles.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [articles.length])

  if (!articles || articles.length === 0) return null

  const current = articles[index]
  const imageUrl = current.hero?.image?.sizes?.hero?.url || current.hero?.image?.url

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.livePulse} />
            <p className={styles.eyebrow}>EDITORIAL SELECT</p>
          </div>
          
          <div className={styles.controls}>
            {articles.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setIndex(i)}
                className={`${styles.dot} ${i === index ? styles.activeDot : ''}`}
                aria-label={`View featured article ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.sliderWindow}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={styles.featureGrid}
            >
              
              <Link href={`/news/${current.slug}`} className={styles.imageBox}>
                <div className={styles.imageContainer}>
                  {imageUrl ? (
                     <Image 
                       src={imageUrl} 
                       alt={current.hero?.image?.alt || current.title} 
                       fill 
                       sizes="(max-width: 1024px) 100vw, 60vw"
                       className={styles.img} 
                       priority
                     />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>
                {/* Studio Effects */}
                <div className={styles.vignette} />
                <div className={styles.scanlines} />
              </Link>

              <div className={styles.contentBox}>
                <span className={styles.deskLabel}>
                  {current.categories?.[0]?.name || 'FEATURED'}
                </span>
                
                <h2 className={styles.title}>{current.title}</h2>
                
                <p className={styles.excerpt}>
                  {current.subtitle || current.excerpt}
                </p>
                
                <Link href={`/news/${current.slug}`} className={styles.readBtn}>
                  READ FULL FEATURE &rarr;
                </Link>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}