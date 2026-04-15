import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/services/news.api'
import { ContentRenderer } from '@/app/news/[slug]/components/ContentRenderer'
import type { NewsArticle } from '@/app/news/news.types'
import styles from './ArtistSpotlight.module.css'

// Import client-side tracking, interactive wrappers, and the author block
import { AnalyticsPageView } from '@/components/analytics/TrackedComponents'
import { ArticleInteractiveWrapper } from '../../news/[slug]/components/ArticleInteractiveWrapper'
import { AuthorBioBlock } from '../components/AuthorBioBlock'

// Define specific interfaces for the Artist Spotlight block
interface SocialLink {
  id: string;
  label: string;
  url: string;
}

interface ArtistSpotlightBlock {
  blockType: 'artistSpotlight';
  artistName?: string;
  blockName?: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
    sizes?: {
      hero?: { url: string };
      card?: { url: string };
    };
  };
  links?: SocialLink[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Spotlight Not Found' }
  return { title: `${article.title} | WaveNation Spotlight`, description: article.excerpt || '' }
}

export default async function ArtistSpotlightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article: NewsArticle | null = await getArticleBySlug(slug)

  if (!article) notFound()

  // Cast the block to our interface safely
  const spotlightBlock = article.contentBlocks.find(
    (b) => (b.blockType as string) === 'artistSpotlight'
  ) as ArtistSpotlightBlock | undefined

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.page}>
        <div className={styles.textureOverlay} />
        
        <section className={styles.heroSection}>
          <div className={styles.heroImageWrapper}>
            {article.hero?.image?.url && (
              <Image 
                src={article.hero.image.sizes?.hero?.url || article.hero.image.url} 
                alt={article.title} 
                fill 
                priority
                className={styles.heroImg} 
              />
            )}
            <div className={styles.heroOverlay} />
            <div className={styles.scanlines} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.metaRow}>
              <span className={styles.liveIndicator}><span className={styles.dot} /> FEATURED PROFILE</span>
              <span className={styles.readTime}>{article.readingTime || 5} MIN READ</span>
            </div>
            <h1 className={styles.mainTitle}>{article.title}</h1>
            <p className={styles.mainExcerpt}>{article.excerpt}</p>
          </div>
        </section>

        <main className={styles.mainContent}>
          {spotlightBlock && (
            <section className={styles.spotlightCard}>
              <div className={styles.spotlightGrid}>
                <div className={styles.artistFrame}>
                  {spotlightBlock.image?.url && (
                    <Image 
                      src={spotlightBlock.image.sizes?.card?.url || spotlightBlock.image.url} 
                      alt={spotlightBlock.artistName || 'Artist'} 
                      fill 
                      className={styles.artistImg} 
                    />
                  )}
                  <div className={styles.frameAccent} />
                </div>
                
                <div className={styles.artistInfo}>
                  <div className={styles.artistHeader}>
                     <p className={styles.eyebrow}>ARTIST PROFILE</p>
                     <h2 className={styles.artistName}>{spotlightBlock.artistName || spotlightBlock.blockName || 'Featured Artist'}</h2>
                  </div>
                  
                  <p className={styles.artistBio}>{spotlightBlock.description}</p>
                  
                  {spotlightBlock.links && (
                    <div className={styles.socialGrid}>
                      {spotlightBlock.links.map((link: SocialLink) => (
                        <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialPill}>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TOP HORIZONTAL LEADERBOARD */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Spotlight Sponsor</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          <div className={styles.editorialContainer}>
            <div className={styles.articleDivider}>
               <div className={styles.eqBar} />
               <span className={styles.dividerText}>THE CONVERSATION</span>
               <div className={styles.eqBar} />
            </div>

            <article className={styles.bodyWrapper}>
              {/* Wrapped in interactive component for image lightboxing and responsive captions */}
              <ArticleInteractiveWrapper>
                <ContentRenderer 
                  blocks={article.contentBlocks.filter((b) => (b.blockType as string) !== 'artistSpotlight')} 
                />
              </ArticleInteractiveWrapper>
            </article>

            {/* AUTHOR BIO BLOCK */}
            <AuthorBioBlock author={article.author} />
          </div>

          <footer className={styles.authorFooter}>
             <p className={styles.publishDate}>
               Published {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
             </p>
          </footer>
        </main>
      </div>
    </>
  )
}