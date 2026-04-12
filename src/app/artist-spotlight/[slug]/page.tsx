import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/services/news.api'
import { ContentRenderer } from '@/app/news/[slug]/components/ContentRenderer'
import type { NewsArticle } from '@/app/news/news.types'
import styles from './ArtistSpotlight.module.css'

// 1. Define specific interfaces for the Artist Spotlight block to satisfy TS
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

  // 2. Cast the block to our interface and use a string check to bypass the "no overlap" error
  const spotlightBlock = article.contentBlocks.find(
    (b) => (b.blockType as string) === 'artistSpotlight'
  ) as ArtistSpotlightBlock | undefined

  return (
    <div className={styles.page}>
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

        <div className={styles.editorialContainer}>
          <div className={styles.articleDivider}>
             <div className={styles.eqBar} />
             <span className={styles.dividerText}>THE CONVERSATION</span>
             <div className={styles.eqBar} />
          </div>

          <article className={styles.bodyWrapper}>
            {/* Filter out the spotlight block from the main content renderer */}
            <ContentRenderer 
              blocks={article.contentBlocks.filter((b) => (b.blockType as string) !== 'artistSpotlight')} 
            />
          </article>
        </div>

        <footer className={styles.authorFooter}>
           <p>Words by <strong>{article.author?.fullName || 'WaveNation Editorial'}</strong></p>
           <p className={styles.publishDate}>Published {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </footer>
      </main>
    </div>
  )
}