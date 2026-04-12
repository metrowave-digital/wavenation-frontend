import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCultureFeed } from '@/services/culturenews.api'
import type { NewsArticle } from '../../news.types'
import styles from '../CultureHub.module.css'

const feedConfigs: Record<string, { title: string, color: string, description: string }> = {
  'trending': { title: 'Trending', color: '#FF0055', description: 'The cultural stories dominating the conversation right now.' },
  'us-news': { title: 'US News', color: '#00F0FF', description: 'Political shifts and domestic updates shaping the nation.' },
  'travel': { title: 'Travel', color: '#39FF14', description: 'Global destinations, tips, and modern exploration.' },
  'education': { title: 'Education', color: '#B200FF', description: 'Policy, academia, and the future of learning.' },
  'fashion': { title: 'Fashion', color: '#FF6600', description: 'Trend cycles, industry moves, and street style.' },
  'all': { title: 'All Stories', color: '#FFFFFF', description: 'The complete WaveNation culture archive.' }
}

export default async function CultureFeedPage({ params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params;
  if (!feedConfigs[feed]) notFound();

  const config = feedConfigs[feed];
  const articles = await getCultureFeed(feed, 24);

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
        <div className={styles.emptyState}><p>No stories found in this section. Check back soon.</p></div>
      ) : (
        <div className={styles.cardGrid}>
          {articles.map((item, idx) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={styles.cardImageWrapper}>
                {item.hero?.image?.url ? (
                  <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                ) : ( <div className={styles.cardPlaceholder} /> )}
                <div className={styles.cardOverlay}>READ STORY</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMetaRow}>
                  <span className={styles.cardCategory}>{item.subcategories?.[0]?.name || 'Culture'}</span>
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