'use client'

import type { VideoBlockData } from '../types'
import styles from './VideoBlock.module.css'

interface Props {
  block: VideoBlockData
}

function getYouTubeEmbedUrl(input: string): string | null {
  try {
    const url = new URL(input)

    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v')
      if (!id) return null
      return `https://www.youtube.com/embed/${id}`
    }

    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '').trim()
      if (!id) return null
      return `https://www.youtube.com/embed/${id}`
    }

    return null
  } catch {
    return null
  }
}

function getVimeoEmbedUrl(input: string): string | null {
  try {
    const url = new URL(input)
    if (!url.hostname.includes('vimeo.com')) return null

    const id = url.pathname.split('/').filter(Boolean)[0]
    if (!id) return null

    return `https://player.vimeo.com/video/${id}`
  } catch {
    return null
  }
}

export function VideoBlock({ block }: Props) {
  const {
    provider,
    url,
    file,
    caption,
    aspectRatio,
    autoplay,
    muted,
    controls,
  } = block

  const safeAspectRatio = aspectRatio ?? '16:9'
  const safeAutoplay = autoplay ?? false
  const safeMuted = muted ?? false
  const safeControls = controls ?? true

  const isYouTube = (provider ?? '').toLowerCase() === 'youtube'
  const isVimeo = (provider ?? '').toLowerCase() === 'vimeo'

  const iframeSrc = isYouTube && url ? getYouTubeEmbedUrl(url) : null
  const vimeoSrc = isVimeo && url ? getVimeoEmbedUrl(url) : null

  const nativeSrc =
    file?.url ?? (!isYouTube && !isVimeo ? url ?? null : null)

  if (!iframeSrc && !vimeoSrc && !nativeSrc) return null

  // ---------------------------------------------
  // Auto eyebrow
  // ---------------------------------------------
  const eyebrow =
    iframeSrc || vimeoSrc ? 'Video' : 'Watch'

  return (
    <figure className={styles.wrapper}>
      {/* ===== EYEBROW ===== */}
      <span className={styles.eyebrow}>
        {eyebrow}
      </span>

      <div
        className={`${styles.videoContainer} ${
          styles[`ratio_${safeAspectRatio.replace(':', '_')}`]
        }`}
      >
        {iframeSrc || vimeoSrc ? (
          <iframe
            className={styles.iframe}
            src={iframeSrc ?? vimeoSrc ?? undefined}
            title={caption ?? 'Embedded video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video
            src={nativeSrc ?? undefined}
            className={styles.video}
            playsInline
            preload="metadata"
            autoPlay={safeAutoplay}
            muted={safeMuted}
            controls={safeControls}
          />
        )}
      </div>

      {caption && (
        <figcaption className={styles.caption}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
