'use client'

import styles from './VideoBlock.module.css'

/* ======================================================
   Types (API-aligned)
====================================================== */

export interface VideoBlockData {
  blockType: 'video'
  provider?: 'youtube'
  url?: string
  caption?: string
  blockName?: string | null
}

/* ======================================================
   Props
====================================================== */

interface Props {
  block: VideoBlockData
}

/* ======================================================
   Component
====================================================== */

export function VideoBlock({ block }: Props) {
  if (!block?.url) return null

  const youtubeId =
    block.provider === 'youtube'
      ? extractYouTubeId(block.url)
      : null

  if (!youtubeId) return null

  return (
    <section className={styles.videoBlock}>
      {block.blockName && (
        <h3 className={styles.heading}>{block.blockName}</h3>
      )}

      <div className={styles.videoWrap}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={block.caption || 'Embedded video'}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {block.caption && (
        <p className={styles.caption}>{block.caption}</p>
      )}
    </section>
  )
}

/* ======================================================
   Utils
====================================================== */

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)

    // Standard watch URL
    const v = parsed.searchParams.get('v')
    if (v) return v

    // youtu.be short links or embed paths
    const parts = parsed.pathname.split('/')
    return parts.pop() || null
  } catch {
    return null
  }
}
