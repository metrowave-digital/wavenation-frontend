import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getArticleBySlug, getNewsByCategory, getLatestNews } from '@/services/news.api'
import { ArticleHero } from './components/ArticleHero'
import { ContentRenderer } from './components/ContentRenderer'
import { ArticleSidebar } from './components/ArticleSidebar'
import type { NewsArticle } from '../news.types'
import styles from './NewsDetail.module.css'

// Import Client Components
import { AnalyticsPageView, TrackedLink, TrackedNewsletterForm } from '@/components/analytics/TrackedComponents'
import { ArticleInteractiveWrapper } from './components/ArticleInteractiveWrapper'

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

export default async function NewsArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const categorySlug = article.categories?.[0]?.slug
  let relatedArticles: NewsArticle[] = []

  if (categorySlug) {
    const relatedRaw = await getNewsByCategory(categorySlug, 4)
    relatedArticles = relatedRaw.filter(a => a.id !== article.id).slice(0, 3)
  }

  if (relatedArticles.length === 0) {
    const latestRaw = await getLatestNews(4)
    relatedArticles = latestRaw.filter(a => a.id !== article.id).slice(0, 3)
  }

  return (
    <>
      <AnalyticsPageView />

      <div className={styles.page}>
        <div className={styles.textureOverlay} />

        <main className={styles.mainContainer}>
          
          <ArticleHero article={article} />

          <div className={styles.articleGrid}>
            
            <article className={styles.contentColumn}>
              {/* Wraps the CMS content to enable Image Lightboxes */}
              <ArticleInteractiveWrapper>
                <ContentRenderer blocks={article.contentBlocks} />
              </ArticleInteractiveWrapper>

              {/* IN-ARTICLE HORIZONTAL AD */}
              <div className={styles.horizontalAdContainer}>
                <span className={styles.adLabel}>SPONSORED</span>
                <div className={styles.horizontalAd}>
                  <div className={styles.adInner}>
                    <p className={styles.adPrompt}>In-Article Banner</p>
                    <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
                  </div>
                </div>
              </div>
            </article>
            
            <aside className={styles.sidebarColumn}>
              <div className={styles.stickySidebar}>
                
                <ArticleSidebar author={article.author} tags={article.tags} />

                <div className={styles.sidebarAd}>
                  <span className={styles.adLabel}>SPONSORED</span>
                  <div className={styles.adSquare}>
                    <div className={styles.adInner}>
                      <p className={styles.adPrompt}>Premium Ad Space</p>
                      <span className={styles.adSpecs}>300 x 250</span>
                    </div>
                  </div>
                </div>

                <div className={styles.sidebarNewsletter}>
                  <h4 className={styles.newsletterHeading}>Get the Brief</h4>
                  <p className={styles.newsletterText}>Top stories delivered straight to your inbox daily.</p>
                  <TrackedNewsletterForm 
                    formClass={styles.newsletterForm}
                    inputClass={styles.newsletterInput}
                    btnClass={styles.newsletterSubmit}
                  />
                </div>

              </div>
            </aside>
          </div>

          {relatedArticles.length > 0 && (
            <section className={styles.relatedSection}>
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
                  <TrackedLink 
                    key={item.id} 
                    href={`/news/${item.slug}`} 
                    className={styles.contentCard} 
                    style={{ animationDelay: `${idx * 0.15}s` }}
                    eventName="content_click"
                    payload={{ id: item.id, title: item.title, placement: 'related_articles' }}
                  >
                    <div className={styles.cardImageWrapper}>
                      {item.hero?.image?.url ? (
                        <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
                      ) : (
                        <div className={styles.cardPlaceholder} />
                      )}
                      <div className={styles.cardOverlay}>READ ARTICLE</div>
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.cardEyebrow}>{item.categories?.[0]?.name || 'NEWS'}</p>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                    </div>
                  </TrackedLink>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </>
  )
}