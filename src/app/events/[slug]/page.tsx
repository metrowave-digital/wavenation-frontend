import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventBySlug } from '@/services/events.api';
import { EventHero } from '../components/EventHero/EventHero';
import { Calendar, MapPin, Clock, ArrowLeft, Play, History } from 'lucide-react';
import styles from './SingleEvent.module.css';

export default async function SingleEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const startDate = event.startDate ? new Date(event.startDate) : null;
  const isLive = event.status === 'live';
  const hasReplay = event.replay?.replayEnabled;

  return (
    <main className={styles.page}>
      <div className={styles.textureOverlay} />
      <div className={styles.container}>
        <nav className={styles.navRow}>
          <Link href="/events" className={styles.backLink}>
            <ArrowLeft size={16} /> BACK TO TERMINAL
          </Link>
        </nav>

        <EventHero event={event} />

        <div className={styles.gridLayout}>
          <div className={styles.mainContent}>
            <header className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>EVENT DOSSIER</h3>
              <div className={styles.line} />
            </header>
            
            <p className={styles.leadText}>{event.excerpt}</p>

            <div className={styles.accessActions}>
              {event.eventType === 'virtual' && isLive && (
                <Link href={`/events/${slug}/live`} className={styles.liveBtn}>
                  <Play size={20} fill="currentColor" /> ENTER LIVE TERMINAL
                </Link>
              )}
              {hasReplay && (
                <Link href={`/events/${slug}/replay`} className={styles.replayBtn}>
                  <History size={20} /> VIEW ARCHIVE
                </Link>
              )}
            </div>
          </div>

          <aside className={styles.metaSidebar}>
            <div className={styles.metaCard}>
              <h4 className={styles.metaHeader}>TRANSMISSION DATA</h4>
              <ul className={styles.metaList}>
                <li>
                  <Calendar size={18} className={styles.metaIcon} />
                  <div className={styles.metaText}>
                    <span className={styles.metaLabel}>DATE</span>
                    <span>{startDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                </li>
                <li>
                  <MapPin size={18} className={styles.metaIcon} />
                  <div className={styles.metaText}>
                    <span className={styles.metaLabel}>LOCATION</span>
                    <span>{event.eventType === 'virtual' ? 'VIRTUAL EXPERIENCE' : (event.venue?.name || 'TBA')}</span>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}