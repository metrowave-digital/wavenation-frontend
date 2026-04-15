import React from 'react';
import Image from 'next/image';
import { getArchiveData } from '@/services/archivenews.api';
import type { Category, Author, Tag } from '../news.types';
import styles from './Archive.module.css';

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents';

export const metadata = {
  title: 'Library Archive | WaveNation News',
  description: 'Explore the full history of WaveNation culture, politics, and sound through our indexed archives.',
};

export default async function ArchivePage() {
  const { categories, tags, authors } = await getArchiveData();

  return (
    <>
      <AnalyticsPageView />

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

          {/* TOP HORIZONTAL LEADERBOARD */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Archive Sponsor Space</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          {/* SECTION 1: THE DESKS */}
          <section className={styles.archiveSection}>
            <h2 className={styles.sectionHeading}>The Desks</h2>
            <div className={styles.categoryGrid}>
              {categories.map((cat: Category) => (
                <TrackedLink 
                  key={cat.id} 
                  href={`/news/category/${cat.slug}`} 
                  className={styles.categoryCard}
                  eventName="category_click"
                  payload={{ category: cat.name, placement: 'archive_desks' }}
                >
                  <span className={styles.cardIndicator} />
                  <h3>{cat.name}</h3>
                  <p>Explore all {cat.name} features</p>
                </TrackedLink>
              ))}
            </div>
          </section>

          {/* SECTION 2: THE VOICES */}
          <section className={styles.archiveSection}>
            <h2 className={styles.sectionHeading}>The Editorial Desk</h2>
            <div className={styles.authorGrid}>
              {authors.map((author: Author) => (
                <TrackedLink 
                  key={author.id} 
                  href={`/authors/${author.slug}`} 
                  className={styles.authorCard}
                  eventName="author_click"
                  payload={{ author: author.fullName, placement: 'archive_authors' }}
                >
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
                </TrackedLink>
              ))}
            </div>
          </section>

          {/* SECTION 3: TOPICS */}
          <section className={styles.archiveSection}>
            <h2 className={styles.sectionHeading}>Topics & Movements</h2>
            <div className={styles.tagCloud}>
              {tags.map((tag: Tag) => (
                <TrackedLink 
                  key={tag.id} 
                  href={`/tags/${tag.slug}`} 
                  className={styles.tagPill}
                  eventName="tag_click"
                  payload={{ tag: tag.label, placement: 'archive_topics' }}
                >
                  #{tag.label}
                </TrackedLink>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}