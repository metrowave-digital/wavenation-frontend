import type { AppleAutoplayConstraints } from './audio.types'

export function detectAppleAutoplayConstraints(): AppleAutoplayConstraints {
  if (typeof navigator === 'undefined') {
    return { isSafari: false, isIOS: false }
  }

  const ua = navigator.userAgent
  const nav = navigator as Navigator & { maxTouchPoints?: number }

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') &&
      typeof nav.maxTouchPoints === 'number' &&
      nav.maxTouchPoints > 1)

  const isSafari =
    /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/.test(ua)

  return { isSafari, isIOS }
}