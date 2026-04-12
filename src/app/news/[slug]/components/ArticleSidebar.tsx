import Image from 'next/image'
import Link from 'next/link'
import type { Author, Tag } from '../../news.types'
import styles from './ArticleSidebar.module.css'

export function ArticleSidebar({ author, tags }: { author?: Author; tags?: Tag[] }) {
  
  const authorBio = author?.bio?.root?.children
    ?.filter(p => p.type === 'paragraph')
    ?.map(p => p.children?.map(n => n.text).join(''))
    ?.join(' ')

  return (
    <aside className={styles.sidebar}>
      
      {/* Hyperlinked Author Card */}
      {author && author.slug && (
        <div className={styles.authorCard}>
          <Link href={`/authors/${author.slug}`} className={styles.authorHeaderLink}>
            <div className={styles.authorHeader}>
              <div className={styles.avatarWrapper}>
                {author.avatar?.url ? (
                  <Image 
                    src={author.avatar.url} 
                    alt={author.fullName} 
                    fill 
                    className={styles.avatarImage} 
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>{author.fullName.charAt(0)}</div>
                )}
              </div>
              <div className={styles.authorMeta}>
                <span className={styles.authorEyebrow}>WRITTEN BY</span>
                <h3 className={styles.authorName}>{author.fullName}</h3>
              </div>
            </div>
          </Link>
          
          {authorBio && <p className={styles.authorBio}>{authorBio.substring(0, 150)}...</p>}
          
          {author.socialLinks && author.socialLinks.length > 0 && (
            <div className={styles.socialRow}>
              {author.socialLinks.map(social => (
                <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  {social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags Panel */}
      {tags && tags.length > 0 && (
        <div className={styles.tagsPanel}>
          <h4 className={styles.panelTitle}>RELATED TOPICS</h4>
          <div className={styles.tagsContainer}>
            {tags.map(tag => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className={styles.tagPill}>
                #{tag.label}
              </Link>
            ))}
          </div>
        </div>
      )}

    </aside>
  )
}