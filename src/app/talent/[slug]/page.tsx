import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTalentBySlug } from '@/services/talent.api'
import styles from './TalentDetail.module.css'

/* ======================================================
   Interfaces
====================================================== */
interface LexicalNode {
  text?: string
  type: string
  children?: LexicalNode[]
}

interface MediaAsset {
  url: string
  alt?: string
}

interface AssociatedShow {
  id: string | number
  title: string
  slug: string
  showType: string
  description?: string | null
  logo?: MediaAsset | null
}

/* ======================================================
   SEO & Metadata
====================================================== */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const talent = await getTalentBySlug(slug)
  
  if (!talent) return { title: 'Talent Not Found' }

  return {
    title: `${talent.displayName} — WaveNation Talent`,
    description: talent.shortBio,
  }
}

/* ======================================================
   Page Component
====================================================== */
export default async function TalentProfile(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const talent = await getTalentBySlug(slug)

  if (!talent) {
    notFound()
  }

  const bioParagraphs: LexicalNode[] = talent.fullBio?.root?.children || []
  const headshot = talent.mediaAssets?.headshot

  return (
    <div className={styles.page}>
      {/* Broadcast Texture Overlay */}
      <div className={styles.textureOverlay} />

      <main className={styles.main}>
        
        {/* ===============================
            PROFILE SECTION 
        =============================== */}
        <section className={styles.profileSplit}>
          <div className={styles.portraitWrapper}>
            {headshot?.url ? (
              <div className={styles.imageContainer}>
                <Image 
                  src={headshot.url}
                  alt={headshot.alt || talent.displayName}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className={styles.portraitImage}
                  priority
                />
                {/* Studio Monitor Effect */}
                <div className={styles.scanlines} />
                <div className={styles.vignette} />
              </div>
            ) : (
              <div className={styles.portraitPlaceholder} />
            )}
          </div>
          
          <div className={styles.profileInfo}>
            <div className={styles.badgeRow}>
              <span className={styles.onAirBadge}>LIVE ROSTER</span>
              <span className={styles.categoryBadge}>{talent.role || 'HOST'}</span>
            </div>
            
            <h1 className={styles.name}>{talent.displayName}</h1>
            
            <div className={styles.bioContainer}>
              <p className={styles.shortBio}>{talent.shortBio}</p>
              
              <div className={styles.fullBio}>
                {bioParagraphs.map((paragraph, pIdx) => (
                  <p key={`p-${pIdx}`}>
                    {paragraph.children?.map((node, nIdx) => {
                      if (node.type === 'text') {
                        return <span key={`n-${nIdx}`}>{node.text}</span>
                      }
                      return null
                    })}
                  </p>
                ))}
              </div>
            </div>
            
            <div className={styles.socialRow}>
              {talent.socials?.instagram && (
                <a href={talent.socials.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
              )}
              {talent.socials?.twitter && (
                <a href={talent.socials.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>X</a>
              )}
              {talent.socials?.tiktok && (
                <a href={talent.socials.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>TikTok</a>
              )}
              {talent.socials?.youtube && (
                <a href={talent.socials.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>YouTube</a>
              )}
              {talent.bookingInfo?.bookingEmail && (
                 <a href={`mailto:${talent.bookingInfo.bookingEmail}`} className={styles.bookingLink}>
                   Book Talent
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                     <path d="M5 12h14m-7-7 7 7-7 7"/>
                   </svg>
                 </a>
              )}
            </div>
          </div>
        </section>

        {/* ===============================
            ANIMATED EQ SEPARATOR
        =============================== */}
        {talent.associatedShows && talent.associatedShows.length > 0 && (
          <div className={styles.eqSeparator}>
            <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
            <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
            <div className={styles.eqBar} style={{ animationDelay: '0.0s' }} />
            <span className={styles.eqText}>PROGRAMMING</span>
            <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
            <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
            <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
          </div>
        )}

        {/* ===============================
            ASSOCIATED PROGRAMMING
        =============================== */}
        {talent.associatedShows && talent.associatedShows.length > 0 && (
          <section className={styles.programmingSection}>
            <div className={styles.showsGrid}>
              {talent.associatedShows.map((show: AssociatedShow, index: number) => (
                <Link 
                  key={show.id} 
                  href={`/shows/${show.slug}`} 
                  className={styles.showCard}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={styles.showCardHeader}>
                    {show.logo?.url ? (
                      <Image 
                        src={show.logo.url} 
                        alt={show.title} 
                        fill 
                        className={styles.showLogo} 
                      />
                    ) : (
                      <div className={styles.showLogoPlaceholder}>{show.title.charAt(0)}</div>
                    )}
                    <div className={styles.cardOverlay}>
                      <span className={styles.viewShowText}>VIEW SHOW</span>
                    </div>
                  </div>
                  
                  <div className={styles.showCardBody}>
                    <div className={styles.showMeta}>
                      <span className={styles.showEyebrow}>{show.showType}</span>
                      <h3 className={styles.showTitle}>{show.title}</h3>
                    </div>
                    {show.description && (
                      <p className={styles.showDescription}>{show.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}