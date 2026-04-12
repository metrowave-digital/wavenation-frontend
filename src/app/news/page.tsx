import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { getLatestNews, getEditorsPicks, getNewsByCategory } from '@/services/news.api'
import type { NewsArticle, Tag } from './news.types'
import styles from './NewsPage.module.css'

export const metadata: Metadata = {
  title: 'WaveNation News — Urban Culture, Music, and Breaking Updates',
  description: 'The pulse of the culture. Get the latest breaking news, deep dives into urban culture, music releases, and creator stories from WaveNation Media.',
}

/* ======================================================
   REUSABLE COMPONENTS
   Moved OUTSIDE the main render function to prevent 
   React from destroying/recreating it on every render.
====================================================== */
const CategoryRow = ({ title, stories, accentColor = '#39FF14' }: { title: string, stories: NewsArticle[], accentColor?: string }) => {
  if (!stories || stories.length === 0) return null
  return (
    <section className={styles.categoryBlock}>
      <div className={styles.categoryHeader} style={{ borderBottomColor: accentColor }}>
        <h2 className={styles.categoryTitle} style={{ color: accentColor }}>{title}</h2>
        <Link href={`/news/category/${title.toLowerCase().replace(/ /g, '-')}`} className={styles.viewAllBtn}>
          View All &rarr;
        </Link>
      </div>
      <div className={styles.cardGrid}>
        {stories.map(item => (
          <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard}>
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
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ======================================================
   MAIN PAGE
====================================================== */
export default async function NewsPage() {
  // 1. Fetch Data Concurrently
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

  // 2. AI Ranking Logic: Sort the large latest pool by AI Boost
  const aiSortedStories = [...latestFeed].sort((a, b) => {
    const boostA = a.aiRanking?.boost || 0
    const boostB = b.aiRanking?.boost || 0
    return boostB - boostA 
  })

  const heroArticle = aiSortedStories.length > 0 ? aiSortedStories[0] : null
  const topAIStories = aiSortedStories.slice(1, 5)

  // 3. Fallback for Editor's Picks
  const editorsPicks = editorsPicksRaw.length > 0 
    ? editorsPicksRaw 
    : latestFeed.filter(item => item.id !== heroArticle?.id).slice(0, 4)

  // 4. Extract unique tags
  const allTagsMap = new Map<string, Tag>()
  latestFeed.forEach(article => {
    article.tags?.forEach(tag => {
      if (!allTagsMap.has(tag.slug)) allTagsMap.set(tag.slug, tag)
    })
  })
  const uniqueTags = Array.from(allTagsMap.values()).slice(0, 15)

  // Helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YWB08LCGHY" strategy="afterInteractive" />
      <Script id="ga4-news-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YWB08LCGHY', { page_path: '/news' });
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
                <Link href={`/news/${heroArticle.slug}`} className={styles.primaryButton}>Read the Feature</Link>
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
                  <Link key={`ticker-${news.id}`} href={`/news/${news.slug}`} className={styles.tickerItem}>
                    <span className={styles.tickerDot}>•</span> {news.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

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
                  <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className={styles.cardImageWrapper}>
                      {item.hero?.image?.url ? <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} /> : <div className={styles.cardPlaceholder} />}
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

          {/* Fixed Height EQ Separator */}
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
              
              {/* Feed: Image on Left */}
              <div className={styles.feedColumn}>
                <h2 className={styles.sectionTitle}>Latest Stories</h2>
                <div className={styles.feedList}>
                  {latestFeed.slice(0, 6).map((item) => (
                    <article key={item.id} className={styles.feedItem}>
                      <Link href={`/news/${item.slug}`} className={styles.feedThumbnail}>
                        {item.hero?.image?.url ? (
                          <Image src={item.hero.image.sizes?.thumb?.url || item.hero.image.url} alt={item.title} fill className={styles.feedImg} />
                        ) : (
                          <div className={styles.cardPlaceholder} />
                        )}
                      </Link>
                      
                      <div className={styles.feedContent}>
                        <div className={styles.feedMetaRow}>
                          <p className={styles.eyebrow}>{item.categories?.[0]?.name || 'NEWS'}</p>
                          <span className={styles.feedTime}>{formatDate(item.publishDate)}</span>
                        </div>
                        <Link href={`/news/${item.slug}`} className={styles.feedTitleLink}>
                          <h3 className={styles.feedTitle}>{item.title}</h3>
                        </Link>
                        <p className={styles.feedExcerpt}>{item.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar: Editor's Picks, Newsletter & Ads */}
              <aside className={styles.sidebarColumn}>
                <div className={styles.stickySidebar}>
                  
                  {/* Editor's Picks (Fixed unescaped quote here) */}
                  <h3 className={styles.sidebarTitle}>Editor&apos;s Picks</h3>
                  <div className={styles.railList}>
                    {editorsPicks.map((pick) => (
                      <Link key={pick.id} href={`/news/${pick.slug}`} className={styles.railItem}>
                        <h4 className={styles.railTitle}>{pick.title}</h4>
                        <p className={styles.railMeta}>Featured</p>
                      </Link>
                    ))}
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

                  {/* Sidebar Ad Slot */}
                  <div className={styles.sidebarAd}>
                    <span className={styles.adLabel}>SPONSORED</span>
                    <div className={styles.adSquare}>
                      <p>Premium Ad Space</p>
                    </div>
                  </div>

                </div>
              </aside>
            </div>
          </section>

          {/* ===============================
              5. CATEGORY SECTIONS
          =============================== */}
          <CategoryRow title="Music" stories={musicStories} accentColor="#00F0FF" />
          <CategoryRow title="Culture & Politics" stories={cultureStories} accentColor="#FF0055" />
          <CategoryRow title="Film & TV" stories={filmStories} accentColor="#B200FF" />
          
          {/* ===============================
              6. SPORTS & AD BLOCK
          =============================== */}
          <section className={styles.categoryBlock}>
            <div className={styles.categoryHeader} style={{ borderBottomColor: '#FF6600' }}>
              <h2 className={styles.categoryTitle} style={{ color: '#FF6600' }}>Sports</h2>
              <Link href="/news/category/sports" className={styles.viewAllBtn}>View All &rarr;</Link>
            </div>
            <div className={styles.cardGrid}>
              {sportsStories.map(item => (
                <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard}>
                  <div className={styles.cardImageWrapper}>
                    {item.hero?.image?.url ? <Image src={item.hero.image.sizes?.card?.url || item.hero.image.url} alt={item.title} fill className={styles.cardImg} /> : <div className={styles.cardPlaceholder} />}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </Link>
              ))}
              
              <div className={styles.adCard}>
                <span className={styles.adLabel}>SPONSORED</span>
                <div className={styles.adContent}>
                  <h3>Your Ad Here</h3>
                  <p>Join the WaveNation network.</p>
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
                {/* 1. Add the "All Topics" / Archive Link first */}
                <Link href="/news/archive" className={`${styles.tagPill} ${styles.allTagsPill}`}>
                  View All Topics &rarr;
                </Link>

                {/* 2. Map through the extracted unique tags */}
                {uniqueTags.map(tag => (
                  <Link key={tag.slug} href={`/tags/${tag.slug}`} className={styles.tagPill}>
                    #{tag.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </>
  )
}