import Image from 'next/image';
import styles from './EventHero.module.css';
import { Ticket } from 'lucide-react';
import { WNEvent } from '@/types/event';

export function EventHero({ event }: { event: WNEvent }) {
  // Map the image URL from the heroImage object
  const imageUrl = event.heroImage?.sizes?.hero?.url || event.heroImage?.url || '/images/fallback.jpg';

  return (
    <div className={styles.heroCard}>
      <Image 
        src={imageUrl} 
        alt={event.heroImage?.alt || event.title}
        fill
        priority
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.badgeRow}>
          <span className={styles.categoryBadge}>{event.eventType?.toUpperCase() || 'FEATURED'}</span>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.textSide}>
            <h2 className={styles.title}>{event.title}</h2>
            <p className={styles.description}>{event.excerpt}</p>
          </div>
          {event.ctaUrl && (
            <a href={event.ctaUrl} target="_blank" rel="noopener" className={styles.cta}>
              {event.ctaLabel || 'GET TICKETS'} <Ticket size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}