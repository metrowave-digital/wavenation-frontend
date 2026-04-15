import React from 'react';
import { getArchiveData } from '@/services/archivenews.api';
import type { Category } from '../news.types';
import styles from './CategoryIndex.module.css';

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents';

export const metadata = {
  title: 'Desks & Departments | WaveNation News',
  description: 'Browse the WaveNation archive by department, from Sound and Vision to Pulse and Arena.',
};

export default async function CategoriesIndexPage() {
  const { categories } = await getArchiveData();

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.page}>
        <div className={styles.textureOverlay} />
        
        <main className={styles.main}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>DIRECTORY</p>
            <h1 className={styles.title}>The <span className={styles.outlineText}>Desks</span></h1>
            <p className={styles.subtitle}>
              Select a department to explore our full collection of features, news, and analysis.
            </p>
          </header>

          {/* TOP HORIZONTAL LEADERBOARD */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Directory Sponsor Space</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          <div className={styles.grid}>
            {categories.map((cat: Category) => (
              <TrackedLink 
                key={cat.id} 
                href={`/news/category/${cat.slug}`} 
                className={styles.card}
                eventName="category_click"
                payload={{ category: cat.name, placement: 'desks_index' }}
              >
                <div className={styles.cardContent}>
                  <span className={styles.countIndicator} />
                  <h2 className={styles.categoryName}>{cat.name}</h2>
                  <p className={styles.categoryDesc}>
                    {cat.description || `View all stories filed under ${cat.name}.`}
                  </p>
                  <div className={styles.viewLink}>Enter Desk &rarr;</div>
                </div>
              </TrackedLink>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}