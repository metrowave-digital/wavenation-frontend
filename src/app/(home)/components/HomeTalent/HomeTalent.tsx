// Force Next.js to bypass the cache so the shuffle works on every refresh
export const dynamic = 'force-dynamic';

import Link from 'next/link'
import Image from 'next/image'
import { getTalentRoster } from '@/services/talent.api'
import { ArrowRight, User } from 'lucide-react'
import styles from './HomeTalent.module.css'

// --- TypeScript Interfaces ---
interface MediaProps {
  url: string;
  sizes?: {
    card?: { url: string };
    thumb?: { url: string };
  };
}

interface Talent {
  id: string | number;
  slug: string;
  displayName: string;
  role?: string; 
  // Nested mediaAssets to match your Payload CMS structure
  mediaAssets?: {
    headshot?: MediaProps;
    avatar?: MediaProps;
  };
}

// --- Helper: Shuffle Array ---
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function HomeTalent() {
  const allTalent: Talent[] = await getTalentRoster();
  
  // Shuffle the full array before slicing the top 4
  const displayTalent = shuffleArray(allTalent).slice(0, 4);
  
  if (!displayTalent || displayTalent.length === 0) return null;

  return (
    <section className={styles.wrapper} aria-labelledby="talent-title">
      <div className={styles.container}>
        
        <div className={styles.sectionHeaderRow}>
          <div>
            <p className={styles.eyebrow}><User size={14}/> THE VOICES</p>
            <h2 id="talent-title" className={styles.sectionTitle}>WAVENATION ROSTER</h2>
          </div>
          <Link href="/talent" className={styles.sectionLink}>
            VIEW ALL TALENT <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {displayTalent.map((person) => {
            
            // Resolve Image looking inside mediaAssets
            const mediaObject = person.mediaAssets?.headshot || person.mediaAssets?.avatar;
            const avatarUrl = mediaObject?.sizes?.card?.url 
              || mediaObject?.url 
              || '/images/wavenation-avatar.png';
              
            const roleText = person.role || 'STATION TALENT';

            return (
              <Link key={person.id} href={`/talent/${person.slug}`} className={styles.talentCard}>
                <div className={styles.imageWrap}>
                  <Image 
                    src={avatarUrl} 
                    alt={person.displayName} 
                    fill 
                    className={styles.talentImg} 
                    sizes="(max-width: 768px) 100vw, 25vw" 
                  />
                  <div className={styles.vignette} aria-hidden="true" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.roleTag}>{roleText}</span>
                  <h3 className={styles.talentName}>{person.displayName}</h3>
                </div>
                <div className={styles.accentBar} aria-hidden="true" />
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}