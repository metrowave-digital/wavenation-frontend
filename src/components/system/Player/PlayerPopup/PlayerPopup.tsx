'use client'

import { useEffect, useState } from 'react'
import { MobilePlayerPopup } from './MobilePlayerPopup'
import { DesktopPlayerPopup } from './DesktopPlayerPopup'
import { usePlayerPopupData, type RecentTrack } from './usePlayerPopupData'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const updateMatch = () => setMatches(mediaQuery.matches)

    updateMatch()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatch)
      return () => mediaQuery.removeEventListener('change', updateMatch)
    }

    mediaQuery.addListener(updateMatch)
    return () => mediaQuery.removeListener(updateMatch)
  }, [query])

  return matches
}

interface PlayerPopupProps {
  open: boolean
  onClose: () => void
}

export function PlayerPopup({ open, onClose }: PlayerPopupProps) {
  const isDesktop = useMediaQuery('(min-width: 900px)')

  const recent: RecentTrack[] = [] // TODO: replace with Redis-backed API

  const { normalizedNow, showData, recentFive, isPlaying } =
    usePlayerPopupData(recent)

  if (!open) return null
  if (isDesktop === null) return null

  const sharedProps = {
    open,
    onClose,
    normalizedNow,
    showData,
    recent: recentFive,
    isPlaying,
  }

  return isDesktop ? (
    <DesktopPlayerPopup {...sharedProps} />
  ) : (
    <MobilePlayerPopup {...sharedProps} />
  )
}