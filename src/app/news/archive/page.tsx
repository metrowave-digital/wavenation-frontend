import Link from 'next/link';
import Image from 'next/image';
import { getArchiveData } from '@/services/archivenews.api';
import type { Category, Author, Tag } from '../news.types';
import styles from './Archive.module.css';

export const metadata = {
  title: 'Library Archive | WaveNation News',
  description: 'Explore the full history of WaveNation culture, politics, and sound through our indexed archives.',
};

export default async function ArchivePage() {
  const { categories, tags, authors } = await getArchiveData();

  return (
    <div className={styles.archivePage}>
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        <header className={styles.archiveHeader}>
          <p className={styles.eyebrow}>CATALOG & INDEX</p>
          <h1 className={styles.title}>The <span className={styles.outlineText}>Vault</span></h1>
          <p className={styles.description}>
            The complete history of the culture, organized by desk, topic, and voice.
          </p>
        </header>

        {/* SECTION 1: THE DESKS */}
        <section className={styles.archiveSection}>
          <h2 className={styles.sectionHeading}>The Desks</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat: Category) => (
              <Link key={cat.id} href={`/news/category/${cat.slug}`} className={styles.categoryCard}>
                <span className={styles.cardIndicator} />
                <h3>{cat.name}</h3>
                <p>Explore all {cat.name} features</p>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: THE VOICES */}
        <section className={styles.archiveSection}>
          <h2 className={styles.sectionHeading}>The Editorial Desk</h2>
          <div className={styles.authorGrid}>
            {authors.map((author: Author) => (
              <Link key={author.id} href={`/authors/${author.slug}`} className={styles.authorCard}>
                <div className={styles.authorAvatar}>
                  {author.avatar?.url ? (
                    <Image src={author.avatar.url} alt={author.fullName} fill className={styles.avatarImg} />
                  ) : (
                    <div className={styles.initials}>{author.fullName.charAt(0)}</div>
                  )}
                </div>
                <div className={styles.authorInfo}>
                  <h4>{author.fullName}</h4>
                  <p>{author.role || 'Staff Contributor'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 3: TOPICS */}
        <section className={styles.archiveSection}>
          <h2 className={styles.sectionHeading}>Topics & Movements</h2>
          <div className={styles.tagCloud}>
            {tags.map((tag: Tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className={styles.tagPill}>
                #{tag.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}