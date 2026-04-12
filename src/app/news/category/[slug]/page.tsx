import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCategoryBySlug, getArticlesByCategory } from '@/services/category.api';
import styles from './CategoryPage.module.css';

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category.id);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/news/archive" className={styles.backLink}>&larr; Back to Archive</Link>
        <h1 className={styles.title}>{category.name}</h1>
        {category.description && <p className={styles.subtitle}>{category.description}</p>}
      </header>

      {articles.length === 0 ? (
        <p className={styles.empty}>No stories found in this category archive.</p>
      ) : (
        <div className={styles.grid}>
          {articles.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={styles.card}>
              <div className={styles.imageBox}>
                {item.hero?.image?.url && (
                  <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.img} />
                )}
              </div>
              <div className={styles.content}>
                <span className={styles.date}>{formatDate(item.publishDate)}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.excerpt}>{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}