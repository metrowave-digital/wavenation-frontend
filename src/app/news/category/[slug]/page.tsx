import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCategoryBySlug, getArticlesByCategory } from '@/services/category.api';
import styles from './CategoryPage.module.css';

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents';

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category.id);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <AnalyticsPageView />

      <div className={styles.container}>
        <header className={styles.header}>
          <TrackedLink 
            href="/news/archive" 
            className={styles.backLink}
            eventName="navigation_back"
            payload={{ from: category.name, to: 'archive' }}
          >
            &larr; Back to Archive
          </TrackedLink>
          <h1 className={styles.title}>{category.name}</h1>
          {category.description && <p className={styles.subtitle}>{category.description}</p>}
        </header>

        {/* TOP HORIZONTAL LEADERBOARD */}
        <section className={styles.horizontalAdContainer}>
          <span className={styles.adLabel}>SPONSORED</span>
          <div className={styles.horizontalAd}>
            <div className={styles.adInner}>
              <p className={styles.adPrompt}>{category.name} Sponsor</p>
              <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
            </div>
          </div>
        </section>

        {articles.length === 0 ? (
          <p className={styles.empty}>No stories found in this category archive.</p>
        ) : (
          <div className={styles.grid}>
            {articles.map((item, idx) => {
              const articleCard = (
                <TrackedLink 
                  key={item.id} 
                  href={`/news/${item.slug}`} 
                  className={styles.card}
                  eventName="content_click"
                  payload={{ id: item.id, title: item.title, category: category.name }}
                >
                  <div className={styles.imageBox}>
                    {item.hero?.image?.url ? (
                      <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.img} />
                    ) : (
                       <div className={styles.cardPlaceholder} />
                    )}
                  </div>
                  <div className={styles.content}>
                    <span className={styles.date}>{formatDate(item.publishDate)}</span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.excerpt}>{item.excerpt}</p>
                  </div>
                </TrackedLink>
              );

              // Inject Native Ad Card
              if (idx === 5) {
                return (
                  <React.Fragment key={`${item.id}-with-ad`}>
                    {articleCard}
                    <div className={styles.adCard}>
                      <span className={styles.adLabel}>SPONSORED</span>
                      <div className={styles.adContent}>
                        <h3>Amplify Your Reach</h3>
                        <p>Target the {category.name} audience directly.</p>
                        <button className={styles.adButton}>Advertise</button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              }

              return articleCard;
            })}
          </div>
        )}
      </div>
    </>
  );
}