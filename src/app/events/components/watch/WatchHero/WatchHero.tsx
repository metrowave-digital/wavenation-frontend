import Image from 'next/image'
import styles from './WatchHero.module.css'

type WatchHeroProps = {
  title: string
  excerpt?: string | null
  startAt?: string | null
  timezone?: string | null
  hostName?: string | null
  guestName?: string[]
  accessType?: 'open' | 'ticketed' | 'invite-only' | 'members-only' | null
  viewerNotice?: string | null
  isLive: boolean
  isReplay: boolean
  isScheduled: boolean
  streamProviderLabel?: string | null
  contentVertical?: string | null
  replayLabel?: string | null
  heroImage?: {
    url: string | null
    alt: string | null
    width: number | null
    height: number | null
    sizes: {
      hero: string | null
      card: string | null
      thumb: string | null
      square: string | null
    }
  } | null
}

function formatEventTime(
  dateString?: string | null,
  timezone?: string | null,
) {
  if (!dateString) return null

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  }).format(new Date(dateString))
}

export function WatchHero({
  title,
  excerpt,
  startAt,
  timezone,
  hostName,
  guestName = [],
  accessType,
  viewerNotice,
  isLive,
  isReplay,
  isScheduled,
  streamProviderLabel,
  contentVertical,
  replayLabel,
  heroImage,
}: WatchHeroProps) {
  const imageSrc =
    heroImage?.sizes.card || heroImage?.url || null

  return (
    <section className={styles.hero}>
      <div className={styles.media}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={heroImage?.alt || title}
            fill
            sizes="(max-width: 1080px) 100vw, 420px"
            className={styles.image}
          />
        ) : (
          <div className={styles.fallback} />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.badges}>
          {isLive ? (
            <span className={`${styles.badge} ${styles.liveBadge}`}>
              <span className={styles.pulse} />
              LIVE NOW
            </span>
          ) : null}

          {isReplay ? (
            <span className={`${styles.badge} ${styles.replayBadge}`}>
              {replayLabel || 'REPLAY'}
            </span>
          ) : null}

          {isScheduled ? (
            <span className={`${styles.badge} ${styles.soonBadge}`}>
              STARTS SOON
            </span>
          ) : null}

          {streamProviderLabel ? (
            <span className={styles.badge}>{streamProviderLabel}</span>
          ) : null}

          {contentVertical ? (
            <span className={styles.badge}>
              {contentVertical.toUpperCase()}
            </span>
          ) : null}
        </div>

        <h1 className={styles.title}>{title}</h1>

        {excerpt ? (
          <p className={styles.excerpt}>{excerpt}</p>
        ) : null}

        <div className={styles.meta}>
          {startAt ? (
            <span>Starts: {formatEventTime(startAt, timezone)}</span>
          ) : null}
          {hostName ? <span>Host: {hostName}</span> : null}
          {guestName.length ? (
            <span>Guest: {guestName.join(', ')}</span>
          ) : null}
          {accessType ? <span>Access: {accessType}</span> : null}
        </div>

        {viewerNotice ? (
          <div className={styles.notice}>{viewerNotice}</div>
        ) : null}
      </div>
    </section>
  )
}