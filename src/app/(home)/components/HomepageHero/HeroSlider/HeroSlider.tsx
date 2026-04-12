'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import type { NewsArticle } from '@/app/news/news.types'
import styles from './HeroSlider.module.css'

const ROTATION_INTERVAL = 7000 
const EASE_CUSTOM: [number, number, number, number] = [0.16, 1, 0.3, 1]

const slideVariants: Variants = {
  enter: { opacity: 0, scale: 1.02 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE_CUSTOM } },
  exit: { opacity: 0, transition: { duration: 0.6, ease: EASE_CUSTOM } },
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, y: 0, 
    transition: { delay: 0.3, duration: 0.6, ease: EASE_CUSTOM } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
}

export function HeroSlider({ articles }: { articles: NewsArticle[] }) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const displayArticles = useMemo(() => {
    if (!articles) return []
    return articles.filter(article => {
      const hasExcludedSubcategory = article.subcategories?.some(
        sub => sub.slug === 'artist-profile' || sub.slug === 'artist-profiles'
      )
      return !hasExcludedSubcategory
    }).slice(0, 5)
  }, [articles])

  useEffect(() => {
    if (displayArticles.length <= 1) return

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIndex((prev) => (prev + 1) % displayArticles.length)
          return 0
        }
        return p + 1 
      })
    }, ROTATION_INTERVAL / 100)

    return () => clearInterval(timer)
  }, [displayArticles.length, index])

  const handleNavClick = (targetIndex: number) => {
    setIndex(targetIndex)
    setProgress(0)
  }

  // ==========================================
  // SKELETON LOADER STATE
  // ==========================================
  if (!articles || articles.length === 0) {
    return (
      <section className={`${styles.root} ${styles.skeletonRoot}`}>
        <div className={styles.imageWrapper}>
          <div className={styles.skelImageBg} />
          <div className={styles.scanlines} />
          <div className={styles.overlayGlow} />
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.skelBadge} />
            <div className={styles.skelTitleLarge} />
            <div className={styles.skelTitleMedium} />
            <div className={styles.skelSubtitleBlock} />
            <div className={styles.skelCta} />
          </div>
        </div>
      </section>
    )
  }

  const item = displayArticles[index]
  if (!item) return null

  return (
    <section className={styles.root}>
      <AnimatePresence mode="wait">
        <motion.article
          key={item.id}
          className={styles.slide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div className={styles.imageWrapper}>
            {item.hero?.image?.url ? (
              <Image
                src={item.hero.image.sizes?.hero?.url || item.hero.image.url}
                alt={item.hero.image.alt || item.title}
                fill
                priority
                className={styles.image}
              />
            ) : (
              <div className={styles.placeholderImage} />
            )}
            <div className={styles.vignette} />
            <div className={styles.scanlines} />
            <div className={styles.overlayGlow} />
          </div>

          <div className={styles.container}>
            <motion.div 
              className={styles.content}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className={styles.badgeRow}>
                <span className={styles.liveDot} />
                <span className={styles.category}>
                  {item.categories?.[0]?.name || 'LATEST NEWS'}
                </span>
              </div>

              <h2 className={styles.title}>{item.title}</h2>
              
              {item.subtitle && (
                <p className={styles.subtitle}>{item.subtitle}</p>
              )}

              <Link href={`/news/${item.slug}`} className={styles.cta}>
                READ FULL STORY
              </Link>
            </motion.div>
          </div>
        </motion.article>
      </AnimatePresence>

      {displayArticles.length > 1 && (
        <div className={styles.controls}>
          {displayArticles.map((_, i) => (
            <button 
              key={i} 
              className={`${styles.navDot} ${i === index ? styles.activeDot : ''}`}
              onClick={() => handleNavClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === index && (
                <svg className={styles.progressRing} viewBox="0 0 32 32">
                  <circle 
                    className={styles.progressCircle}
                    cx="16" cy="16" r="14" 
                    strokeDasharray="88" 
                    strokeDashoffset={88 - (88 * progress) / 100} 
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}