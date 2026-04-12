import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getShowBySlug } from '@/services/shows.api' 
import styles from './ShowDetail.module.css'

/* ======================================================
   Interfaces
====================================================== */
interface MediaAsset {
  url: string
  alt?: string
  sizes?: {
    card?: { url: string }
    hero?: { url: string }
  }
}

interface Host {
  id: string | number
  slug: string
  displayName: string
  mediaAssets?: {
    headshot?: MediaAsset
  }
}

interface Schedule {
  days?: string[]
  startTime?: string
  endTime?: string
  timezone?: string
}

interface ShowDetail {
  id: string | number
  title: string
  slug: string
  description?: string
  status: string
  showType?: string
  themeColor?: string
  genres?: string[]
  standardSchedule?: Schedule
  logo?: MediaAsset
  hosts?: Host[]
}

/* ======================================================
   Metadata & Page Component
====================================================== */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const show: ShowDetail = await getShowBySlug(slug)
  
  if (!show) return { title: 'Show Not Found' }

  return {
    title: `${show.title} — WaveNation Programming`,
    description: show.description?.substring(0, 160) || `Listen to ${show.title} on WaveNation.`,
  }
}

export default async function ShowProfile(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const show: ShowDetail = await getShowBySlug(slug)

  if (!show) {
    notFound()
  }

  // --- Data Formatting ---
  const logoUrl = show.logo?.sizes?.hero?.url || show.logo?.sizes?.card?.url || show.logo?.url
  const themeColor = show.themeColor || '#00F0FF'
  
  // Format Description (Split by newlines to create paragraphs)
  const descriptionParagraphs = show.description 
    ? show.description.split('\n').filter((p: string) => p.trim() !== '') 
    : []

  // Format Schedule
  let scheduleDisplay = 'Schedule TBA'
  const sched = show.standardSchedule
  if (sched && sched.days && sched.days.length > 0) {
    const days = sched.days.join(', ')
    const times = (sched.startTime && sched.endTime) 
      ? `| ${sched.startTime} - ${sched.endTime}` 
      : ''
    const tzLabel = sched.timezone?.includes('Central') ? 'CST' : 'EST'
    scheduleDisplay = `${days} ${times} ${times ? tzLabel : ''}`
  }

  return (
    <div className={styles.page}>
      {/* Texture Overlay */}
      <div className={styles.textureOverlay} />

      <main className={styles.main}>
        
        {/* ===============================
            SHOW HERO SPLIT 
        =============================== */}
        <section className={styles.heroSplit} style={{ '--theme-color': themeColor } as React.CSSProperties}>
          
          <div className={styles.artWrapper}>
            {logoUrl ? (
              <div className={styles.imageContainer}>
                <Image 
                  src={logoUrl}
                  alt={show.logo?.alt || show.title}
                  fill
                  className={styles.heroLogo}
                  priority
                />
                <div className={styles.scanlines} />
                <div className={styles.vignette} />
              </div>
            ) : (
              <div className={styles.artPlaceholder}>
                <h1 className={styles.fallbackTitle}>{show.title}</h1>
              </div>
            )}
          </div>
          
          <div className={styles.showInfo}>
            <div className={styles.badgeRow}>
              <span className={styles.statusBadge}>
                {show.status === 'published' || show.status === 'active' ? 'ON AIR' : show.status.toUpperCase()}
              </span>
              <span className={styles.typeBadge}>{show.showType?.replace('_', ' ')}</span>
            </div>
            
            <h1 className={styles.name}>{show.title}</h1>
            
            <div className={styles.metaBox}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>BROADCAST</span>
                <span className={styles.metaValue}>{scheduleDisplay}</span>
              </div>
              {show.genres && show.genres.length > 0 && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>GENRES</span>
                  <span className={styles.metaValue}>{show.genres.join(', ').replace('_', ' ')}</span>
                </div>
              )}
            </div>

            <div className={styles.descriptionBox}>
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
        </section>

        {/* ===============================
            HOSTS SECTION
        =============================== */}
        {show.hosts && show.hosts.length > 0 && (
          <>
            <div className={styles.eqSeparator} style={{ '--theme-color': themeColor } as React.CSSProperties}>
              <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
              <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
              <div className={styles.eqBar} style={{ animationDelay: '0.0s' }} />
              <span className={styles.eqText}>HOSTED BY</span>
              <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
              <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
              <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
            </div>

            <section className={styles.hostsSection}>
              <div className={styles.hostsGrid}>
                {/* FIX: Replaced 'any' with 'Host' interface */}
                {show.hosts.map((host: Host, index: number) => {
                  const headshot = host.mediaAssets?.headshot?.sizes?.card?.url || host.mediaAssets?.headshot?.url

                  return (
                    <Link 
                      key={host.id} 
                      href={`/talent/${host.slug}`} 
                      className={styles.hostCard}
                      style={{ animationDelay: `${index * 0.15}s`, '--theme-color': themeColor } as React.CSSProperties}
                    >
                      <div className={styles.hostAvatarContainer}>
                        {headshot ? (
                          <Image 
                            src={headshot} 
                            alt={host.displayName} 
                            fill 
                            className={styles.hostAvatar} 
                          />
                        ) : (
                          <div className={styles.hostAvatarPlaceholder} />
                        )}
                        <div className={styles.scanlines} />
                      </div>
                      <div className={styles.hostDetails}>
                        <span className={styles.hostRole}>WAVENATION TALENT</span>
                        <h3 className={styles.hostName}>{host.displayName}</h3>
                        <span className={styles.viewProfileBtn}>VIEW PROFILE &rarr;</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}