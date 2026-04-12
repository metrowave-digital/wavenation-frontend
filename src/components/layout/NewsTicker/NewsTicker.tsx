'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Play, Pause, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import styles from './NewsTicker.module.css'
import { isExternalLink } from './newsTicker.utils'
import type { NewsTickerSettings, NewsTickerItem } from './newsTicker.types'

export function NewsTicker() {
  const [settings, setSettings] = useState<NewsTickerSettings | null>(null)
  const [articles, setArticles] = useState<NewsTickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)

  /* ======================================================
     DUAL FETCH: Settings + Articles
  ====================================================== */
  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, articlesRes] = await Promise.all([
          fetch('https://wavenation.media/api/globals/news-ticker-settings?depth=2&draft=false').catch(() => null),
          fetch('/api/newsticker-articles').catch(() => null)
        ])

        if (settingsRes?.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }

        if (articlesRes?.ok) {
          const articlesData = await articlesRes.json()
          setArticles(Array.isArray(articlesData) ? articlesData : [])
        }
      } catch (error) {
        console.error('Ticker Error:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  /* ======================================================
     LOGIC: Combine & Fallback
  ====================================================== */
  const allItems = useMemo(() => {
    const now = new Date().getTime()
    const validManuals = (settings?.manualInjects || []).filter(item => {
      if (!item.validUntil) return true
      return new Date(item.validUntil).getTime() > now
    })

    const combined = [...validManuals, ...articles]

    if (combined.length === 0 && !loading) {
      return [{ id: 'fallback', label: 'Welcome to WaveNation Media — Amplify Your Vibe', href: '/', isBreaking: false }]
    }
    return combined
  }, [settings, articles, loading])

  const isCrisisMode = settings?.isCrisisMode || false
  const displayLabel = settings?.defaultLabel || 'LATEST'

  // Breaking Alerts rotation
  const breakingItems = useMemo(() => allItems.filter(i => i.isBreaking), [allItems])
  const [breakingIndex, setBreakingIndex] = useState(0)

  useEffect(() => {
    if (!breakingItems.length) return
    const id = setInterval(() => {
      setBreakingIndex((prev) => (prev + 1) % breakingItems.length)
    }, 4000)
    return () => clearInterval(id)
  }, [breakingItems.length])

  const breakingItem = breakingItems[breakingIndex]

  /* ======================================================
     ANIMATION: GPU-Accelerated TranslateX
  ====================================================== */
  useEffect(() => {
    if (!allItems.length || breakingItem) return
    
    // Convert API speed to pixels per frame (40 = ~1px per frame)
    const baseSpeed = (settings?.scrollSpeed || 40) / 40
    let rAF: number

    const loop = () => {
      if (trackRef.current && !isPaused && !isInteracting) {
        positionRef.current += baseSpeed
        
        // The total scroll width is split exactly in half because we duplicated the array
        const max = trackRef.current.scrollWidth / 2
        
        if (positionRef.current >= max) {
          positionRef.current -= max // Seamless loop reset
        }
        
        // Apply the GPU transform instead of native scrollLeft
        trackRef.current.style.transform = `translateX(-${positionRef.current}px)`
      }
      rAF = requestAnimationFrame(loop)
    }
    rAF = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rAF)
  }, [allItems.length, isPaused, isInteracting, breakingItem, settings?.scrollSpeed])

  // Custom scroll controls for Prev/Next
  const manualScroll = (dir: 'next' | 'prev') => {
    if (!trackRef.current) return
    const max = trackRef.current.scrollWidth / 2
    
    let newPos = positionRef.current + (dir === 'next' ? 300 : -300)
    
    // Keep bounds safe
    if (newPos >= max) newPos -= max
    if (newPos < 0) newPos += max
    
    positionRef.current = newPos
    trackRef.current.style.transform = `translateX(-${positionRef.current}px)`
  }

  if (loading) return <div className={styles.skeleton} />

  const rootStyle = {
    '--crisis-bg': settings?.crisisPrimaryColor || '#FF0009',
    '--crisis-text': settings?.crisisTextColor || '#FFFFFF'
  } as React.CSSProperties

  return (
    <aside 
      className={`${styles.root} ${isCrisisMode ? styles.crisis : ''}`}
      style={rootStyle}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      <div className={`${styles.label} ${breakingItem ? styles.labelBreaking : ''} ${isCrisisMode ? styles.labelCrisis : ''}`}>
        {(breakingItem || isCrisisMode) && <AlertCircle size={12} className={styles.labelIcon} />}
        <span className={styles.labelText}>
          {isCrisisMode ? 'EMERGENCY' : breakingItem ? 'BREAKING' : displayLabel}
        </span>
      </div>

      <div className={styles.viewport}>
        {breakingItem ? (
          <div className={styles.breaking}>
            <Link href={breakingItem.href}>{breakingItem.label}</Link>
          </div>
        ) : (
          <div className={styles.track} ref={trackRef}>
            {/* Cloned twice for a seamless infinite loop */}
            {[...allItems, ...allItems, ...allItems, ...allItems].map((item, i) => {
              const external = isExternalLink(item.href)
              return (
                <Link 
                  key={`${item.id}-${i}`} 
                  href={item.href} 
                  className={styles.item}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  style={item.accentOverride ? { color: item.accentOverride } : {}}
                >
                  <span className={styles.divider}>/</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button onClick={() => manualScroll('prev')} aria-label="Prev"><ChevronLeft size={16} /></button>
        <button onClick={() => setIsPaused(!isPaused)} aria-label="Pause">
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
        <button onClick={() => manualScroll('next')} aria-label="Next"><ChevronRight size={16} /></button>
      </div>
    </aside>
  )
}