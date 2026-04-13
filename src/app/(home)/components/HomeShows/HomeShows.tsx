import Link from 'next/link'
import Image from 'next/image'
import { Mic2, ArrowRight, RadioTower } from 'lucide-react'
import { getShows } from '@/services/shows.api'
import styles from './HomeShows.module.css'

// --- TypeScript Interfaces ---
interface Host {
  id: string | number;
  displayName?: string;
  title?: string;
}

interface Show {
  id: string | number;
  slug: string;
  title: string;
  schedule?: string;
  shortDescription?: string;
  description?: string;
  hosts?: Host[];
  coverImage?: {
    url: string;
    sizes?: {
      card?: { url: string };
      thumb?: { url: string };
    };
  };
}

export default async function HomeShows() {
  const allShows: Show[] = await getShows();
  const displayShows = allShows.slice(0, 3);
  
  if (!displayShows || displayShows.length === 0) return null;

  return (
    <section className={styles.wrapper} aria-labelledby="shows-title">
      <div className={styles.container}>
        
        <div className={styles.sectionHeaderRow}>
          <div>
            <p className={styles.eyebrow}><RadioTower size={14}/> LIVE BROADCASTS</p>
            <h2 id="shows-title" className={styles.sectionTitle}>STATION PERSONALITIES</h2>
          </div>
          <Link href="/radio" className={styles.sectionLink}>
            VIEW SCHEDULE <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {displayShows.map((show) => {
            // Resolve Hosts
            const hostNames = show.hosts && show.hosts.length > 0 
              ? show.hosts.map(h => h.displayName || h.title).join(', ') 
              : 'WaveNation Team';

            // Resolve Image (fallback to a default if none provided)
            const imgUrl = show.coverImage?.sizes?.card?.url 
              || show.coverImage?.url 
              || '/images/fallback-show.jpg';

            return (
              <Link key={show.id} href={`/radio/shows/${show.slug}`} className={styles.showCard}>
                
                <div className={styles.imageWrap}>
                  <Image src={imgUrl} alt={show.title} fill className={styles.showImg} sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className={styles.imageOverlay} />
                  <div className={styles.micWrapper}>
                    <Mic2 size={20} className={styles.micIcon} />
                  </div>
                </div>

                <div className={styles.cardBody}>
                  {show.schedule && <div className={styles.scheduleBadge}>{show.schedule}</div>}
                  <h3 className={styles.cardTitle}>{show.title}</h3>
                  <p className={styles.talentLabel}>HOSTED BY <span>{hostNames}</span></p>
                  <p className={styles.cardDescription}>
                    {show.shortDescription || show.description}
                  </p>
                </div>

                <div className={styles.scanlines} aria-hidden="true" />
                <div className={styles.accentBar} aria-hidden="true" />
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}