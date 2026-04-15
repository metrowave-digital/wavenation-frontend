import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { getLatestNews, getEditorsPicks, getNewsByCategory } from '@/services/news.api'
import type { NewsArticle, Tag } from './news.types'
import styles from './NewsPage.module.css'

// Import our client-side tracking components
import { AnalyticsPageView, TrackedLink, TrackedNewsletterForm } from '@/components/analytics/TrackedComponents'

export const metadata: Metadata = {
  title: 'WaveNation News — Urban Culture, Music, and Breaking Updates',
  description: 'The pulse of the culture. Get the latest breaking news, deep dives into urban culture, music releases, and creator stories from WaveNation Media.',
}

/* ======================================================
   REUSABLE COMPONENTS (Server)
====================================================== */
const CategoryRow = ({ title, stories, accentColor = '#39FF14' }: { title: string, stories: NewsArticle[], accentColor?: string }) => {
  if (!stories || stories.length === 0) return null
  return (
    <section className={styles.categoryBlock}>
      <div className={styles.categoryHeader} style={{ borderBottomColor: accentColor }}>
        <h2 className={styles.categoryTitle} style={{ color: accentColor }}>{title}</h2>
        <TrackedLink 
          href={`/news/category/${title.toLowerCase().replace(/ /g, '-')}`} 
          className={styles.viewAllBtn}
          eventName="category_click"
          payload={{ category: title, action: 'view_all' }}
        >
          View All &rarr;
        </TrackedLink>
      </div>
      <div className={styles.cardGrid}>
        {stories.map(item => (
          <TrackedLink 
            key={item.id} 
            href={`/news/${item.slug}`} 
            className={styles.contentCard}
            eventName="content_click"
            payload={{ id: item.id, title: item.title, category: title }}
          >
            <div className={styles.cardImageWrapper}>
              {item.hero?.image?.url ? (
                <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} />
              ) : (
                <div className={styles.cardPlaceholder} />
              )}
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
          </TrackedLink>
        ))}
      </div>
    </section>
  )
}

/* ======================================================
   MAIN PAGE
====================================================== */
export default async function NewsPage() {
  const [
    latestFeed, 
    editorsPicksRaw, 
    musicStories, 
    filmStories, 
    cultureStories, 
    sportsStories, 
    techStories
  ] = await Promise.all([
    getLatestNews(30), 
    getEditorsPicks(5),
    getNewsByCategory('music', 4),
    getNewsByCategory('film-and-tv', 4),
    getNewsByCategory('culture-and-politics', 4),
    getNewsByCategory('sports', 3), 
    getNewsByCategory('business-tech', 4)
  ])

  const aiSortedStories = [...latestFeed].sort((a, b) => {
    const boostA = a.aiRanking?.boost || 0
    const boostB = b.aiRanking?.boost || 0
    return boostB - boostA 
  })

  const heroArticle = aiSortedStories.length > 0 ? aiSortedStories[0] : null
  const topAIStories = aiSortedStories.slice(1, 5)

  const editorsPicks = editorsPicksRaw.length > 0 
    ? editorsPicksRaw 
    : latestFeed.filter(item => item.id !== heroArticle?.id).slice(0, 4)

  const allTagsMap = new Map<string, Tag>()
  latestFeed.forEach(article => {
    article.tags?.forEach(tag => {
      if (!allTagsMap.has(tag.slug)) allTagsMap.set(tag.slug, tag)
    })
  })
  const uniqueTags = Array.from(allTagsMap.values()).slice(0, 15)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <AnalyticsPageView />
      
      {process.env.NEXT_PUBLIC_GA4_ID && (
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} strategy="afterInteractive" />
      )}
      <Script id="ga4-news-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', { page_path: '/news' });
        `}
      </Script>

      <div className={styles.page}>
        <div className={styles.textureOverlay} />
        
        <main className={styles.main}>
          <header className={styles.pageHeader}>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span> UPDATING LIVE
            </div>
            <h1 className={styles.mainTitle}>
              WaveNation<br/><span className={styles.outlineText}>News Desk</span>
            </h1>
          </header>

          {/* ===============================
              1. HERO: TRENDING STORY
          =============================== */}
          {heroArticle && (
            <section className={styles.heroFeature}>
              <div className={styles.heroFeatureImage}>
                {heroArticle.hero?.image?.url && (
                  <Image src={heroArticle.hero.image.sizes?.hero?.url || heroArticle.hero.image.url} alt={heroArticle.title} fill priority className={styles.heroImg} />
                )}
              </div>
              <div className={styles.scanlines} />
              <div className={styles.heroFeatureOverlay} />
              
              <div className={styles.heroFeatureContent}>
                <div className={styles.badgeRow}>
                  <span className={styles.pulseIndicator} />
                  <span className={styles.categoryTag}>TRENDING STORY</span>
                </div>
                <h1 className={styles.heroTitle}>{heroArticle.title}</h1>
                <p className={styles.heroSubtitle}>{heroArticle.excerpt}</p>
                <TrackedLink 
                  href={`/news/${heroArticle.slug}`} 
                  className={styles.primaryButton}
                  eventName="hero_click"
                  payload={{ id: heroArticle.id, title: heroArticle.title, placement: 'main_hero' }}
                >
                  Read the Feature
                </TrackedLink>
              </div>
            </section>
          )}

          {/* ===============================
              2. SLOWED BREAKING TICKER
          =============================== */}
          <div className={styles.tickerBand}>
            <div className={styles.tickerLabel}><span>LIVE FEED</span></div>
            <div className={styles.tickerTrack}>
              <div className={styles.tickerContent}>
                {latestFeed.slice(0, 8).map((news) => (
                  <TrackedLink 
                    key={`ticker-${news.id}`} 
                    href={`/news/${news.slug}`} 
                    className={styles.tickerItem}
                    eventName="news_ticker_click"
                    payload={{ id: news.id, title: news.title }}
                  >
                    <span className={styles.tickerDot}>•</span> {news.title}
                  </TrackedLink>
                ))}
              </div>
            </div>
          </div>

          {/* ===============================
              NEW: TOP HORIZONTAL LEADERBOARD
          =============================== */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Top Leaderboard Ad Space</p>
                <span className={styles.adSpecs}>728 x 90 / 320 x 100</span>
              </div>
            </div>
          </section>

          {/* ===============================
              3. TOP STORIES (AI Ranked)
          =============================== */}
          {topAIStories.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <div><p className={styles.eyebrow}>MOST TRENDING</p><h2 className={styles.sectionTitle}>Top Stories Today</h2></div>
              </div>
              <div className={styles.cardGrid}>
                {topAIStories.map((item, idx) => (
                  <TrackedLink 
                    key={item.id} 
                    href={`/news/${item.slug}`} 
                    className={styles.contentCard} 
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    eventName="content_click"
                    payload={{ id: item.id, title: item.title, placement: 'ai_trending' }}
                  >
                    <div className={styles.cardImageWrapper}>
                      {item.hero?.image?.url ? <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} /> : <div className={styles.cardPlaceholder} />}
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

          <div className={styles.eqSeparator}>
            <div className={styles.eqBar} style={{ animationDelay: '0.1s' }}/>
            <div className={styles.eqBar} style={{ animationDelay: '0.3s' }}/>
            <div className={styles.eqBar} style={{ animationDelay: '0.0s' }}/>
            <span className={styles.eqText}>THE TIMELINE</span>
            <div className={styles.eqBar} style={{ animationDelay: '0.4s' }}/>
            <div className={styles.eqBar} style={{ animationDelay: '0.2s' }}/>
          </div>

          {/* ===============================
              4. LATEST FEED & SIDEBAR
          =============================== */}
          <section className={styles.section}>
            <div className={styles.splitLayout}>
              
              <div className={styles.feedColumn}>
                <h2 className={styles.sectionTitle}>Latest Stories</h2>
                <div className={styles.feedList}>
                  {latestFeed.slice(0, 6).map((item) => (
                    <article key={item.id} className={styles.feedItem}>
                      <TrackedLink 
                        href={`/news/${item.slug}`} 
                        className={styles.feedThumbnail}
                        eventName="content_click"
                        payload={{ id: item.id, title: item.title, placement: 'latest_feed_thumb' }}
                      >
                        {item.hero?.image?.url ? (
                          <Image src={item.hero.image.sizes?.thumb?.url || item.hero.image.url} alt={item.title} fill className={styles.feedImg} />
                        ) : (
                          <div className={styles.cardPlaceholder} />
                        )}
                      </TrackedLink>
                      
                      <div className={styles.feedContent}>
                        <div className={styles.feedMetaRow}>
                          <p className={styles.eyebrow}>{item.categories?.[0]?.name || 'NEWS'}</p>
                          <span className={styles.feedTime}>{formatDate(item.publishDate)}</span>
                        </div>
                        <TrackedLink 
                          href={`/news/${item.slug}`} 
                          className={styles.feedTitleLink}
                          eventName="content_click"
                          payload={{ id: item.id, title: item.title, placement: 'latest_feed_title' }}
                        >
                          <h3 className={styles.feedTitle}>{item.title}</h3>
                        </TrackedLink>
                        <p className={styles.feedExcerpt}>{item.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className={styles.sidebarColumn}>
                <div className={styles.stickySidebar}>
                  <h3 className={styles.sidebarTitle}>Editor&apos;s Picks</h3>
                  <div className={styles.railList}>
                    {editorsPicks.map((pick) => (
                      <TrackedLink 
                        key={pick.id} 
                        href={`/news/${pick.slug}`} 
                        className={styles.railItem}
                        eventName="content_click"
                        payload={{ id: pick.id, title: pick.title, placement: 'editors_picks' }}
                      >
                        <h4 className={styles.railTitle}>{pick.title}</h4>
                        <p className={styles.railMeta}>Featured</p>
                      </TrackedLink>
                    ))}
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

                  {/* Sidebar Responsive Ad Slot */}
                  <div className={styles.sidebarAd}>
                    <span className={styles.adLabel}>SPONSORED</span>
                    <div className={styles.adSquare}>
                      <div className={styles.adInner}>
                        <p className={styles.adPrompt}>Premium Ad Space</p>
                        <span className={styles.adSpecs}>300 x 250 / 300 x 600</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* ===============================
              NEW: MID-PAGE HORIZONTAL BANNER
          =============================== */}
          <section className={styles.horizontalAdContainer}>
            <span className={styles.adLabel}>SPONSORED</span>
            <div className={styles.horizontalAd}>
              <div className={styles.adInner}>
                <p className={styles.adPrompt}>Mid-Page Banner Ad</p>
                <span className={styles.adSpecs}>Reach highly engaged users.</span>
              </div>
            </div>
          </section>

          {/* ===============================
              5. CATEGORY SECTIONS
          =============================== */}
          <CategoryRow title="Music" stories={musicStories} accentColor="#00F0FF" />
          <CategoryRow title="Culture & Politics" stories={cultureStories} accentColor="#FF0055" />
          <CategoryRow title="Film & TV" stories={filmStories} accentColor="#B200FF" />
          
          {/* ===============================
              6. SPORTS & GRID AD BLOCK
          =============================== */}
          <section className={styles.categoryBlock}>
            <div className={styles.categoryHeader} style={{ borderBottomColor: '#FF6600' }}>
              <h2 className={styles.categoryTitle} style={{ color: '#FF6600' }}>Sports</h2>
              <TrackedLink 
                href="/news/category/sports" 
                className={styles.viewAllBtn}
                eventName="category_click"
                payload={{ category: 'Sports', action: 'view_all' }}
              >
                View All &rarr;
              </TrackedLink>
            </div>
            <div className={styles.cardGrid}>
              {sportsStories.map(item => (
                <TrackedLink 
                  key={item.id} 
                  href={`/news/${item.slug}`} 
                  className={styles.contentCard}
                  eventName="content_click"
                  payload={{ id: item.id, title: item.title, category: 'Sports' }}
                >
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} /> : <div className={styles.cardPlaceholder} />}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </TrackedLink>
              ))}
              
              {/* Native Grid Ad Card */}
              <div className={styles.adCard}>
                <span className={styles.adLabel}>SPONSORED</span>
                <div className={styles.adContent}>
                  <h3>Your Brand Here</h3>
                  <p>Join the WaveNation network and reach millions.</p>
                  <button className={styles.adButton}>Advertise With Us</button>
                </div>
              </div>
            </div>
          </section>

          <CategoryRow title="Business & Technology" stories={techStories} accentColor="#39FF14" />

          {/* ===============================
              7. TAGS CLOUD
          =============================== */}
          {uniqueTags.length > 0 && (
            <section className={styles.tagsSection}>
              <h2 className={styles.tagsHeader}>Explore Topics</h2>
              <div className={styles.tagsCloud}>
                <TrackedLink 
                  href="/news/archive" 
                  className={`${styles.tagPill} ${styles.allTagsPill}`}
                  eventName="tag_show_all_click"
                >
                  View All Topics &rarr;
                </TrackedLink>

                {uniqueTags.map(tag => (
                  <TrackedLink 
                    key={tag.slug} 
                    href={`/tags/${tag.slug}`} 
                    className={styles.tagPill}
                    eventName="tag_click"
                    payload={{ tag: tag.label }}
                  >
                    #{tag.label}
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