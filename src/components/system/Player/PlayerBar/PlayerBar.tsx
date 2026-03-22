'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import { PlayerInfo } from '../PlayerInfo/PlayerInfo'
import { PlayerControls } from '../PlayerControls/PlayerControls'
import { PlayerProgress } from '../PlayerProgress/PlayerProgress'
import { PlayerActions } from '../PlayerActions/PlayerActions'
import { PlayerPopup } from '../PlayerPopup/PlayerPopup'

import styles from './PlayerBar.module.css'

const ELEVATE_SCROLL_Y = 10
const CONDENSE_SCROLL_Y = 28
const HIDE_SCROLL_Y = 140
const HIDE_SCROLL_THRESHOLD = 14
const INFO_EXPANDED_MS = 5000

export function PlayerBar() {
  const barRef = useRef<HTMLDivElement | null>(null)
  const lastScrollYRef = useRef(0)
  const tickingRef = useRef(false)
  const collapseTimerRef = useRef<number | null>(null)

  const [popupOpen, setPopupOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isElevated, setIsElevated] = useState(false)
  const [isCondensed, setIsCondensed] = useState(false)
  const [showExpandedInfo, setShowExpandedInfo] = useState(true)

  function openPopup() {
    setPopupOpen(true)
  }

  function closePopup() {
    setPopupOpen(false)
  }

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopupOpen(false)
      }
    }

    if (popupOpen) {
      document.documentElement.classList.add('player-open')
      document.body.classList.add('player-open')
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeyDown)
    } else {
      document.documentElement.classList.remove('player-open')
      document.body.classList.remove('player-open')
      document.body.style.overflow = ''
    }

    return () => {
      document.documentElement.classList.remove('player-open')
      document.body.classList.remove('player-open')
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [popupOpen])

  useEffect(() => {
    const updateBarHeight = () => {
      const node = barRef.current
      if (!node) return

      const height = Math.ceil(node.getBoundingClientRect().height)
      if (height > 0 && height < window.innerHeight * 0.5) {
        document.documentElement.style.setProperty('--player-bar-height', `${height}px`)
      }
    }

    const node = barRef.current
    if (!node) return

    updateBarHeight()

    const observer = new ResizeObserver(() => {
      updateBarHeight()
    })

    observer.observe(node)
    window.addEventListener('resize', updateBarHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBarHeight)
      document.documentElement.style.removeProperty('--player-bar-height')
    }
  }, [])

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

      if (!popupOpen) {
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
  }, [popupOpen, showExpandedInfo])

  const shellClassName = useMemo(
    () =>
      clsx(
        styles.shell,
        isHidden && !popupOpen && styles.isHidden,
        (isElevated || popupOpen) && styles.isElevated,
        isCondensed && !popupOpen && styles.isCondensed,
        popupOpen && styles.isExpanded,
        showExpandedInfo && styles.infoExpanded
      ),
    [isHidden, isElevated, isCondensed, popupOpen, showExpandedInfo]
  )

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />

      <section
        className={shellClassName}
        role="region"
        aria-label="Persistent audio player"
      >
        <div ref={barRef} className={styles.frame}>
          <div className={styles.bar}>
            <div className={styles.backdrop} aria-hidden="true" />
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.noise} aria-hidden="true" />
            <div className={styles.shine} aria-hidden="true" />
            <div className={styles.border} aria-hidden="true" />

            <div className={styles.inner}>
              <div className={styles.infoColumn}>
                <PlayerInfo expanded={showExpandedInfo} />
              </div>

              <div className={styles.centerColumn}>
                <div className={styles.controlsRow}>
                  <PlayerControls placement="sticky_player" />
                </div>

                <div className={styles.progressRow}>
                  <PlayerProgress />
                </div>
              </div>

              <div className={styles.actionsColumn}>
                <PlayerActions
                  placement="sticky_player"
                  onExpand={openPopup}
                  aria-haspopup="dialog"
                  aria-expanded={popupOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlayerPopup
        open={popupOpen}
        onClose={closePopup}
        aria-label="Expanded audio player"
      />
    </>
  )
}