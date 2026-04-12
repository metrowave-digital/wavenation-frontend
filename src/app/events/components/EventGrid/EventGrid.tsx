import Image from 'next/image';
import Link from 'next/link';
import styles from './EventGrid.module.css';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { WNEvent } from '@/types/event';

interface EventGridProps {
  title: string;
  events: WNEvent[];
  emptyMessage: string;
}

export function EventGrid({ title, events, emptyMessage }: EventGridProps) {
  if (!events.length) return <p className={styles.empty}>{emptyMessage}</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridHeader}>
        <h3 className={styles.gridTitle}>{title}</h3>
        <div className={styles.line} />
      </div>

      <div className={styles.grid}>
        {events.map((event) => {
          const imageUrl = event.heroImage?.sizes?.card?.url || event.heroImage?.url || '/images/fallback-event.jpg';
          const locationText = event.venue?.name 
            || (event.eventType === 'virtual' ? 'VIRTUAL EVENT' : 'LOCATION TBA');

          return (
            <Link key={event.id} href={`/events/${event.slug}`} className={styles.card}>
              <div className={styles.imgContainer}>
                <Image 
                  src={imageUrl} 
                  alt={event.heroImage?.alt || event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.cardImg}
                />
                <div className={styles.scanlines} />
                <span className={styles.cardTag}>{event.eventType || 'EVENT'}</span>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.meta}>
                  <Calendar size={14} className={styles.icon} />
                  <span>
                    {event.startDate 
                      ? new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }).toUpperCase()
                      : 'DATE TBD'}
                  </span>
                </div>
                
                <h4 className={styles.cardTitle}>{event.title}</h4>
                
                <div className={styles.location}>
                  <MapPin size={14} className={styles.icon} />
                  <span>{locationText}</span>
                </div>

                <div className={styles.detailsBtn}>
                  VIEW DOSSIER <ArrowRight size={16} />
                </div>
              </div>
              <div className={styles.accentBar} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}