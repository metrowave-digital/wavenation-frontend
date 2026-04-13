import Link from 'next/link'
import Image from 'next/image'
import { getTalentRoster } from '@/services/talent.api'
import { ArrowRight, User } from 'lucide-react'
import styles from './HomeTalent.module.css'

// --- TypeScript Interfaces ---
interface Talent {
  id: string | number;
  slug: string;
  displayName: string;
  roles?: string[];
  avatar?: {
    url: string;
    sizes?: {
      card?: { url: string };
      thumb?: { url: string };
    };
  };
  headshot?: {
    url: string;
  };
}

export default async function HomeTalent() {
  const allTalent: Talent[] = await getTalentRoster();
  const displayTalent = allTalent.slice(0, 4);
  
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
            const avatarUrl = person.avatar?.sizes?.card?.url 
              || person.avatar?.url 
              || person.headshot?.url 
              || '/images/wavenation-avatar.png';
              
            const roleText = person.roles && person.roles.length > 0 
              ? person.roles.join(' • ') 
              : 'STATION TALENT';

            return (
              <Link key={person.id} href={`/talent/${person.slug}`} className={styles.talentCard}>
                <div className={styles.imageWrap}>
                  <Image src={avatarUrl} alt={person.displayName} fill className={styles.talentImg} sizes="(max-width: 768px) 100vw, 25vw" />
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