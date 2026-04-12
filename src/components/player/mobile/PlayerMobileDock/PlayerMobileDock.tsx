'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Newspaper,
  Tv,
  Play,
  Pause,
  Radio,
  ChevronUp,
  User,
  MoreHorizontal,
  LoaderCircle,
} from 'lucide-react'
import clsx from 'clsx'
import styles from './PlayerMobileDock.module.css'
import { useAudio } from '@/components/player/audio/AudioContext'

type PlayerMobileDockProps = {
  onOpenPlayer: () => void
  onOpenMore: () => void
}

type DockItemProps = {
  href?: string
  label: string
  ariaLabel: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  active?: boolean
  onClick?: () => void
}

function DockItem({
  href,
  label,
  ariaLabel,
  icon: Icon,
  active = false,
  onClick,
}: DockItemProps) {
  const content = (
    <>
      <span className={styles.navIconWrap}>
        <Icon className={styles.navIcon} aria-hidden />
      </span>
      <span className={styles.navLabel}>{label}</span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(styles.navItem, active && styles.navItemActive)}
        aria-label={ariaLabel}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={clsx(styles.navItem, active && styles.navItemActive)}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {content}
    </button>
  )
}

export function PlayerMobileDock({
  onOpenPlayer,
  onOpenMore,
}: PlayerMobileDockProps) {
  const pathname = usePathname()

  const {
    playing,
    nowPlaying,
    play,
    pause,
    isLive,
    isBuffering,
    isReconnecting,
    streamHealthy,
  } = useAudio()

  const isHomeActive = pathname === '/'
  const isNewsActive = pathname === '/news' || pathname.startsWith('/news/')
  const isWatchActive = pathname === '/watch' || pathname.startsWith('/watch/')
  const isProfileActive =
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/')

  const title = nowPlaying.track || 'WaveNation FM Live'
  const subtitle = nowPlaying.artist || 'Urban hits, culture, and live programming'
  const artworkUrl = nowPlaying.artwork

  async function togglePlayback() {
    if (playing) {
      pause()
      return
    }
    await play()
  }

  const statusLabel = isReconnecting
    ? 'Reconnecting'
    : isBuffering
      ? 'Buffering'
      : playing
        ? 'Playing'
        : 'Paused'

  return (
    <nav className={styles.dock} aria-label="Mobile player dock">
      {/* =========================================================
          TOP ROW: MINI-PLAYER
      ========================================================= */}
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.miniplayer}
          onClick={onOpenPlayer}
          aria-label="Open full player"
        >
          {/* Artwork */}
          <span className={styles.artworkWrap} aria-hidden>
            {artworkUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artworkUrl} alt="" className={styles.artwork} />
            ) : (
              <span className={styles.artworkFallback}>
                <Radio size={16} className={styles.artworkFallbackIcon} aria-hidden />
              </span>
            )}
          </span>

          {/* Meta & Marquee Info */}
          <span className={styles.meta}>
            <span className={styles.metaTopline}>
              {isLive && (
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} /> LIVE
                </span>
              )}
              {!streamHealthy && <span className={styles.healthBadge}>WEAK SIGNAL</span>}
            </span>
            <span className={styles.trackTitle}>{title}</span>
            <span className={styles.trackSubtitle}>{subtitle}</span>
          </span>

          {/* Right Chevron */}
          <span className={styles.miniplayerRight}>
             <ChevronUp size={20} className={styles.expandIcon} aria-hidden />
          </span>
        </button>

        {/* More Button */}
        <button
          type="button"
          className={styles.moreButton}
          onClick={onOpenMore}
          aria-label="Open more player options"
        >
          <MoreHorizontal size={20} className={styles.moreButtonIcon} aria-hidden />
        </button>
      </div>

      {/* =========================================================
          BOTTOM ROW: NAVIGATION
      ========================================================= */}
      <div className={styles.navRow}>
        <DockItem href="/" label="Home" ariaLabel="Home" icon={Home} active={isHomeActive} />
        <DockItem href="/news" label="News" ariaLabel="News" icon={Newspaper} active={isNewsActive} />

        {/* Floating Action Button (FAB) for Play/Pause */}
        <div className={styles.centerAction}>
          <button
            type="button"
            className={clsx(styles.playerFab, playing && styles.playerFabPlaying)}
            onClick={() => void togglePlayback()}
            aria-label={playing ? 'Pause audio' : 'Play audio'}
            aria-pressed={playing}
          >
            <span className={styles.fabGlow} aria-hidden />
            {isBuffering || isReconnecting ? (
              <LoaderCircle size={24} className={clsx(styles.fabIcon, styles.spinning)} aria-hidden />
            ) : playing ? (
              <Pause size={24} className={styles.fabIcon} aria-hidden />
            ) : (
              <Play size={24} className={clsx(styles.fabIcon, styles.fabIconNudge)} aria-hidden />
            )}
          </button>
          <span className={styles.navLabel}>
            {isReconnecting ? 'Reconnect' : isBuffering ? 'Loading' : playing ? 'Pause' : 'Play'}
          </span>
        </div>

        <DockItem href="/watch" label="Watch" ariaLabel="Watch" icon={Tv} active={isWatchActive} />
        <DockItem href="/profile" label="Profile" ariaLabel="Profile" icon={User} active={isProfileActive} />
      </div>
    </nav>
  )
}