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
import { useAudio } from '@/components/system/Player/audio/AudioContext'

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
                {!streamHealthy && (
                  <span className={styles.healthBadge}>Signal</span>
                )}
              </span>

              <span className={styles.trackTitle}>{title}</span>
              <span className={styles.trackSubtitle}>{subtitle}</span>
            </span>

            <span className={styles.miniplayerRight}>
              <span
                className={clsx(
                  styles.inlinePlaybackState,
                  playing && styles.inlinePlaybackStateActive,
                  (isBuffering || isReconnecting) && styles.inlinePlaybackStateBusy
                )}
              >
                {statusLabel}
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
            onClick={() => void togglePlayback()}
            aria-label={playing ? 'Pause audio' : 'Play audio'}
            aria-pressed={playing}
          >
            <span className={styles.playerButtonGlow} aria-hidden />
            <span className={styles.playerButtonCore}>
              {isBuffering || isReconnecting ? (
                <LoaderCircle className={clsx(styles.playerButtonIcon, styles.spinning)} aria-hidden />
              ) : playing ? (
                <Pause className={styles.playerButtonIcon} aria-hidden />
              ) : (
                <Play className={styles.playerButtonIcon} aria-hidden />
              )}
            </span>
          </button>

          <span className={styles.playerButtonLabel}>
            {isReconnecting ? 'Reconnect' : isBuffering ? 'Loading' : playing ? 'Pause' : 'Play'}
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