import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventBySlug } from '@/services/events.api';
import { ArrowLeft, Users, Zap } from 'lucide-react';
import styles from './LiveStream.module.css';

export default async function EventLivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.eventType !== 'virtual') notFound();

  return (
    <main className={styles.terminal}>
      <nav className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <Link href={`/events/${slug}`} className={styles.backBtn}><ArrowLeft size={16} /> EXIT</Link>
          <div className={styles.liveIndicator}>
            <span className={styles.pulseDot} />
            <span className={styles.liveText}>SIGNAL ACTIVE // LIVE</span>
          </div>
        </div>
        <div className={styles.statusRight}>
          <Users size={14} /> <span>BROADCASTING</span>
        </div>
      </nav>

      <div className={styles.broadcastGrid}>
        <div className={styles.videoStage}>
          <div className={styles.monitorFrame}>
            <iframe src={event.streamEmbedUrl || ''} className={styles.iframe} allowFullScreen />
            <div className={styles.scanlines} />
          </div>
          <div className={styles.stageInfo}>
            <h1 className={styles.eventTitle}>{event.title}</h1>
            <div className={styles.categoryBadge}><Zap size={14} /> {event.contentVertical}</div>
          </div>
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>COMMAND_CENTER</div>
          <div className={styles.chatArea}>
            {event.chatEmbedUrl ? (
               <iframe src={event.chatEmbedUrl} className={styles.chatIframe} />
            ) : (
              <p className={styles.encrypted}>CHAT ENCRYPTION ACTIVE</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}