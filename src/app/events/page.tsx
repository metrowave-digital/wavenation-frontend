import Link from 'next/link';
import styles from './EventsPage.module.css';
import { getEventsByFeed } from '@/services/events.api'; 
import { HeroEvents } from '@/components/ui/heros/HeroEvents/HeroEvents';
import { EventGrid } from './components/EventGrid/EventGrid';
import { WNEvent } from '@/types/event'; // Import the type we fixed

const FEED_NAV = [
  { label: 'ALL EVENTS', slug: 'all' },
  { label: 'VIRTUAL', slug: 'virtual' },
  { label: 'LIVE / IN-PERSON', slug: 'live' },
  { label: 'MUSIC', slug: 'music' },
];

interface PageProps {
  searchParams: Promise<{ feed?: string }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  // Await searchParams per Next.js 15 requirements
  const { feed } = await searchParams;
  const activeFeed = feed || 'all';
  
  const response = await getEventsByFeed(activeFeed);
  
  // Cast the docs to our WNEvent type to satisfy ESLint
  const docs = (response.docs || []) as WNEvent[];
  
  // Cleanly find the featured event using the interface
  const featured = docs.find((e) => e.promotionTier === 'featured') || docs[0];
  const remainingEvents = docs.filter((e) => e.id !== featured?.id);

  // Safely resolve the image URL
  const featuredImageUrl = 
    featured?.heroImage?.sizes?.hero?.url || 
    featured?.heroImage?.url || 
    '';

  return (
    <main className={styles.page}>
      <div className={styles.textureOverlay} />
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
             <p className={styles.kicker}>EXPERIENCE THE MOVEMENT</p>
             <h1 className={styles.mainTitle}>LIVE<br /><span>EVENTS</span></h1>
          </header>
        </div>
      </section>

      {featured && (
        <section className={styles.heroSection}>
          <div className={styles.studioMonitorFrame}>
            <HeroEvents 
              eventName={featured.title}
              dateRange={featured.startDate ? new Date(featured.startDate).toLocaleDateString() : 'TBA'}
              location={featured.venue?.name || (featured.eventType === 'virtual' ? 'VIRTUAL' : 'TBA')}
              description={featured.excerpt || ''} 
              imageUrl={featuredImageUrl} // Uses the fixed URL string
              primaryCtaHref={`/events/${featured.slug}`}
              primaryCtaText={featured.ctaLabel || "GET TICKETS"}
            />
            <div className={styles.scanlines} />
          </div>
        </section>
      )}

      <nav className={styles.stickyNav}>
        <div className={styles.container}>
          <div className={styles.categoryScroll}>
            {FEED_NAV.map((cat) => (
              <Link 
                key={cat.slug} 
                href={cat.slug === 'all' ? '/events' : `/events?feed=${cat.slug}`}
                className={activeFeed === cat.slug ? styles.navLinkActive : styles.navLink}
                scroll={false}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <section className={styles.gridSection}>
        <div className={styles.container}>
          <EventGrid
            title={`${activeFeed.toUpperCase()} SCHEDULE`}
            events={remainingEvents.length > 0 ? remainingEvents : (featured ? [] : docs)}
            emptyMessage="No signals detected in this sector."
          />
        </div>
      </section>
    </main>
  );
}