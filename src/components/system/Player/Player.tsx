'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { MoreHorizontal } from 'lucide-react'
import styles from './Player.module.css'

import { PlayerInfo } from './PlayerInfo/PlayerInfo'
import { PlayerControls } from './PlayerControls/PlayerControls'
import { PlayerProgress } from './PlayerProgress/PlayerProgress'
import { PlayerActions } from './PlayerActions/PlayerActions'
import { PlayerPopup } from './PlayerPopup/PlayerPopup'
import { PlayerMobileDock } from './PlayerMobileDock/PlayerMobileDock'
import { PlayerMobileMoreSheet } from './PlayerMobileMoreSheet/PlayerMobileMoreSheet'

const MOBILE_BREAKPOINT = 960
const HIDE_SCROLL_THRESHOLD = 14
const ELEVATE_SCROLL_Y = 10
const CONDENSE_SCROLL_Y = 28
const HIDE_SCROLL_Y = 140
const INFO_EXPANDED_MS = 5000

function getIsMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= MOBILE_BREAKPOINT
}

export function Player() {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const lastScrollYRef = useRef(0)
  const tickingRef = useRef(false)
  const collapseTimerRef = useRef<number | null>(null)

  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [popupOpen, setPopupOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isElevated, setIsElevated] = useState(false)
  const [isCondensed, setIsCondensed] = useState(false)
  const [showExpandedInfo, setShowExpandedInfo] = useState(true)

  const overlayOpen = popupOpen || moreOpen

  function openPopup() {
    setMoreOpen(false)
    setPopupOpen(true)
  }

  function closePopup() {
    setPopupOpen(false)
  }

  function openMore() {
    setPopupOpen(false)
    setMoreOpen(true)
  }

  function closeMore() {
    setMoreOpen(false)
  }

  useEffect(() => {
    const onResize = () => {
      const mobile = getIsMobile()
      setIsMobile(mobile)

      if (!mobile) {
        setMoreOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    collapseTimerRef.current = window.setTimeout(() => {
      setShowExpandedInfo(false)
    }, INFO_EXPANDED_MS)

    return () => {
      if (collapseTimerRef.current) {
        window.clearTimeout(collapseTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const updatePlayerHeight = () => {
      const node = frameRef.current
      if (!node) return

      const height = Math.ceil(node.getBoundingClientRect().height)
      if (height > 0 && height < window.innerHeight * 0.5) {
        document.documentElement.style.setProperty('--player-height', `${height}px`)
      }
    }

    const node = frameRef.current
    if (!node) return

    updatePlayerHeight()

    const observer = new ResizeObserver(() => {
      updatePlayerHeight()
    })

    observer.observe(node)
    window.addEventListener('resize', updatePlayerHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePlayerHeight)
      document.documentElement.style.removeProperty('--player-height')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('player-open', overlayOpen)
    document.body.classList.toggle('player-open', overlayOpen)

    return () => {
      document.documentElement.classList.remove('player-open')
      document.body.classList.remove('player-open')
    }
  }, [overlayOpen])

  useEffect(() => {
    const applyScrollState = () => {
      const currentY = window.scrollY
      const previousY = lastScrollYRef.current
      const delta = currentY - previousY
      const absDelta = Math.abs(delta)
      const scrollingDown = delta > 0
      const scrollingUp = delta < 0

      if (currentY > 0 && showExpandedInfo) {
        setShowExpandedInfo(false)

        if (collapseTimerRef.current) {
          window.clearTimeout(collapseTimerRef.current)
          collapseTimerRef.current = null
        }
      }

      if (!overlayOpen) {
        setIsElevated(currentY > ELEVATE_SCROLL_Y)
        setIsCondensed(currentY > CONDENSE_SCROLL_Y)

        if (currentY <= 12) {
          setIsHidden(false)
        } else if (absDelta >= HIDE_SCROLL_THRESHOLD) {
          if (scrollingDown && currentY > HIDE_SCROLL_Y) {
            setIsHidden(true)
          }

          if (scrollingUp) {
            setIsHidden(false)
          }
        }
      }

      lastScrollYRef.current = currentY
      tickingRef.current = false
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      window.requestAnimationFrame(applyScrollState)
    }

    lastScrollYRef.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      tickingRef.current = false
    }
  }, [overlayOpen, showExpandedInfo])

  const shellClassName = useMemo(
    () =>
      clsx(
        styles.playerShell,
        isMobile ? styles.isMobile : styles.isDesktop,
        isHidden && !overlayOpen && styles.isHidden,
        (isElevated || overlayOpen) && styles.isElevated,
        isCondensed && !overlayOpen && styles.isCondensed,
        popupOpen && styles.isExpanded,
        moreOpen && styles.isSheetOpen,
        overlayOpen && styles.hasOverlayOpen,
        showExpandedInfo && styles.infoExpanded
      ),
    [
      isMobile,
      isHidden,
      isElevated,
      isCondensed,
      popupOpen,
      moreOpen,
      overlayOpen,
      showExpandedInfo,
    ]
  )

  return (
    <>
      <div className={styles.playerSpacer} aria-hidden="true" />

      <section
        className={shellClassName}
        role="region"
        aria-label="Persistent audio player"
      >
        <div ref={frameRef} className={styles.playerFrame}>
          <div className={styles.playerInner}>
            <div className={styles.playerBackdrop} aria-hidden="true" />
            <div className={styles.playerGlow} aria-hidden="true" />
            <div className={styles.playerNoise} aria-hidden="true" />
            <div className={styles.playerShine} aria-hidden="true" />
            <div className={styles.playerBorder} aria-hidden="true" />

            <div className={styles.desktopPlayer}>
              <div className={styles.infoColumn}>
                <PlayerInfo expanded={showExpandedInfo} />
              </div>

              <div className={styles.progressColumn}>
                <PlayerProgress />
              </div>

              <div className={styles.controlsColumn}>
                <PlayerControls placement="sticky_player" />
              </div>

              <div className={styles.actionsColumn}>
                <PlayerActions
                  placement="sticky_player"
                  onExpand={openPopup}
                />
              </div>
            </div>

            <div className={styles.mobileDock}>
              <PlayerMobileDock onOpenPlayer={openPopup} onOpenMore={openMore} />
            </div>

            <button
              type="button"
              className={styles.mobileMoreTrigger}
              onClick={openMore}
              aria-label="Open more player options"
            >
              <MoreHorizontal className={styles.mobileMoreIcon} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <PlayerPopup open={popupOpen} onClose={closePopup} />

      <PlayerMobileMoreSheet
        open={moreOpen}
        onClose={closeMore}
        onOpenPlayer={openPopup}
      />
    </>
  )
}