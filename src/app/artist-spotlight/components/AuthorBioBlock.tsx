import React from 'react'
import Image from 'next/image'
import type { Author } from '@/app/news/news.types'
import { TrackedLink } from '@/components/analytics/TrackedComponents'
import styles from './AuthorBioBlock.module.css'

/* ======================================================
   Helper Types & Function: Extract plain text from Lexical
====================================================== */
type LexicalData = string | {
  root?: LexicalData;
  children?: LexicalData[];
  text?: string;
  [key: string]: unknown;
} | null | undefined;

const extractTextFromLexical = (data: LexicalData): string => {
  if (!data) return '';
  
  if (typeof data === 'string') return data;
  
  if (typeof data === 'object' && 'root' in data && data.root) {
    return extractTextFromLexical(data.root);
  }
  
  if (typeof data === 'object' && 'text' in data && typeof data.text === 'string') {
    return data.text;
  }
  
  if (typeof data === 'object' && 'children' in data && Array.isArray(data.children)) {
    return data.children.map(extractTextFromLexical).join(' ');
  }
  
  return '';
};

/* ======================================================
   COMPONENT: Author Bio Block
====================================================== */
export function AuthorBioBlock({ author }: { author?: Author | null }) {
  if (!author || !author.slug) return null

  const bioText = extractTextFromLexical(author.bio as LexicalData).trim()

  return (
    <TrackedLink 
      href={`/authors/${author.slug}`} 
      className={styles.authorContainer}
      eventName="author_click"
      payload={{ 
        authorName: author.fullName, 
        placement: 'article_footer_bio' 
      }}
      aria-label={`Read more articles by ${author.fullName}`}
    >
      <div className={styles.avatarWrapper}>
        {author.avatar?.url ? (
          <Image 
            src={author.avatar.url} 
            alt={author.fullName} 
            width={120} 
            height={120} 
            className={styles.avatarImg} 
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {author.fullName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.authorInfo}>
        <span className={styles.eyebrow}>Written By</span>
        <h3 className={styles.authorName}>{author.fullName}</h3>
        {author.role && <p className={styles.authorRole}>{author.role}</p>}
        
        {bioText && (
          <p className={styles.authorBio}>{bioText}</p>
        )}
        
        <div className={styles.actionRow}>
          <span className={styles.viewProfileBtn}>
            View Full Profile <span className={styles.arrow}>&rarr;</span>
          </span>
        </div>
      </div>
    </TrackedLink>
  )
}