import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTalentRoster } from '@/services/talent.api'
import { TalentSpotlight } from './TalentSpotlight'
import type { Talent } from './talent.types'
import styles from './TalentPage.module.css'

export const metadata: Metadata = {
  title: 'WaveNation Talent — Hosts, DJs, and Creators',
  description: 'Meet the voices behind WaveNation. The culture-makers driving our programming.',
}

export default async function TalentPage() {
  const roster: Talent[] = await getTalentRoster()

  return (
    <div className={styles.page}>
      {/* Ambient Background Noise */}
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.mainTitle}>WaveNation<br/><span>Voices</span></h1>
        </header>

        <section className={styles.spotlightSection}>
          <TalentSpotlight allTalent={roster} />
        </section>

        {/* Animated Audio EQ Separator */}
        <div className={styles.eqSeparator}>
          <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.0s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
          <span className={styles.eqText}>LIVE ROSTER</span>
          <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.0s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
          <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
        </div>

        <section className={styles.rosterSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.rosterTitle}>The Roster</h2>
            <p className={styles.rosterCount}>{roster.length} CREATORS</p>
          </div>

          <div className={styles.cardGrid}>
            {roster.map((talent: Talent, index: number) => (
              <Link 
                key={talent.id} 
                href={`/talent/${talent.slug}`} 
                className={styles.talentCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cardHeader}>
                  {talent.mediaAssets?.headshot?.url ? (
                    <div className={styles.imageContainer}>
                      <Image 
                        src={talent.mediaAssets.headshot.url} 
                        alt={talent.displayName}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        className={styles.cardImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.cardPlaceholder}>
                      <span>{talent.displayName.charAt(0)}</span>
                    </div>
                  )}
                  <div className={styles.scanlines} />
                  <div className={styles.cardOverlay}>
                    <span className={styles.viewProfile}>VIEW PROFILE</span>
                  </div>
                </div>
                
                {/* Glassmorphism Lower Third */}
                <div className={styles.cardBody}>
                  <p className={styles.cardRole}>{talent.role || 'WAVENATION TALENT'}</p>
                  <h3 className={styles.cardName}>{talent.displayName}</h3>
                  <p className={styles.cardBio}>{talent.shortBio}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}