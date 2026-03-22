'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  User,
  X,
  Clock3,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import styles from './MobileMenuFooter.module.css'

type QuickLink = {
  label: string
  href: string
}

type SearchLink = {
  label: string
  href: string
}

interface MobileMenuFooterProps {
  userName?: string | null
  userAvatarUrl?: string | null
  isSignedIn?: boolean
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Playlists', href: '/music/playlists' },
  { label: 'Artists', href: '/music/artists' },
  { label: 'News', href: '/news' },
  { label: 'Shows', href: '/shows' },
]

const TRENDING_SEARCHES: SearchLink[] = [
  { label: 'R&B playlists', href: '/search?q=R%26B%20playlists' },
  { label: 'WaveNation Pulse', href: '/search?q=WaveNation%20Pulse' },
  { label: 'Live sessions', href: '/search?q=Live%20sessions' },
  { label: 'Creator interviews', href: '/search?q=Creator%20interviews' },
]

const RECENT_SEARCHES_FALLBACK: SearchLink[] = [
  { label: 'Southern Soul', href: '/search?q=Southern%20Soul' },
  { label: 'Culture news', href: '/search?q=Culture%20news' },
  { label: 'Watch live', href: '/search?q=Watch%20live' },
]

const STORAGE_KEY = 'wavenation_recent_searches'

function getInitials(name?: string | null) {
  if (!name) return 'WN'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function getStoredRecentSearches(): SearchLink[] {
  if (typeof window === 'undefined') {
    return RECENT_SEARCHES_FALLBACK
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return RECENT_SEARCHES_FALLBACK

    const parsed = JSON.parse(raw) as SearchLink[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 6)
    }

    return RECENT_SEARCHES_FALLBACK
  } catch {
    return RECENT_SEARCHES_FALLBACK
  }
}

export function MobileMenuFooter({
  userName,
  userAvatarUrl,
  isSignedIn = false,
}: MobileMenuFooterProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recentSearches] = useState<SearchLink[]>(getStoredRecentSearches)

  useEffect(() => {
    if (!searchOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [searchOpen])

  const suggestedResults = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return []

    const pool: SearchLink[] = [
      ...recentSearches,
      ...TRENDING_SEARCHES,
      ...QUICK_LINKS,
      { label: 'Albums', href: '/search?q=Albums' },
      { label: 'Editorial features', href: '/search?q=Editorial%20features' },
    ]

    const unique = new Map<string, SearchLink>()

    for (const item of pool) {
      if (item.label.toLowerCase().includes(normalized)) {
        unique.set(item.href, item)
      }
    }

    return Array.from(unique.values()).slice(0, 6)
  }, [query, recentSearches])

  const searchHref = query.trim()
    ? `/search?q=${encodeURIComponent(query.trim())}`
    : '/search'

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerCard}>
          <div className={styles.copy}>
            <span className={styles.footerEyebrow}>WaveNation</span>
            <p className={styles.footerText}>
              Culture-forward radio, news, video, creators, and community.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/profile" className={styles.profileAction}>
              <span
                className={styles.avatar}
                aria-hidden
                data-signed-in={isSignedIn ? 'true' : 'false'}
              >
                {userAvatarUrl ? (
                  <Image
                    src={userAvatarUrl}
                    alt=""
                    fill
                    sizes="32px"
                    className={styles.avatarImage}
                  />
                ) : isSignedIn ? (
                  <span className={styles.avatarInitials}>
                    {getInitials(userName)}
                  </span>
                ) : (
                  <User className={styles.avatarIcon} />
                )}
              </span>

              <span className={styles.profileMeta}>
                <span className={styles.profileLabel}>Profile</span>
                <span className={styles.profileSubtext}>
                  {isSignedIn ? userName || 'Your account' : 'Sign in or explore'}
                </span>
              </span>
            </Link>

            <button
              type="button"
              className={styles.searchAction}
              onClick={() => setSearchOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              aria-controls="mobile-search-overlay"
            >
              <Search className={styles.searchIcon} aria-hidden />
              <span className={styles.searchMeta}>
                <span className={styles.searchLabel}>Search</span>
                <span className={styles.searchSubtext}>
                  Artists, news, playlists
                </span>
              </span>
            </button>
          </div>
        </div>
      </footer>

      {searchOpen ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-search-title"
          id="mobile-search-overlay"
        >
          <div
            className={styles.overlayBackdrop}
            onClick={() => setSearchOpen(false)}
          />

          <div className={styles.overlayPanel}>
            <div className={styles.overlayGlow} aria-hidden />

            <div className={styles.overlayHeader}>
              <div>
                <span className={styles.overlayEyebrow}>Discover</span>
                <h2 id="mobile-search-title" className={styles.overlayTitle}>
                  Search WaveNation
                </h2>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.searchShell}>
              <Search className={styles.shellIcon} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search artists, stories, playlists, shows..."
                className={styles.searchInput}
                autoFocus
              />
              {query.trim() ? (
                <Link
                  href={searchHref}
                  className={styles.searchGo}
                  onClick={() => setSearchOpen(false)}
                >
                  Go
                </Link>
              ) : null}
            </div>

            {query.trim() && suggestedResults.length > 0 ? (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Suggested</span>
                </div>

                <div className={styles.linkList}>
                  {suggestedResults.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.resultLink}
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className={styles.resultLeft}>
                        <Search className={styles.resultIcon} aria-hidden />
                        <span>{item.label}</span>
                      </span>
                      <ArrowRight className={styles.resultArrow} aria-hidden />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {!query.trim() ? (
              <>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Quick links</span>
                  </div>

                  <div className={styles.quickGrid}>
                    {QUICK_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.quickCard}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className={styles.quickArrow} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Recent</span>
                    <Clock3 className={styles.sectionIcon} aria-hidden />
                  </div>

                  <div className={styles.linkList}>
                    {recentSearches.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.resultLink}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className={styles.resultLeft}>
                          <Clock3 className={styles.resultIcon} aria-hidden />
                          <span>{item.label}</span>
                        </span>
                        <ArrowRight className={styles.resultArrow} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Trending</span>
                    <TrendingUp className={styles.sectionIcon} aria-hidden />
                  </div>

                  <div className={styles.linkList}>
                    {TRENDING_SEARCHES.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.resultLink}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className={styles.resultLeft}>
                          <TrendingUp className={styles.resultIcon} aria-hidden />
                          <span>{item.label}</span>
                        </span>
                        <ArrowRight className={styles.resultArrow} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}