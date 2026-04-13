import Link from 'next/link';
import Image from 'next/image';
import { getPlaylists } from '@/services/playlists.api';
import { Disc3, ArrowRight } from 'lucide-react';
import styles from './Playlists.module.css';

export default async function PlaylistsIndex() {
  const playlists = await getPlaylists();
  
  // Isolate the first playlist for the spotlight
  const featured = playlists[0];
  const gridPlaylists = playlists.slice(1);

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.mainTitle}>
            CURATED<br /><span>AUDIO</span>
          </h1>
        </header>

        {featured && (
          <section className={styles.spotlightContainer}>
            <div className={styles.spotlightDecor}>AUDIO</div>
            <div className={styles.spotlightMain}>
              
              <div className={styles.spotlightContent}>
                <div className={styles.badgeRow}>
                  <span className={styles.onAirBadge}>FEATURED SOUND</span>
                  <span className={styles.categoryBadge}>{featured.playlistType || 'PLAYLIST'}</span>
                </div>
                
                <h2 className={styles.featuredName}>{featured.title}</h2>
                <p className={styles.featuredBio}>{featured.shortDescription}</p>
                
                <Link href={`/playlists/${featured.slug}`} className={styles.primaryButton}>
                  <Disc3 size={20} /> START LISTENING
                </Link>
              </div>

              <div className={styles.spotlightImageWrapper}>
                <div className={styles.imageGlow} />
                <div className={styles.imageContainer}>
                  <Image 
                    src={featured.coverImage?.sizes?.square?.url || featured.coverImage?.url || '/images/fallback.jpg'} 
                    alt={featured.title} 
                    fill 
                    className={styles.featuredImg} 
                    priority
                  />
                  <div className={styles.vignette} />
                  <div className={styles.scanlines} />
                </div>
              </div>
              
            </div>
          </section>
        )}

        {gridPlaylists.length > 0 && (
          <>
            <div className={styles.eqSeparator}>
              <div className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
              <div className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
              <span className={styles.eqText}>THE VAULT</span>
              <div className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
              <div className={styles.eqBar} style={{ animationDelay: '0.4s' }} />
            </div>

            <section>
              <div className={styles.sectionHeading}>
                <h2 className={styles.rosterTitle}>ALL PLAYLISTS</h2>
                <p className={styles.rosterCount}>{gridPlaylists.length} SIGNALS DETECTED</p>
              </div>

              <div className={styles.cardGrid}>
                {gridPlaylists.map((p) => (
                  <Link key={p.id} href={`/playlists/${p.slug}`} className={styles.talentCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.imageContainer}>
                        <Image 
                          src={p.coverImage?.sizes?.thumb?.url || p.coverImage?.url || '/images/fallback.jpg'} 
                          alt={p.title} 
                          fill 
                          className={styles.cardImage} 
                        />
                      </div>
                      <div className={styles.cardOverlay}>
                        <span className={styles.viewProfile}>TUNE IN <ArrowRight size={16} style={{display:'inline', marginBottom:'-3px'}}/></span>
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <p className={styles.cardRole}>
                        {p.playlistType || 'PLAYLIST'} {p.curator ? `• BY ${p.curator.displayName}` : ''}
                      </p>
                      <h3 className={styles.cardName}>{p.title}</h3>
                      <p className={styles.cardBio}>{p.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}