export type FadeController = {
  stop: () => void
  fadeInTo: (audio: HTMLAudioElement, target: number, ms?: number) => void
}

export function createFadeController(
  fadeRafRef: React.MutableRefObject<number | null>
): FadeController {
  function stop() {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }

  function fadeInTo(audio: HTMLAudioElement, target: number, ms = 650) {
    stop()

    const from = 0
    const to = Math.min(1, Math.max(0, target))
    const start = performance.now()

    audio.volume = 0
    audio.muted = false

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - t, 3)

      audio.volume = from + (to - from) * eased

      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(tick)
      } else {
        fadeRafRef.current = null
        audio.volume = to
      }
    }

    fadeRafRef.current = requestAnimationFrame(tick)
  }

  return {
    stop,
    fadeInTo,
  }
}