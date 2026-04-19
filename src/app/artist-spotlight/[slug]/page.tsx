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

// 1. Do NOT extend ContentBlock. Define standalone with 'id'
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

// 3. Omit the original contentBlocks array and replace it with our Extended version
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
    
  // 4. Safely cast to our extended interface
  const article = articleRaw as unknown as SpotlightArticle

  // 5. Because of our Union Type, TypeScript now allows this comparison safely
  const spotlightBlock = article.contentBlocks?.find(
    (b) => b.blockType === 'artistSpotlight'
  ) as ArtistSpotlightBlock | undefined

  const album = article.relatedAlbum

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <AnalyticsPageView />
      
      <div className={styles.page}>
        
        {/* ===============================
            BRUTALIST SPLIT HERO
        =============================== */}
        <section className={styles.splitHero}>
          <div className={styles.heroTextCol}>
            <div className={styles.heroTopMeta}>
              <span className={styles.editorialBadge}>Spotlight</span>
              <span className={styles.readTime}>Vol. {new Date().getFullYear()} &mdash; {article.readingTime || 5} Min Read</span>
            </div>
            
            <h1 className={styles.heroHeadline}>{article.title}</h1>
            
            <div className={styles.heroBottomMeta}>
              <p className={styles.heroExcerpt}>{article.excerpt}</p>
              {article.hero?.credit && (
                <p className={styles.imageCredit}>Img: {article.hero.credit.replace('Photo courtesy of ', '')}</p>
              )}
            </div>
          </div>

          <div className={styles.heroImgCol}>
            {article.hero?.image?.url ? (
              <Image 
                src={article.hero.image.sizes?.hero?.url || article.hero.image.url} 
                alt={article.hero.image.alt || article.title} 
                fill 
                priority
                className={styles.heroImg} 
              />
            ) : (
              <div className={styles.imgPlaceholder} />
            )}
          </div>
        </section>

        <main className={styles.mainLayout}>
          
          {/* ===============================
              THE DOSSIER (Artist Fact File)
          =============================== */}
          {spotlightBlock && (
            <section className={styles.dossierSection}>
              <div className={styles.dossierGrid}>
                <div className={styles.dossierVisual}>
                  {spotlightBlock.image?.url && (
                    <Image 
                      src={spotlightBlock.image.sizes?.card?.url || spotlightBlock.image.url} 
                      alt={spotlightBlock.artistName || 'Artist Portrait'} 
                      fill 
                      className={styles.dossierImg} 
                    />
                  )}
                </div>
                
                <div className={styles.dossierData}>
                  <div className={styles.dossierHeader}>
                    <span className={styles.dataLabel}>Subject</span>
                    <h2 className={styles.subjectName}>{spotlightBlock.artistName || spotlightBlock.blockName}</h2>
                  </div>
                  
                  <div className={styles.dossierBio}>
                    <span className={styles.dataLabel}>Profile</span>
                    <p>{spotlightBlock.description}</p>
                  </div>
                  
                  {spotlightBlock.links && spotlightBlock.links.length > 0 && (
                    <div className={styles.dossierLinks}>
                      <span className={styles.dataLabel}>Index</span>
                      <div className={styles.linkList}>
                        {spotlightBlock.links.map((link: SocialLink) => (
                          <TrackedLink 
                            key={link.id} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.dataLink}
                            eventName="navigation_click"
                            payload={{ destination: link.label, type: 'artist_social' }}
                          >
                            {link.label} &#8599;
                          </TrackedLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TOP HORIZONTAL LEADERBOARD */}
          <section className={styles.adBanner}>
            <span className={styles.adLabel}>Advertisement</span>
            <div className={styles.adBox}>
              <p className={styles.adPrompt}>Premium Ad Space</p>
              <span className={styles.adSpecs}>728x90 / 320x100</span>
            </div>
          </section>

          {/* ===============================
              THE ARTICLE BODY
          =============================== */}
          <article className={styles.editorialBody}>
            <ArticleInteractiveWrapper>
              <ContentRenderer 
                blocks={(article.contentBlocks || []).filter(
                  // 6. Use a Type Guard to satisfy the ContentRenderer's strict requirements
                  (b): b is ContentBlock => b.blockType !== 'artistSpotlight'
                )} 
              />
            </ArticleInteractiveWrapper>

            {/* ===============================
                GALLERY RELEASE SECTION (ALBUM)
            =============================== */}
            {album && (
              <section className={styles.exhibitionSection}>
                <div className={styles.exhibitionHeader}>
                  <span className={styles.exhibitionLabel}>Exhibit A: Discography</span>
                </div>
                
                <div className={styles.exhibitionGrid}>
                  <div className={styles.exhibitionArt}>
                    {album.coverArt?.url ? (
                      <Image 
                        src={album.coverArt.sizes?.square?.url || album.coverArt.url} 
                        alt={album.title}
                        fill
                        className={styles.exhibitionImg}
                      />
                    ) : (
                      <div className={styles.exhibitionPlaceholder} />
                    )}
                  </div>

                  <div className={styles.exhibitionPlacard}>
                    <h3 className={styles.placardTitle}>{album.title}</h3>
                    <div className={styles.placardMeta}>
                      {album.primaryArtist && <p>Artist: {album.primaryArtist}</p>}
                      {album.releaseDate && <p>Year: {new Date(album.releaseDate).getFullYear()}</p>}
                      {album.label && <p>Label: {album.label}</p>}
                    </div>

                    {(album.manualTracks?.length || 0) > 0 && (
                      <div className={styles.placardTracks}>
                        {album.manualTracks?.map((track, idx) => (
                          <div key={track.id} className={styles.trackRow}>
                            <span className={styles.trackIndex}>{String(idx + 1).padStart(2, '0')}</span>
                            <span className={styles.trackTitle}>{track.title}</span>
                            {track.artist && track.artist !== album.primaryArtist && (
                              <span className={styles.trackFeature}>[ft. {track.artist}]</span>
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
            <div className={styles.articleFooterBlock}>
              {article.tags && article.tags.length > 0 && (
                <div className={styles.tagBlock}>
                  {article.tags.map((tag: Tag) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`} className={styles.editorialTag}>
                      {tag.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <AuthorBioBlock author={article.author} />
          </article>

          <footer className={styles.pageFooter}>
             <div className={styles.footerCol}>
               <span className={styles.footerLabel}>Feature By</span>
               {article.author?.slug ? (
                 <Link href={`/authors/${article.author.slug}`} className={styles.footerLink}>
                   {article.author.fullName}
                 </Link>
               ) : (
                 <span>{article.author?.fullName || 'WaveNation Editorial'}</span>
               )}
             </div>
             <div className={styles.footerCol}>
               <span className={styles.footerLabel}>Published</span>
               <span>{formatDate(article.publishDate)}</span>
             </div>
          </footer>
        </main>
      </div>
    </>
  )
}