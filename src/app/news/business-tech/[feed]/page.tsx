import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBusinessTechFeed } from '@/services/businesstech.api'
import type { NewsArticle } from '../../news.types'
import styles from '../BusinessTech.module.css'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { title: 'Market Pulse', color: '#39FF14', description: 'The most impactful moves in business and technology.' },
  'music-biz': { title: 'Music Industry', color: '#00F0FF', description: 'Label deals, streaming data, and the economics of sound.' },
  'creator-tips': { title: 'Creator Strategy', color: '#B200FF', description: 'Tools and tactics to scale your independent career.' },
  'digital-media': { title: 'Digital Media', color: '#FF6600', description: 'The evolution of platforms, content, and code.' },
  'legal': { title: 'Legal & Finance', color: '#71717A', description: 'Copyright, contracts, and the laws of the digital age.' },
  'all': { title: 'The Archive', color: '#FFFFFF', description: 'Complete Business & Tech coverage.' }
}

export default async function BusinessTechFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params;
  if (!feedConfigs[feed]) notFound();

  const config = feedConfigs[feed];
  const articles = await getBusinessTechFeed(feed, 24);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.feedContainer} style={{ '--feed-color': config.color } as React.CSSProperties}>
      <div className={styles.feedHeader}>
        <h2 className={styles.feedTitle}>{config.title}</h2>
        <p className={styles.feedDescription}>{config.description}</p>
      </div>

      {articles.length === 0 ? (
        <div className={styles.emptyState}><p>Analyzing data. New insights arriving shortly.</p></div>
      ) : (
        <div className={styles.cardGrid}>
          {articles.map((item, idx) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={styles.cardImageWrapper}>
                {item.hero?.image?.url ? (
                  <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                ) : ( <div className={styles.cardPlaceholder} /> )}
                <div className={styles.cardOverlay}>READ ANALYSIS</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMetaRow}>
                  <span className={styles.cardCategory}>{item.subcategories?.[0]?.name || 'Business'}</span>
                  <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardExcerpt}>{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}