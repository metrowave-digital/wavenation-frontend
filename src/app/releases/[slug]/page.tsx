import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import styles from './ReleasePage.module.css'

// Analytics
import { ReleaseImpression } from '../ReleaseImpression'
import {
  trackTrackImpression,
  trackTrackPlay,
} from '../TrackAnalytics'

/* ======================================================
   Types (albums collection)
====================================================== */

type Media = {
  alt?: string | null
  url?: string | null
  sizes?: {
    square?: { url?: string | null }
    card?: { url?: string | null }
  } | null
}

type Track = {
  id: string
  title: string
  artist?: string | null
  isExplicit?: boolean | null
}

type Album = {
  title: string
  slug: string
  primaryArtist?: string | null
  releaseDate?: string | null
  label?: string | null
  coverArt?: Media | null
  manualTracks?: Track[]
  editorialNotes?: string | null
}

/* ======================================================
   Helpers
====================================================== */

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

function coverSrc(cover?: Media | null) {
  return (
    cover?.sizes?.square?.url ||
    cover?.sizes?.card?.url ||
    cover?.url ||
    null
  )
}

function formatDate(date?: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const dynamic = 'force-dynamic'

/* ======================================================
   Page
====================================================== */

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const res = await fetch(
    `${CMS_URL}/api/albums?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
    { cache: 'no-store' }
  )

  if (!res.ok) notFound()

  const data = await res.json()
  const album: Album | undefined = data?.docs?.[0]
  if (!album) notFound()

  const cover = coverSrc(album.coverArt)
  const tracks = album.manualTracks ?? []
  const date = formatDate(album.releaseDate)

  return (
    <main className={styles.page}>
      {/* ===============================
         Release Impression (Analytics)
      =============================== */}
      <ReleaseImpression
        slug={album.slug}
        title={album.title}
        artist={album.primaryArtist ?? undefined}
        label={album.label ?? undefined}
        releaseDate={album.releaseDate}
      />

      <div className={styles.glow} aria-hidden />

      <div className={styles.container}>
        <Link href="/releases" className={styles.back}>
          ← Releases
        </Link>

        {/* ===============================
           HERO
        =============================== */}
        <section className={styles.hero}>
          {cover && (
            <div className={styles.coverWrap}>
              <Image
                src={cover}
                alt={album.coverArt?.alt ?? album.title}
                width={900}
                height={900}
                priority
                className={styles.cover}
              />
            </div>
          )}

          <div className={styles.heroText}>
            <h1 className={styles.title}>{album.title}</h1>

            <div className={styles.meta}>
              {album.primaryArtist && (
                <span className={styles.metaPill}>
                  {album.primaryArtist}
                </span>
              )}
              {date && (
                <span className={styles.metaPill}>{date}</span>
              )}
              {album.label && (
                <span className={styles.metaPill}>{album.label}</span>
              )}
            </div>

            {album.editorialNotes && (
              <p className={styles.description}>
                {album.editorialNotes}
              </p>
            )}
          </div>
        </section>

        {/* ===============================
           TRACKLIST
        =============================== */}
        <section className={styles.trackSection}>
          <h2 className={styles.sectionTitle}>Tracklist</h2>

          {tracks.length ? (
            <ol className={styles.tracklist}>
              {tracks.map((track, i) => {
                // fire impression once per render
                trackTrackImpression({
                  album: album.title,
                  track: track.title,
                  position: i + 1,
                })

                return (
                  <li key={track.id} className={styles.track}>
                    <span className={styles.trackNum}>
                      {(i + 1).toString().padStart(2, '0')}
                    </span>

                    <div className={styles.trackMain}>
                      <span className={styles.trackTitle}>
                        {track.title}
                        {track.isExplicit && (
                          <span className={styles.explicit}>E</span>
                        )}
                      </span>
                      <span className={styles.trackArtist}>
                        {track.artist ?? album.primaryArtist}
                      </span>
                    </div>

                    <button
                      className={styles.playBtn}
                      onClick={() =>
                        trackTrackPlay({
                          album: album.title,
                          track: track.title,
                          position: i + 1,
                        })
                      }
                    >
                      Play
                    </button>
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className={styles.empty}>No tracks listed.</p>
          )}
        </section>
      </div>
    </main>
  )
}
