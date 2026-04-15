import React from 'react'
import Image from 'next/image'
import type { Author } from '@/app/news/news.types'
import { TrackedLink } from '@/components/analytics/TrackedComponents'
import styles from './AuthorBioBlock.module.css'

/* ======================================================
   Helper Types & Function: Extract plain text from Lexical
====================================================== */

// Define a recursive type to handle Lexical's nested JSON structure safely
type LexicalData = string | {
  root?: LexicalData;
  children?: LexicalData[];
  text?: string;
  [key: string]: unknown;
} | null | undefined;

const extractTextFromLexical = (data: LexicalData): string => {
  if (!data) return '';
  
  // If it's already a string, return it directly
  if (typeof data === 'string') return data;
  
  // If it's the root node of the Lexical object
  if (typeof data === 'object' && 'root' in data && data.root) {
    return extractTextFromLexical(data.root);
  }
  
  // If we hit a node with actual text content
  if (typeof data === 'object' && 'text' in data && typeof data.text === 'string') {
    return data.text;
  }
  
  // If the node has children (like paragraphs), map through them
  if (typeof data === 'object' && 'children' in data && Array.isArray(data.children)) {
    return data.children.map(extractTextFromLexical).join(' ');
  }
  
  return '';
};

export function AuthorBioBlock({ author }: { author?: Author | null }) {
  // Fail gracefully if no author data is attached to the article
  if (!author || !author.slug) return null

  // Safely parse the Lexical object into a plain string using our strictly typed helper
  // We cast author.bio as LexicalData to bridge the gap with the auto-generated types
  const bioText = extractTextFromLexical(author.bio as LexicalData).trim();

  return (
    <TrackedLink 
      href={`/authors/${author.slug}`} 
      className={styles.authorContainer}
      eventName="author_click"
      payload={{ 
        authorName: author.fullName, 
        placement: 'article_footer_bio' 
      }}
    >
      <div className={styles.avatarWrapper}>
        {author.avatar?.url ? (
          <Image 
            src={author.avatar.url} 
            alt={author.fullName} 
            fill 
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
        
        {/* Render the safely extracted plain text string */}
        {bioText && (
          <p className={styles.authorBio}>{bioText}</p>
        )}
        
        <span className={styles.viewProfileBtn}>View Full Profile &rarr;</span>
      </div>
    </TrackedLink>
  )
}