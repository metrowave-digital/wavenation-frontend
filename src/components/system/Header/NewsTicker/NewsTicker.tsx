'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import styles from './NewsTicker.module.css'

import {
  trackNewsTickerBreaking,
  trackNewsTickerImpression,
} from '@/lib/analytics'
import { isExternalLink } from './newsTicker.utils'

import type {
  NewsTickerItem,
  NewsTickerProps,
} from './newsTicker.types'

interface EnhancedNewsTickerProps extends NewsTickerProps {
  isCrisisMode?: boolean
}

export function NewsTicker({
  label = 'LATEST STORIES',
  isCrisisMode = false,
}: EnhancedNewsTickerProps) {
  const [items, setItems] = useState<NewsTickerItem[]>([])
  const [loading, setLoading] = useState(true)

  const [isPaused, setIsPaused] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)

  const impressionTrackedRef = useRef(false)

  /* =============================
     FETCH (with caching)
  ============================== */
  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const cached = sessionStorage.getItem('ticker')
        if (cached) {
          setItems(JSON.parse(cached))
          setLoading(false)
        }

        const res = await fetch('/api/newsticker-articles', {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!res.ok) throw new Error()

        const data = await res.json()
        const safe = Array.isArray(data) ? data : []

        setItems(safe)
        sessionStorage.setItem('ticker', JSON.stringify(safe))
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  /* =============================
     BREAKING ROTATION
  ============================== */
  const breakingItems = useMemo(
    () => items.filter(i => i.isBreaking),
    [items]
  )

  const [breakingIndex, setBreakingIndex] = useState(0)

  useEffect(() => {
    if (!breakingItems.length) return

    const id = setInterval(() => {
      setBreakingIndex(i => (i + 1) % breakingItems.length)
    }, 4000)

    return () => clearInterval(id)
  }, [breakingItems.length])

  const breakingItem = breakingItems[breakingIndex]
  const breakingId = breakingItem?.id ?? null

  /* =============================
     IMPRESSION TRACKING
  ============================== */
  useEffect(() => {
    if (!loading && items.length && !impressionTrackedRef.current) {
      trackNewsTickerImpression({
        itemCount: items.length,
        hasBreaking: !!breakingId,
      })
      impressionTrackedRef.current = true
    }
  }, [loading, items.length, breakingId])

  /* =============================
     AUTO SCROLL (SMOOTH)
  ============================== */
  useEffect(() => {
    if (!items.length) return

    let rAF: number
    let last = performance.now()
    const speed = 0.04
    const MAX_DT = 50

    const loop = (time: number) => {
      let dt = time - last
      last = time
      if (dt > MAX_DT) dt = MAX_DT

      const viewport = viewportRef.current
      const track = trackRef.current

      if (viewport && track) {
        if (isPaused || isInteracting || breakingItem) {
          positionRef.current = viewport.scrollLeft
        } else {
          positionRef.current += speed * dt
          const max = track.scrollWidth / 2

          if (positionRef.current >= max) {
            positionRef.current -= max
          }

          viewport.scrollLeft = Math.round(positionRef.current)
        }
      }

      rAF = requestAnimationFrame(loop)
    }

    rAF = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rAF)
  }, [items.length, isPaused, isInteracting, breakingItem])

  /* =============================
     INTERSECTION PAUSE
  ============================== */
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* =============================
     SNAP AFTER INTERACTION
  ============================== */
  useEffect(() => {
    if (isInteracting) return

    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const children = Array.from(track.children) as HTMLElement[]
    const scroll = viewport.scrollLeft

    const closest = children.reduce((prev, curr) =>
      Math.abs(curr.offsetLeft - scroll) <
      Math.abs(prev.offsetLeft - scroll)
        ? curr
        : prev
    )

    viewport.scrollTo({
      left: closest.offsetLeft,
      behavior: 'smooth',
    })
  }, [isInteracting])

  /* =============================
     NAV
  ============================== */
  const handleNext = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const children = Array.from(track.children) as HTMLElement[]
    const next = children.find(c => c.offsetLeft > viewport.scrollLeft + 20)
    if (next) viewport.scrollTo({ left: next.offsetLeft, behavior: 'smooth' })
  }

  const handlePrev = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const children = Array.from(track.children) as HTMLElement[]
    const prev = [...children].reverse().find(
      c => c.offsetLeft < viewport.scrollLeft - 20
    )
    if (prev) viewport.scrollTo({ left: prev.offsetLeft, behavior: 'smooth' })
  }

  if (loading) return <div className={styles.skeleton} />
  if (!items.length) return null

  return (
    <aside
      className={`${styles.root} ${isCrisisMode ? styles.crisis : ''}`}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') handleNext()
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === ' ') setIsPaused(p => !p)
      }}
    >
      {/* 🔥 NEW FLOATING LABEL */}
      <div
        className={[
          styles.label,
          breakingItem ? styles.labelBreaking : '',
          isCrisisMode ? styles.labelCrisis : '',
        ].join(' ')}
      >
        {(breakingItem || isCrisisMode) && (
          <AlertCircle size={12} />
        )}
        {breakingItem
          ? 'BREAKING'
          : isCrisisMode
          ? 'EMERGENCY'
          : label}
      </div>

      {/* VIEWPORT */}
      <div className={styles.viewport} ref={viewportRef}>
        {breakingItem ? (
          <div className={styles.breaking}>
            <a href={breakingItem.href}>{breakingItem.label}</a>
          </div>
        ) : (
          <div className={styles.track} ref={trackRef}>
            {[...items, ...items].map((item, i) => {
              const isDupe = i >= items.length
              const external = isExternalLink(item.href)
              const Comp = item.href ? 'a' : 'span'

              return (
                <Comp
                  key={`${item.id}-${i}`}
                  href={item.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={styles.item}
                  aria-hidden={isDupe}
                  tabIndex={isDupe ? -1 : 0}
                >
                  <span className={styles.divider}>/</span>
                  {item.label}
                </Comp>
              )
            })}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className={styles.controls}>
        <button onClick={handlePrev} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>

        <button onClick={() => setIsPaused(p => !p)} aria-label="Pause/Play">
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>

        <button onClick={handleNext} aria-label="Next">
          <ChevronRight size={16} />
        </button>
      </div>
    </aside>
  )
}