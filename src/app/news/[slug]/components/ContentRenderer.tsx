import type { ContentBlock, LexicalNode } from '../../news.types'
import styles from './ContentRenderer.module.css'

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null

  // Helper to safely extract YouTube ID from full URL
  const getYouTubeId = (url?: string) => {
    if (!url) return null
    const match = url.match(/[?&]v=([^&]+)/)
    return match ? match[1] : null
  }

  return (
    <div className={styles.articleBody}>
      {blocks.map((block, index) => {
        
        // 1. Render Rich Text Paragraphs
        if (block.blockType === 'richText' && block.content?.root?.children) {
          return (
            <div key={block.id || index} className={styles.textBlock}>
              {block.blockName && <h3 className={styles.blockHeading}>{block.blockName}</h3>}
              
              {block.content.root.children.map((paragraph, pIdx) => {
                if (paragraph.type !== 'paragraph') return null
                return (
                  <p key={`p-${block.id}-${pIdx}`} className={styles.paragraph}>
                    {paragraph.children?.map((node, nIdx) => (
                      <span key={`n-${block.id}-${pIdx}-${nIdx}`}>{node.text}</span>
                    ))}
                  </p>
                )
              })}
            </div>
          )
        }

        // 2. Render Videos
        if (block.blockType === 'video' && block.provider === 'youtube') {
          const videoId = getYouTubeId(block.url)
          if (!videoId) return null

          return (
            <div key={block.id || index} className={styles.videoBlock}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=${block.autoplay ? 1 : 0}`}
                  title={block.blockName || 'Embedded Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.iframe}
                />
              </div>
              {block.caption && <p className={styles.videoCaption}>{block.caption}</p>}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}