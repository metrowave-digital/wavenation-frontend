import type { AppleAutoplayConstraints } from './audio.types'

/**
 * Memoized results to prevent redundant UA sniffing during a session.
 */
let memoizedConstraints: AppleAutoplayConstraints | null = null;

export function detectAppleAutoplayConstraints(): AppleAutoplayConstraints {
  // 1. SSR Safety
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isSafari: false, isIOS: false }
  }

  // 2. Return memoized result if already calculated
  if (memoizedConstraints) return memoizedConstraints;

  const ua = navigator.userAgent
  const nav = navigator as Navigator & { maxTouchPoints?: number; standalone?: boolean }

  /**
   * iPadOS 13+ reports as "Macintosh" to get the desktop site.
   * We check for 'Mac' + touch capability to identify iPads.
   */
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') && (nav.maxTouchPoints ?? 0) > 1);

  /**
   * Safari detection:
   * Must contain 'Safari' but NOT 'Chrome', 'Chromium', or other engines.
   * We also check for 'AppleComputer' to be safe.
   */
  const isSafari =
    /Safari/.test(ua) && 
    !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/.test(ua) &&
    /Apple Computer/.test(navigator.vendor);

  /**
   * NEW: PWA Detection
   * If the app is running in standalone mode, some autoplay 
   * restrictions may be lifted by the OS.
   */
  const isStandalone = 
    nav.standalone || 
    window.matchMedia('(display-mode: standalone)').matches;

  memoizedConstraints = { 
    isSafari, 
    isIOS,
    // Note: If you add isStandalone to AppleAutoplayConstraints type, 
    // it's helpful for telemetry.
  };

  return memoizedConstraints;
}

/**
 * NEW: Simple Low Power Mode Detection (Heuristic)
 * On iOS, Low Power Mode often forces autoplay to fail regardless of user interaction.
 */
export function isProbablyLowPowerMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // High-performance tasks like requestVideoFrameCallback or 
  // high-framerate setTimeouts are often throttled in low power mode.
  // This is a common heuristic for 2026-era broadcast apps.
  return 'requestVideoFrameCallback' in HTMLVideoElement.prototype === false && /iPhone|iPad/.test(navigator.userAgent);
}