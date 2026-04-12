import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getArticleBySlug, getNewsByCategory, getLatestNews } from '@/services/news.api'
import { ArticleHero } from './components/ArticleHero'
import { ContentRenderer } from './components/ContentRenderer'
import { ArticleSidebar } from './components/ArticleSidebar'
import type { NewsArticle } from '../news.types'
import styles from './NewsDetail.module.css'

/* ======================================================
   SEO & Metadata
====================================================== */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) return { title: 'Article Not Found' }
  
  return {
    title: `${article.title} | WaveNation News`,
    description: article.excerpt || 'Read the latest on WaveNation.',
  }
}

/* ======================================================
   Page Component
====================================================== */
export default async function NewsArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // --- Fetch Related Articles ---
  const categorySlug = article.categories?.[0]?.slug
  let relatedArticles: NewsArticle[] = []

  // Try to get stories from the same category first
  if (categorySlug) {
    const relatedRaw = await getNewsByCategory(categorySlug, 4)
    // Filter out the current article so we don't show it twice
    relatedArticles = relatedRaw.filter(a => a.id !== article.id).slice(0, 3)
  }

  // Fallback to latest news if no category matches
  if (relatedArticles.length === 0) {
    const latestRaw = await getLatestNews(4)
    relatedArticles = latestRaw.filter(a => a.id !== article.id).slice(0, 3)
  }

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />

      <main className={styles.mainContainer}>
        
        {/* HERO SECTION */}
        <ArticleHero article={article} />

        {/* TWO-COLUMN LAYOUT: Content & Sidebar */}
        <div className={styles.articleGrid}>
          
          <article className={styles.contentColumn}>
            <ContentRenderer blocks={article.contentBlocks} />
          </article>
          
          <aside className={styles.sidebarColumn}>
            <div className={styles.stickySidebar}>
              
              {/* Original Sidebar Content (Author & Tags) */}
              <ArticleSidebar author={article.author} tags={article.tags} />

              {/* Sidebar Ad Slot */}
              <div className={styles.sidebarAd}>
                <span className={styles.adLabel}>SPONSORED</span>
                <div className={styles.adSquare}>
                  <p>Premium Ad Space</p>
                </div>
              </div>

              {/* Sidebar Newsletter */}
              <div className={styles.sidebarNewsletter}>
                <h4 className={styles.newsletterHeading}>Get the Brief</h4>
                <p className={styles.newsletterText}>Top stories delivered straight to your inbox daily.</p>
                <form className={styles.newsletterForm}>
                  <input type="email" placeholder="Email Address" required className={styles.newsletterInput} />
                  <button type="submit" className={styles.newsletterSubmit}>Join</button>
                </form>
              </div>

            </div>
          </aside>

        </div>

        {/* ===============================
            RELATED ARTICLES SECTION
        =============================== */}
        {relatedArticles.length > 0 && (
          <section className={styles.relatedSection}>
            
            {/* EQ Separator */}
            <div className={styles.eqSeparator}>
              <div className={styles.eqBar} style={{ animationDelay: '0.1s' }}/>
              <div className={styles.eqBar} style={{ animationDelay: '0.3s' }}/>
              <div className={styles.eqBar} style={{ animationDelay: '0.0s' }}/>
              <span className={styles.eqText}>MORE FROM THE DESK</span>
              <div className={styles.eqBar} style={{ animationDelay: '0.4s' }}/>
              <div className={styles.eqBar} style={{ animationDelay: '0.2s' }}/>
            </div>

            <div className={styles.cardGrid}>
              {relatedArticles.map((item, idx) => (
                <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard} style={{ animationDelay: `${idx * 0.15}s` }}>
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? (
                      <Image 
                        src={item.hero.image.sizes?.card?.url || item.hero.image.url} 
                        alt={item.title} 
                        fill 
                        className={styles.cardImg} 
                      />
                    ) : (
                      <div className={styles.cardPlaceholder} />
                    )}
                    <div className={styles.cardOverlay}>READ ARTICLE</div>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardEyebrow}>{item.categories?.[0]?.name || 'NEWS'}</p>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}