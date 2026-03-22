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
} from 'lucide-react'
import clsx from 'clsx'
import styles from './PlayerMobileDock.module.css'

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

type PlaybackState = {
  isPlaying: boolean
  title: string
  subtitle: string
  isLive: boolean
  artworkUrl?: string | null
  togglePlayback: () => void
}

function useMockPlaybackState(): PlaybackState {
  const isPlaying = false

  function togglePlayback() {
    console.log('toggle playback')
  }

  return {
    isPlaying,
    title: 'WaveNation FM Live',
    subtitle: 'Urban hits, culture, and live programming',
    isLive: true,
    artworkUrl: null,
    togglePlayback,
  }
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
    isPlaying,
    title,
    subtitle,
    isLive,
    artworkUrl,
    togglePlayback,
  } = useMockPlaybackState()

  const isHomeActive = pathname === '/'
  const isNewsActive = pathname === '/news' || pathname.startsWith('/news/')
  const isWatchActive = pathname === '/watch' || pathname.startsWith('/watch/')
  const isProfileActive =
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/')

  return (
    <nav className={styles.dock} aria-label="Mobile player dock">
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.miniplayer}
          onClick={onOpenPlayer}
          aria-label="Open full player"
        >
          <span className={styles.miniplayerGlow} aria-hidden />
          <span className={styles.miniplayerInner}>
            <span className={styles.artworkWrap} aria-hidden>
              {artworkUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={artworkUrl} alt="" className={styles.artwork} />
              ) : (
                <span className={styles.artworkFallback}>
                  <Radio className={styles.artworkFallbackIcon} aria-hidden />
                </span>
              )}
            </span>

            <span className={styles.meta}>
              <span className={styles.metaTopline}>
                {isLive && <span className={styles.liveBadge}>Live</span>}
                <span className={styles.nowPlayingLabel}>Now Playing</span>
              </span>

              <span className={styles.trackTitle}>{title}</span>
              <span className={styles.trackSubtitle}>{subtitle}</span>
            </span>

            <span className={styles.miniplayerRight}>
              <span
                className={clsx(
                  styles.inlinePlaybackState,
                  isPlaying && styles.inlinePlaybackStateActive
                )}
              >
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
              <ChevronUp className={styles.expandIcon} aria-hidden />
            </span>
          </span>
        </button>

        <button
          type="button"
          className={styles.moreButton}
          onClick={onOpenMore}
          aria-label="Open more player options"
        >
          <span className={styles.moreButtonGlow} aria-hidden />
          <MoreHorizontal className={styles.moreButtonIcon} aria-hidden />
        </button>
      </div>

      <div className={styles.navRow}>
        <DockItem
          href="/"
          label="Home"
          ariaLabel="Home"
          icon={Home}
          active={isHomeActive}
        />

        <DockItem
          href="/news"
          label="News"
          ariaLabel="News"
          icon={Newspaper}
          active={isNewsActive}
        />

        <div className={styles.centerAction}>
          <button
            type="button"
            className={styles.playerButton}
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            aria-pressed={isPlaying}
          >
            <span className={styles.playerButtonGlow} aria-hidden />
            <span className={styles.playerButtonCore}>
              {isPlaying ? (
                <Pause className={styles.playerButtonIcon} aria-hidden />
              ) : (
                <Play className={styles.playerButtonIcon} aria-hidden />
              )}
            </span>
          </button>

          <span className={styles.playerButtonLabel}>
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </div>

        <DockItem
          href="/watch"
          label="Watch"
          ariaLabel="Watch"
          icon={Tv}
          active={isWatchActive}
        />

        <DockItem
          href="/profile"
          label="Profile"
          ariaLabel="Profile"
          icon={User}
          active={isProfileActive}
        />
      </div>
    </nav>
  )
}