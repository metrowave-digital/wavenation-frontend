import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/services/news.api'
import { ContentRenderer } from '@/app/news/[slug]/components/ContentRenderer'
import type { NewsArticle, Tag, ContentBlock } from '@/app/news/news.types'
import styles from './ArtistSpotlight.module.css'

import { AnalyticsPageView, TrackedLink } from '@/components/analytics/TrackedComponents'
import { ArticleInteractiveWrapper } from '@/app/news/[slug]/components/ArticleInteractiveWrapper'
import { AuthorBioBlock } from '../components/AuthorBioBlock'

// ======================================================
// Interfaces for Flexible API Fields
// ======================================================
interface SocialLink {
  id: string;
  label: string;
  url: string;
}

// 1. Define as a standalone interface with an 'id', do NOT extend ContentBlock
interface ArtistSpotlightBlock {
  id: string;
  blockType: 'artistSpotlight';
  artistName?: string;
  blockName?: string;
  description?: string;
  image?: { url: string; sizes?: { card?: { url: string } } };
  links?: SocialLink[];
}

interface Track {
  id: string;
  title: string;
  artist?: string | null;
  duration?: string | null;
}

interface RelatedAlbum {
  id: string | number;
  title: string;
  primaryArtist?: string;
  label?: string;
  releaseDate?: string;
  coverArt?: { url: string; sizes?: { square?: { url: string } } };
  manualTracks?: Track[];
  tracks?: Track[];
  dspLinks?: { platform: string; url: string }[];
}

// 2. Create a Union Type containing both standard blocks and our custom spotlight block
type ExtendedContentBlock = ContentBlock | ArtistSpotlightBlock;

// 3. Override the contentBlocks array on the standard NewsArticle
interface SpotlightArticle extends Omit<NewsArticle, 'contentBlocks'> {
  relatedAlbum?: RelatedAlbum;
  contentBlocks?: ExtendedContentBlock[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Spotlight Not Found' }
  return { title: `${article.title} | WaveNation Editorial`, description: article.excerpt || '' }
}

export default async function ArtistSpotlightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const articleRaw = await getArticleBySlug(slug)
  if (!articleRaw) notFound()
    
  // Safely cast to our extended interface
  const article = articleRaw as unknown as SpotlightArticle

  // 4. Because of our Union Type, TypeScript now allows this comparison
  const spotlightBlock = article.contentBlocks?.find(
    (b) => b.blockType === 'artistSpotlight'
  ) as ArtistSpotlightBlock | undefined

  const album = article.relatedAlbum

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.page}>
        <div className={styles.textureOverlay} />
        
        {/* ===============================
            EDITORIAL HERO
        =============================== */}
        <section className={styles.heroSection}>
          <div className={styles.heroImageWrapper}>
            {article.hero?.image?.url && (
              <Image 
                src={article.hero.image.sizes?.hero?.url || article.hero.image.url} 
                alt={article.hero.image.alt || article.title} 
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
              <span className={styles.liveIndicator}><span className={styles.dot} /> COVER STORY</span>
              <span className={styles.readTime}>{article.readingTime || 5} MIN READ</span>
            </div>
            <h1 className={styles.mainTitle}>{article.title}</h1>
            {article.subtitle && <h2 className={styles.subTitle}>{article.subtitle}</h2>}
            
            {article.hero?.credit && (
              <p className={styles.heroCredit}>Photography: {article.hero.credit.replace('Photo courtesy of ', '')}</p>
            )}
          </div>
        </section>

        <main className={styles.mainContent}>
          
          {/* ===============================
              ARTIST FACT FILE / SPOTLIGHT
          =============================== */}
          {spotlightBlock && (
            <section className={styles.spotlightCard}>
              <div className={styles.spotlightGrid}>
                <div className={styles.artistFrame}>
                  {spotlightBlock.image?.url && (
                    <Image 
                      src={spotlightBlock.image.sizes?.card?.url || spotlightBlock.image.url} 
                      alt={spotlightBlock.artistName || 'Artist Portrait'} 
                      fill 
                      className={styles.artistImg} 
                    />
                  )}
                  <div className={styles.frameAccent} />
                </div>
                
                <div className={styles.artistInfo}>
                  <div className={styles.artistHeader}>
                     <p className={styles.eyebrow}>IN FOCUS</p>
                     <h2 className={styles.artistName}>{spotlightBlock.artistName || spotlightBlock.blockName || 'Featured Artist'}</h2>
                  </div>
                  
                  <p className={styles.artistBio}>{spotlightBlock.description}</p>
                  
                  {spotlightBlock.links && spotlightBlock.links.length > 0 && (
                    <div className={styles.socialGrid}>
                      {spotlightBlock.links.map((link: SocialLink) => (
                        <TrackedLink 
                          key={link.id} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={styles.socialPill}
                          eventName="navigation_click"
                          payload={{ destination: link.label, type: 'artist_social' }}
                        >
                          {link.label}
                        </TrackedLink>
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
                <p className={styles.adPrompt}>Editorial Sponsor</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          {/* ===============================
              THE INTERVIEW / ARTICLE BODY
          =============================== */}
          <div className={styles.editorialContainer}>
            <div className={styles.articleDivider}>
               <div className={styles.eqBar} />
               <span className={styles.dividerText}>THE CONVERSATION</span>
               <div className={styles.eqBar} />
            </div>

            <article className={styles.bodyWrapper}>
              <ArticleInteractiveWrapper>
                <ContentRenderer 
                  blocks={(article.contentBlocks || []).filter(
                    // 5. Use a Type Guard to satisfy the ContentRenderer's strict requirements
                    (b): b is ContentBlock => b.blockType !== 'artistSpotlight'
                  )} 
                />
              </ArticleInteractiveWrapper>
            </article>

            {/* ===============================
                FEATURED RELEASE (ALBUM)
            =============================== */}
            {album && (
              <section className={styles.featuredReleaseSection}>
                <div className={styles.releaseDivider}>
                  <span className={styles.eyebrow}>ESSENTIAL LISTENING</span>
                </div>
                
                <div className={styles.releaseGrid}>
                  <div className={styles.releaseArtCol}>
                    <div className={styles.recordSleeve}>
                      {album.coverArt?.url ? (
                        <Image 
                          src={album.coverArt.sizes?.square?.url || album.coverArt.url} 
                          alt={album.title}
                          fill
                          className={styles.albumCover}
                        />
                      ) : (
                        <div className={styles.albumPlaceholder}>AUDIO</div>
                      )}
                      <div className={styles.vinylRecord} />
                    </div>
                  </div>

                  <div className={styles.releaseInfoCol}>
                    <h3 className={styles.albumTitle}>{album.title}</h3>
                    <p className={styles.albumMeta}>
                      {album.primaryArtist && <span>{album.primaryArtist}</span>}
                      {album.releaseDate && <span> &bull; {new Date(album.releaseDate).getFullYear()}</span>}
                      {album.label && <span> &bull; {album.label}</span>}
                    </p>

                    {/* Tracklist */}
                    {(album.manualTracks?.length || 0) > 0 && (
                      <div className={styles.tracklist}>
                        {album.manualTracks?.map((track, idx) => (
                          <div key={track.id} className={styles.trackItem}>
                            <span className={styles.trackNum}>{String(idx + 1).padStart(2, '0')}</span>
                            <span className={styles.trackName}>{track.title}</span>
                            {track.artist && track.artist !== album.primaryArtist && (
                              <span className={styles.trackArtist}>ft. {track.artist}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ===============================
                TAGS & ATTRIBUTION
            =============================== */}
            {article.tags && article.tags.length > 0 && (
              <div className={styles.articleTags}>
                {article.tags.map((tag: Tag) => (
                  <Link key={tag.id} href={`/tags/${tag.slug}`} className={styles.tagLink}>
                    #{tag.label}
                  </Link>
                ))}
              </div>
            )}

            <AuthorBioBlock author={article.author} />
          </div>

          <footer className={styles.authorFooter}>
             <p className={styles.footerAuthor}>
               Words by{' '}
               {article.author?.slug ? (
                 <Link href={`/authors/${article.author.slug}`} className={styles.authorLink}>
                   <strong>{article.author.fullName}</strong>
                 </Link>
               ) : (
                 <strong>{article.author?.fullName || 'WaveNation Editorial'}</strong>
               )}
             </p>
             <p className={styles.publishDate}>
               Published {formatDate(article.publishDate)}
             </p>
          </footer>
        </main>
      </div>
    </>
  )
}