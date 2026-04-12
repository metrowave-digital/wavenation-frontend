'use client'

import { useEffect, useRef } from 'react'
import { Search, X, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useHeader } from '../Header.context'
import styles from './SearchPopup.module.css'
import Link from 'next/link'

// Dummy data for empty state
const TRENDING_SEARCHES = [
  'Hitlist 20 Chart',
  'Southern Soul Playlists',
  'Exclusive Creator Interviews',
  'WaveNation Shop Drops'
]

export function SearchPopup() {
  const { setPopup, isSearchOpen } = useHeader()
  const inputRef = useRef<HTMLInputElement | null>(null)

  /* ---------------------------------------------
     Focus + ESC handling
  ---------------------------------------------- */
  useEffect(() => {
    if (!isSearchOpen) return

    // Small timeout ensures the modal is rendered before focusing
    setTimeout(() => inputRef.current?.focus(), 100)

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPopup(null)
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isSearchOpen, setPopup])

  if (!isSearchOpen) return null

  const closeMenu = () => setPopup(null)

  return (
    <div
      className={styles.overlay}
      onClick={closeMenu}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className={styles.container}
        onClick={e => e.stopPropagation()}
      >
        {/* INPUT ROW */}
        <div className={styles.inputZone}>
          <div className={styles.inputWrapper}>
            <Search className={styles.searchIcon} size={28} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search music, news, shows..."
              className={styles.input}
            />
            <button
              onClick={closeMenu}
              className={styles.closeBtn}
              aria-label="Close search"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* TRENDING RESULTS (Empty State) */}
        <div className={styles.resultsZone}>
          <div className={styles.trendingHeader}>
            <TrendingUp size={16} className={styles.trendingIcon} />
            <span className={styles.trendingTitle}>Trending on WaveNation</span>
          </div>
          
          <ul className={styles.trendingList}>
            {TRENDING_SEARCHES.map((term, i) => (
              <li key={i}>
                <Link href={`/search?q=${encodeURIComponent(term)}`} className={styles.trendingItem} onClick={closeMenu}>
                  {term}
                  <ArrowUpRight size={16} className={styles.arrowIcon} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}