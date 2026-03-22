'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './NewsTicker.module.css'

import {
  trackNewsTickerBreaking,
  trackNewsTickerImpression,
} from '@/lib/analytics'

import type {
  NewsTickerItem,
  NewsTickerProps,
} from './newsTicker.types'

import { NewsTickerSkeleton } from './components/NewsTickerSkeleton'
import { NewsTickerBreaking } from './components/NewsTickerBreaking'
import { NewsTickerTrack } from './components/NewsTickerTrack'
import { NewsTickerMiniMenu } from './components/NewsTickerMiniMenu'

export function NewsTicker({
  label = 'Latest Stories',
}: NewsTickerProps) {
  const [items, setItems] = useState<NewsTickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [breakingHold, setBreakingHold] = useState(false)
  const [breakingFlash, setBreakingFlash] = useState(false)

  const breakingTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const impressionTrackedRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const res = await fetch('/api/newsticker-articles', {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error('Ticker fetch failed')
        }

        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [])

  const breakingItem = useMemo(
    () => items.find(item => item.isBreaking),
    [items]
  )

  const breakingId = breakingItem?.id ?? null

  useEffect(() => {
    if (!breakingId) {
      setBreakingHold(false)
      setBreakingFlash(false)
      return
    }

    if (breakingTimerRef.current) {
      clearTimeout(breakingTimerRef.current)
    }

    setBreakingHold(true)
    setBreakingFlash(true)

    trackNewsTickerBreaking({ id: breakingId })

    breakingTimerRef.current = setTimeout(() => {
      setBreakingHold(false)
      setBreakingFlash(false)
      breakingTimerRef.current = null
    }, 5000)

    return () => {
      if (breakingTimerRef.current) {
        clearTimeout(breakingTimerRef.current)
        breakingTimerRef.current = null
      }
    }
  }, [breakingId])

  useEffect(() => {
    if (
      !loading &&
      items.length > 0 &&
      !impressionTrackedRef.current
    ) {
      trackNewsTickerImpression({
        itemCount: items.length,
        hasBreaking: Boolean(breakingId),
      })
      impressionTrackedRef.current = true
    }
  }, [loading, items.length, breakingId])

  if (loading) {
    return <NewsTickerSkeleton label={label} />
  }

  if (!items.length) return null

  return (
    <aside
      className={`${styles.ticker} ${
        breakingFlash ? styles.breakingActive : ''
      }`}
      role="region"
      aria-label={label}
      aria-live={breakingId ? 'polite' : 'off'}
    >
      <div className={styles.label}>{label}</div>

      <span className={styles.sectionDivider} />

      <div className={styles.viewport}>
        {breakingItem && breakingHold ? (
          <NewsTickerBreaking item={breakingItem} />
        ) : (
          <NewsTickerTrack items={items} />
        )}
      </div>

      <span className={styles.sectionDivider} />

      <NewsTickerMiniMenu />
    </aside>
  )
}