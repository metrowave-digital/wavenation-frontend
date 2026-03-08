'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './NewsHero.module.css'

type FeaturedStory = {
  id?: number | string
  title: string
  href: string
  category: string
  excerpt: string
  image: string
  imageAlt?: string | null
}

interface NewsHeroProps {
  title: string
  subtitle: string
  featured: FeaturedStory[]
  autoRotateMs?: number
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

export function NewsHero({
  title,
  subtitle,
  featured,
  autoRotateMs = 7000,
}: NewsHeroProps) {
  const stories = useMemo(() => featured.slice(0, 3), [featured])
  const prefersReducedMotion = usePrefersReducedMotion()

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const safeIndex =
    stories.length === 0 ? 0 : Math.min(activeIndex, stories.length - 1)

  useEffect(() => {
    if (stories.length <= 1) return
    if (prefersReducedMotion) return
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stories.length)
    }, autoRotateMs)

    return () => window.clearInterval(timer)
  }, [stories.length, autoRotateMs, prefersReducedMotion, isPaused])

  if (!stories.length) return null

  const current = stories[safeIndex]

  function goToPrev() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? stories.length - 1 : currentIndex - 1
    )
  }

  function goToNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % stories.length)
  }

  function goToSlide(index: number) {
    setActiveIndex(index)
  }

  return (
    <section
      className={styles.hero}
      aria-label="Top stories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className={styles.copy}>
        <span className={styles.kicker}>WaveNation Pulse</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.sliderShell}>
        <article className={styles.featured}>
          <Link
            className={styles.imageWrap}
            href={current.href}
            aria-label={current.title}
          >
            <Image
              className={styles.image}
              src={current.image}
              alt={current.imageAlt || current.title}
              width={1200}
              height={675}
              sizes="(max-width: 900px) 100vw, 58vw"
              priority={safeIndex === 0}
            />
            <div className={styles.imageOverlay} />
          </Link>

          <div className={styles.featuredBody}>
            <span className={styles.category}>{current.category}</span>

            <h2 className={styles.featuredTitle}>
              <Link href={current.href}>{current.title}</Link>
            </h2>

            <p className={styles.featuredExcerpt}>{current.excerpt}</p>

            <div className={styles.actionsRow}>
              <Link className={styles.readMore} href={current.href}>
                Read story
              </Link>

              {stories.length > 1 ? (
                <div
                  className={styles.controls}
                  aria-label="Featured story controls"
                >
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={goToPrev}
                    aria-label="Previous featured story"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={goToNext}
                    aria-label="Next featured story"
                  >
                    ›
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </article>

        {stories.length > 1 ? (
          <>
            <div className={styles.dots} aria-label="Featured story pagination">
              {stories.map((story, index) => (
                <button
                  key={story.id ?? story.href}
                  type="button"
                  className={`${styles.dot} ${
                    index === safeIndex ? styles.dotActive : ''
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to featured story ${index + 1}`}
                  aria-pressed={index === safeIndex}
                />
              ))}
            </div>

            <div className={styles.storyList}>
              {stories.map((story, index) => (
                <button
                  key={`tease-${story.id ?? story.href}`}
                  type="button"
                  className={`${styles.storyTease} ${
                    index === safeIndex ? styles.storyTeaseActive : ''
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-pressed={index === safeIndex}
                >
                  <span className={styles.storyTeaseCategory}>
                    {story.category}
                  </span>
                  <span className={styles.storyTeaseTitle}>{story.title}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}