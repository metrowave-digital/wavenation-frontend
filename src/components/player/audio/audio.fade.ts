import { type MutableRefObject } from 'react'

/**
 * WAVENATION AUDIO FADE ENGINE
 * Handles smooth transitions with logarithmic-proxied curves.
 */

export type FadeController = {
  stop: () => void
  /** Fades from current volume to target. Returns Promise that resolves on completion. */
  fadeTo: (audio: HTMLAudioElement, target: number, ms?: number) => Promise<void>
  /** Dedicated helper to fade to zero and pause. */
  fadeOutAndStop: (audio: HTMLAudioElement, ms?: number) => Promise<void>
}

export function createFadeController(
  fadeRafRef: MutableRefObject<number | null>
): FadeController {
  
  function stop() {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }

  function fadeTo(audio: HTMLAudioElement, target: number, ms = 650): Promise<void> {
    return new Promise((resolve) => {
      stop()

      const from = audio.volume
      const to = Math.min(1, Math.max(0, target))
      
      // If duration is 0, jump immediately
      if (ms <= 0) {
        audio.volume = to
        resolve()
        return
      }

      const startTime = performance.now()
      audio.muted = false

      const tick = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / ms)

        /* ENHANCEMENT: Quintic Ease-Out
          This creates a much smoother "broadcast" feel than a linear fade.
        */
        const eased = 1 - Math.pow(1 - progress, 5)

        audio.volume = from + (to - from) * eased

        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          fadeRafRef.current = null
          audio.volume = to
          resolve()
        }
      }

      fadeRafRef.current = requestAnimationFrame(tick)
    })
  }

  async function fadeOutAndStop(audio: HTMLAudioElement, ms = 800) {
    await fadeTo(audio, 0, ms)
    audio.pause()
  }

  return {
    stop,
    fadeTo,
    fadeOutAndStop,
  }
}