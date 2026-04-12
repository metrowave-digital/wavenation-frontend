import Link from 'next/link';
import { getArchiveData } from '@/services/archivenews.api';
import type { Category } from '../news.types';
import styles from './CategoryIndex.module.css';

export const metadata = {
  title: 'Desks & Departments | WaveNation News',
  description: 'Browse the WaveNation archive by department, from Sound and Vision to Pulse and Arena.',
};

export default async function CategoriesIndexPage() {
  // Reuse the Archive Data fetcher to get all categories
  const { categories } = await getArchiveData();

  return (
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

        <div className={styles.grid}>
          {categories.map((cat: Category) => (
            <Link 
              key={cat.id} 
              href={`/news/category/${cat.slug}`} 
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <span className={styles.countIndicator} />
                <h2 className={styles.categoryName}>{cat.name}</h2>
                <p className={styles.categoryDesc}>
                  {cat.description || `View all stories filed under ${cat.name}.`}
                </p>
                <div className={styles.viewLink}>Enter Desk &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}