'use client'

import { useMemo } from 'react'
import { useAudio } from '@/components/player/audio/AudioContext'
import { useRadioUpNext } from '@/app/lib/shows/useRadioUpNext'
import { formatHHmm } from '@/lib/time'

export interface RecentTrack {
  key: string
  track: string
  artist: string
  artwork?: string | null
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function getShowHosts(radioShow: unknown): string | null {
  const rs = asRecord(radioShow)
  if (!rs) return null

  if (Array.isArray(rs.hosts)) {
    const names = rs.hosts
      .map(host => {
        const hostRecord = asRecord(host)
        return firstString(
          hostRecord?.name,
          hostRecord?.displayName,
          hostRecord?.title
        )
      })
      .filter(Boolean) as string[]

    return names.length ? names.join(', ') : null
  }

  return firstString(
    rs.hostNames,
    rs.hostName,
    rs.host,
    rs.dj,
    rs.presenter
  )
}

function getShowArtwork(radioShow: unknown): string | null {
  const rs = asRecord(radioShow)
  if (!rs) return null

  const image = asRecord(rs.image)
  const coverImage = asRecord(rs.coverImage)
  const hero = asRecord(rs.hero)
  const heroImage = hero ? asRecord(hero.image) : null
  const artwork = asRecord(rs.artwork)

  return firstString(
    rs.artwork,
    artwork?.url,
    image?.url,
    coverImage?.url,
    heroImage?.url,
    rs.thumbnail,
    rs.poster
  )
}

export function usePlayerPopupData(recent: RecentTrack[]) {
  const audio = useAudio()
  const { live, upNext } = useRadioUpNext()

  const now = audio.nowPlaying
  const show = live ?? upNext

  const normalizedNow = useMemo(() => {
    return {
      track: now.track?.trim() || 'Live Radio',
      artist: now.artist?.trim() || 'WaveNation',
      artwork: now.artwork || null,
    }
  }, [now.track, now.artist, now.artwork])

  const showData = useMemo(() => {
    return {
      isLive: Boolean(live),
      title: show?.radioShow?.title?.trim() || 'WaveNation Radio',
      hosts: getShowHosts(show?.radioShow),
      artwork: getShowArtwork(show?.radioShow),
      timeLabel: live
        ? 'Live now'
        : show?._start
        ? `Starts ${formatHHmm(show._start)}`
        : null,
    }
  }, [live, show])

  const recentFive = useMemo(() => recent.slice(0, 5), [recent])

  const isPlaying =
    typeof audio.currentTime === 'number' &&
    typeof audio.duration === 'number' &&
    audio.duration > 0 &&
    audio.currentTime > 0 &&
    audio.currentTime < audio.duration

  return {
    normalizedNow,
    showData,
    recentFive,
    isPlaying,
  }
}