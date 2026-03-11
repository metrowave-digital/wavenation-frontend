'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './FeaturedEditorialSlider.module.css'

type FeaturedArticle = {
  id: string | number
  title: string
  excerpt: string
  href: string
  imageUrl: string | null
  imageAlt: string
  category: string
  publishDate: string | null
}

const AUTO_ROTATE_MS = 7000
const SWIPE_THRESHOLD = 50

function formatDate(date: string | null) {
  if (!date) return ''

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
  } catch {
    return ''
  }
}

function getCategoryTone(category: string) {
  const value = category.toLowerCase()

  if (value.includes('music')) {
    return {
      accentClass: styles.musicAccent,
      chipClass: styles.musicChip,
      glyph: '♪',
    }
  }

  if (value.includes('film') || value.includes('tv')) {
    return {
      accentClass: styles.filmAccent,
      chipClass: styles.filmChip,
      glyph: '◉',
    }
  }

  if (value.includes('culture') || value.includes('politic')) {
    return {
      accentClass: styles.cultureAccent,
      chipClass: styles.cultureChip,
      glyph: '◆',
    }
  }

  if (value.includes('business') || value.includes('tech')) {
    return {
      accentClass: styles.businessAccent,
      chipClass: styles.businessChip,
      glyph: '⬢',
    }
  }

  if (value.includes('sports')) {
    return {
      accentClass: styles.sportsAccent,
      chipClass: styles.sportsChip,
      glyph: '▲',
    }
  }

  return {
    accentClass: styles.defaultAccent,
    chipClass: styles.defaultChip,
    glyph: '✦',
  }
}

export default function FeaturedEditorialSlider() {
  const [items, setItems] = useState<FeaturedArticle[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progressKey, setProgressKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const startXRef = useRef<number | null>(null)
  const deltaXRef = useRef(0)

  const itemCount = items.length
  const hasMultipleItems = itemCount > 1

  const restartProgress = useCallback(() => {
    setProgressKey((prev) => prev + 1)
  }, [])

  const goToIndex = useCallback(
    (index: number) => {
      setActiveIndex(index)
      restartProgress()
    },
    [restartProgress]
  )

  const goNext = useCallback(() => {
    if (!hasMultipleItems) return
    setActiveIndex((prev) => (prev + 1) % itemCount)
    restartProgress()
  }, [hasMultipleItems, itemCount, restartProgress])

  const goPrev = useCallback(() => {
    if (!hasMultipleItems) return
    setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
    restartProgress()
  }, [hasMultipleItems, itemCount, restartProgress])

  useEffect(() => {
    let isMounted = true

    async function loadArticles() {
      try {
        const res = await fetch('/api/home/featured-editorial?limit=4', {
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error('Failed to load featured editorial stories')
        }

        const data = (await res.json()) as { items?: FeaturedArticle[] }
        const nextItems = Array.isArray(data.items) ? data.items : []

        if (!isMounted) return

        setItems(nextItems)
        setActiveIndex(0)
        restartProgress()
      } catch (error) {
        console.error('[FeaturedEditorialSlider] fetch error', error)

        if (!isMounted) return

        setItems([])
        setActiveIndex(0)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      isMounted = false
    }
  }, [restartProgress])

  useEffect(() => {
    if (isLoading || isPaused || !hasMultipleItems) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount)
      setProgressKey((prev) => prev + 1)
    }, AUTO_ROTATE_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [isLoading, isPaused, hasMultipleItems, itemCount])

  const activeItem = items[activeIndex] ?? null
  const activeTone = getCategoryTone(activeItem?.category ?? '')

  const queueItems = useMemo(() => {
    return items.map((item, index) => ({
      item,
      index,
      isActive: index === activeIndex,
    }))
  }, [items, activeIndex])

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    startXRef.current = event.touches[0]?.clientX ?? null
    deltaXRef.current = 0
    setIsPaused(true)
  }

  function handleTouchMove(event: React.TouchEvent<HTMLElement>) {
    if (startXRef.current === null) return
    const currentX = event.touches[0]?.clientX ?? startXRef.current
    deltaXRef.current = currentX - startXRef.current
  }

  function handleTouchEnd() {
    if (deltaXRef.current <= -SWIPE_THRESHOLD) {
      goNext()
    } else if (deltaXRef.current >= SWIPE_THRESHOLD) {
      goPrev()
    }

    startXRef.current = null
    deltaXRef.current = 0
    setIsPaused(false)
  }

  return (
    <section className={styles.section} aria-labelledby="featured-editorial-title">
  <div className={styles.headerRow}>
    <div className={styles.headerCopy}>
      <p className={styles.eyebrow}>Featured Editorial</p>
      <h2 id="featured-editorial-title" className={styles.title}>
        Stories That Spark the Dialogue
      </h2>
      <p className={styles.description}>
        Gain exclusive front-row access to the bold headlines, trailblazing talent, and pivotal cultural moments fueling the WaveNation editorial movement.
      </p>
    </div>

        <Link href="/news" className={styles.viewAllLink}>
          View all stories
        </Link>
      </div>

      <div className={styles.shell}>
        {isLoading ? (
          <div className={styles.loadingLayout}>
            <div className={styles.loadingHero} />
            <div className={styles.loadingQueue}>
              <div className={styles.loadingQueueCard} />
              <div className={styles.loadingQueueCard} />
              <div className={styles.loadingQueueCard} />
              <div className={styles.loadingQueueCard} />
            </div>
          </div>
        ) : activeItem ? (
          <div className={styles.layout}>
            <article
              className={`${styles.heroCard} ${activeTone.accentClass}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={
                activeItem.imageUrl
                  ? {
                      backgroundImage: `
                        linear-gradient(180deg, rgba(7,10,14,0.10) 0%, rgba(7,10,14,0.38) 35%, rgba(7,10,14,0.92) 100%),
                        linear-gradient(130deg, rgba(0,179,255,0.14), rgba(233,44,99,0.08)),
                        url(${activeItem.imageUrl})
                      `,
                    }
                  : undefined
              }
            >
              {!activeItem.imageUrl ? (
                <div className={styles.heroFallback} aria-hidden="true">
                  <div className={styles.heroFallbackPattern} />
                  <span className={styles.heroFallbackGlyph}>{activeTone.glyph}</span>
                </div>
              ) : null}

              <div className={styles.heroOverlay} />

              <div className={styles.heroTopBar}>
                <span className={styles.heroLabel}>Top Story</span>

                {hasMultipleItems ? (
                  <div className={styles.heroControls}>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={goPrev}
                      aria-label="Previous featured story"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={goNext}
                      aria-label="Next featured story"
                    >
                      ›
                    </button>
                  </div>
                ) : null}
              </div>

              <div className={styles.heroContent}>
                <div className={styles.metaRow}>
                  <span className={`${styles.categoryBadge} ${activeTone.chipClass}`}>
                    {activeItem.category}
                  </span>

                  {activeItem.publishDate ? (
                    <span className={styles.publishDate}>{formatDate(activeItem.publishDate)}</span>
                  ) : null}
                </div>

                <h3 className={styles.heroTitle}>{activeItem.title}</h3>
                <p className={styles.heroExcerpt}>{activeItem.excerpt}</p>

                <div className={styles.heroActions}>
                  <Link href={activeItem.href} className={styles.primaryCta}>
                    Read story
                  </Link>

                  <span className={styles.storyCount}>
                    {String(activeIndex + 1).padStart(2, '0')} / {String(itemCount).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </article>

            <aside className={styles.queuePanel} aria-label="Featured story queue">
              <div className={styles.queueHeader}>
                <div>
                  <p className={styles.queueEyebrow}>Up next</p>
                  <h3 className={styles.queueTitle}>Editorial queue</h3>
                </div>

                {hasMultipleItems ? (
                  <div className={styles.queueProgressTrack} aria-hidden="true">
                    <div
                      key={progressKey}
                      className={styles.queueProgressFill}
                      style={{ animationDuration: `${AUTO_ROTATE_MS}ms` }}
                    />
                  </div>
                ) : null}
              </div>

              <div className={styles.queueList}>
                {queueItems.map(({ item, index, isActive }) => {
                  const tone = getCategoryTone(item.category)

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`
                        ${styles.queueCard}
                        ${isActive ? styles.queueCardActive : ''}
                        ${isActive ? tone.chipClass : ''}
                      `}
                      onClick={() => goToIndex(index)}
                      aria-pressed={isActive}
                      aria-label={`Show featured story: ${item.title}`}
                    >
                      <span
                        className={`
                          ${styles.queueActiveBar}
                          ${isActive ? styles.queueActiveBarVisible : ''}
                        `}
                        aria-hidden="true"
                      />

                      <div className={styles.queueNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className={styles.queueBody}>
                        <div className={styles.queueMeta}>
                          <span className={`${styles.queueCategory} ${tone.chipClass}`}>
                            {item.category}
                          </span>

                          {item.publishDate ? (
                            <span className={styles.queueDate}>{formatDate(item.publishDate)}</span>
                          ) : null}
                        </div>

                        <h4 className={styles.queueCardTitle}>{item.title}</h4>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No featured stories are available right now.</p>
          </div>
        )}
      </div>
    </section>
  )
}