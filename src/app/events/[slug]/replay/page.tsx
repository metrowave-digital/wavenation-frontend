import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventBySlug } from '@/services/events.api';
import { ArrowLeft, History } from 'lucide-react';
import styles from './EventReplay.module.css';

export default async function EventReplayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || !event.replay?.replayEnabled) notFound();

  return (
    <main className={styles.archive}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href={`/events/${slug}`} className={styles.back}><ArrowLeft size={16} /> DOSSIER</Link>
          <div className={styles.badgeRow}>
            <History size={18} />
            <span className={styles.badge}>ARCHIVE TRANSMISSION</span>
          </div>
        </header>
        <div className={styles.playerFrame}>
          <iframe src={event.replay.replayUrl || ''} className={styles.video} allowFullScreen />
          <div className={styles.monitorOverlay} />
        </div>
        <h1 className={styles.title}>{event.title}</h1>
        <p className={styles.excerpt}>{event.excerpt}</p>
      </div>
    </main>
  );
}