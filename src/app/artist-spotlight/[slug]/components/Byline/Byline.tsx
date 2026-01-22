'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './Byline.module.css'
import { trackEvent } from '@/lib/analytics'

import type { ContributorAuthor } from '@/app/artist-spotlight/[slug]/types'

/* ======================================================
   Props
====================================================== */

interface Props {
  author: ContributorAuthor
  publishDate?: string | null
  readingTime?: string | null
}

/* ======================================================
   Helpers
====================================================== */

function getInitials(name?: string | null) {
  if (!name) return '—'

  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(date?: string | null) {
  if (!date || Number.isNaN(Date.parse(date))) return null

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/* ======================================================
   Component
====================================================== */

export function Byline({ author, publishDate, readingTime }: Props) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(author.displayName)
  const date = formatDate(publishDate)

  /* --------------------------------------------------
     Close hover card on outside click / escape
  -------------------------------------------------- */
  useEffect(() => {
    function handleClose(e: MouseEvent | KeyboardEvent) {
      if (
        e instanceof KeyboardEvent &&
        e.key === 'Escape'
      ) {
        setOpen(false)
      }

      if (
        e instanceof MouseEvent &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClose)
      document.addEventListener('keydown', handleClose)
    }

    return () => {
      document.removeEventListener('mousedown', handleClose)
      document.removeEventListener('keydown', handleClose)
    }
  }, [open])

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */
  return (
    <section
      ref={wrapperRef}
      className={styles.byline}
      aria-label="Article author information"
    >
      {/* ===============================
         Linked Author (Avatar + Meta)
      =============================== */}
      {author.slug ? (
        <Link
          href={`/contributors/${author.slug}`}
          className={styles.authorWrap}
          onClick={() =>
            trackEvent('author_click', {
              author: author.displayName,
              slug: author.slug,
              authorId: author.id,
            })
          }
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            {author.avatar?.url ? (
              <Image
                src={author.avatar.url}
                alt={author.avatar.alt ?? author.displayName}
                width={40}
                height={40}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {initials}
              </div>
            )}
          </div>

          {/* Meta */}
          <div className={styles.meta}>
            <div className={styles.authorRow}>
              <span className={styles.authorName}>
                {author.displayName}
              </span>

              {author.verified && (
                <span
                  className={styles.verified}
                  aria-label="Verified contributor"
                >
                  ✓
                </span>
              )}
            </div>

            {author.role && (
              <span className={styles.role}>
                {author.role}
              </span>
            )}

            <div className={styles.details}>
              {date && (
                <time dateTime={publishDate ?? undefined}>
                  {date}
                </time>
              )}
              {readingTime && <span> · {readingTime}</span>}
            </div>
          </div>
        </Link>
      ) : (
        /* ===============================
           Non-linked fallback
        =============================== */
        <>
          <div className={styles.avatarWrap}>
            {author.avatar?.url ? (
              <Image
                src={author.avatar.url}
                alt={author.displayName}
                width={40}
                height={40}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {initials}
              </div>
            )}
          </div>

          <div className={styles.meta}>
            <span className={styles.authorName}>
              {author.displayName}
            </span>
          </div>
        </>
      )}

      {/* ===============================
         Hover / Tap Bio Card
      =============================== */}
      {open && author.bio && (
        <aside
          className={styles.hoverCard}
          role="dialog"
          aria-label={`About ${author.displayName}`}
        >
          <div className={styles.hoverHeader}>
            {author.avatar?.url ? (
              <Image
                src={author.avatar.url}
                alt={author.displayName}
                width={48}
                height={48}
                className={styles.hoverAvatar}
              />
            ) : (
              <div className={styles.hoverAvatarFallback}>
                {initials}
              </div>
            )}

            <div>
              <strong>{author.displayName}</strong>
              {author.role && (
                <span className={styles.hoverRole}>
                  {author.role}
                </span>
              )}
            </div>
          </div>

          <p className={styles.hoverBio}>
            {author.bio}
          </p>
        </aside>
      )}
    </section>
  )
}
