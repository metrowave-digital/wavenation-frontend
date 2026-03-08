'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { NewsCard } from './NewsCard'
import styles from './MoreArticlesRail.module.css'

type Article = {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl?: string | null
  imageAlt?: string | null
}

interface MoreArticlesRailProps {
  initialItems: Article[]
  initialHasMore?: boolean
  apiEndpoint: string
  archiveHref: string
  autoLoadOnScroll?: boolean
}

export function MoreArticlesRail({
  initialItems,
  initialHasMore = true,
  apiEndpoint,
  archiveHref,
  autoLoadOnScroll = true,
}: MoreArticlesRailProps) {
  const [items, setItems] = useState<Article[]>(initialItems)
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedAll, setHasLoadedAll] = useState(false)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadNextPage = useCallback(async () => {
    if (isLoading || !hasMore || hasLoadedAll) return

    try {
      setIsLoading(true)

      const res = await fetch(`${apiEndpoint}?page=${page}`, {
        method: 'GET',
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error(`Failed to load articles (${res.status})`)
      }

      const data = await res.json()

      setItems((prev) => {
        const existing = new Set(prev.map((i) => i.id))
        const next = (data.items ?? []).filter((i: Article) => !existing.has(i.id))
        return [...prev, ...next]
      })

      setHasMore(Boolean(data.hasMore))
      setPage(data.nextPage ?? page + 1)

      if (!data.hasMore) {
        setHasLoadedAll(true)
      }
    } catch (err) {
      console.error('[MoreArticlesRail]', err)
    } finally {
      setIsLoading(false)
    }
  }, [apiEndpoint, page, hasMore, isLoading, hasLoadedAll])

  useEffect(() => {
    if (!autoLoadOnScroll || !hasMore || hasLoadedAll) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          loadNextPage()
        }
      },
      {
        rootMargin: '400px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [autoLoadOnScroll, hasMore, hasLoadedAll, loadNextPage])

  return (
    <section className={styles.section} aria-label="More articles">
      <div className={styles.header}>
        <h2 className={styles.title}>More Articles</h2>
      </div>

      <div className={styles.grid}>
        {items.map((story) => (
          <NewsCard
            key={story.id}
            title={story.title}
            href={story.href}
            category={story.category}
            excerpt={story.excerpt}
            image={story.imageUrl ?? '/images/placeholders/news-fallback.jpg'}
            imageAlt={story.imageAlt ?? story.title}
            layout="stacked"
          />
        ))}
      </div>

      {hasMore && !hasLoadedAll && (
        <div className={styles.actions}>
          <button
            className={styles.loadMore}
            onClick={loadNextPage}
            disabled={isLoading}
          >
            {isLoading ? 'Loading…' : 'Load More'}
          </button>

          <Link className={styles.archiveLink} href={archiveHref}>
            View Archive
          </Link>
        </div>
      )}

      <div ref={sentinelRef} className={styles.sentinel} />

      {hasLoadedAll && (
        <div className={styles.archiveBlock}>
          <Link href={archiveHref} className={styles.archiveButton}>
            Browse the Full News Archive
          </Link>
        </div>
      )}
    </section>
  )
}