'use client'

import { useEffect, useState } from 'react'
import { MobilePlayerPopup } from '../../player/overlays/MobilePlayerPopup'
import { DesktopPlayerPopup } from '../../player/overlays/DesktopPlayerPopup'
import { usePlayerPopupData, type RecentTrack } from './usePlayerPopupData'

// Matches the 960px breakpoint we used in the Player Shell CSS
const DESKTOP_BREAKPOINT = '(min-width: 960px)'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const updateMatch = () => setMatches(mediaQuery.matches)

    updateMatch()

    mediaQuery.addEventListener('change', updateMatch)
    return () => mediaQuery.removeEventListener('change', updateMatch)
  }, [query])

  return matches
}

export interface PlayerPopupProps {
  open: boolean
  onClose: () => void
}

export function PlayerPopup({ open, onClose }: PlayerPopupProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  // TODO: Replace with Redis-backed API or Context data
  const recent: RecentTrack[] = [] 

  const { normalizedNow, showData, recentFive, isPlaying } =
    usePlayerPopupData(recent)

  // Prevent hydration mismatch or rendering before breakpoint is known
  if (!open || isDesktop === null) return null

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