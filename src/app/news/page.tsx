import styles from './NewsPage.module.css'
import { NewsHero } from './components/NewsHero'
import { NewsSection } from './components/NewsSection'
import { NewsCard } from './components/NewsCard'
import { NewsSidebarList } from './components/NewsSidebarList'
import { NewsInterviewFeature } from './components/NewsInterviewFeature'
import { MoreArticlesRail } from './components/MoreArticlesRail'

export const metadata = {
  title: 'News | WaveNation',
  description:
    'Top stories, trending culture, latest news, editor’s picks, and featured interviews from WaveNation.',
}

export const revalidate = 60

type NewsCardItem = {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl: string | null
  imageAlt: string
  subcategory?: string
  publishDate: string | null
  score: number
}

type InterviewItem = NewsCardItem & {
  eyebrow: string
  person: string
  role: string
}

type SidebarItem = {
  title: string
  href: string
  meta?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : process.env.VERCEL_URL
    ? process.env.VERCEL_URL.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/page] fetch failed', res.status, url)
      return fallback
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('[news/page] fetch error', url, error)
    return fallback
  }
}

export default async function NewsPage() {
  const [
    topStories,
    latestNews,
    editorsPicks,
    featuredInterviews,
    trending,
    tags,
    moreArticlesResponse,
  ] = await Promise.all([
    safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/top-stories`, []),
    safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/latest`, []),
    safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/editors-picks`, []),
    safeFetch<InterviewItem[]>(
      `${BASE_URL}/api/news/featured-interviews`,
      []
    ),
    safeFetch<SidebarItem[]>(`${BASE_URL}/api/news/trending`, []),
    safeFetch<SidebarItem[]>(`${BASE_URL}/api/news/tags`, []),
    safeFetch<{ items: NewsCardItem[]; hasMore: boolean }>(
      `${BASE_URL}/api/news/more-articles?limit=12&offset=0`,
      { items: [], hasMore: false }
    ),
  ])

  const heroStories = topStories.slice(0, 3)
  const secondaryTopStories = topStories.slice(3, 4)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {heroStories.length ? (
          <NewsHero
            title="WaveNation News"
            subtitle="Top stories, trending culture, latest reporting, editor’s picks, and featured interviews from across the WaveNation ecosystem."
            featured={heroStories.map((story) => ({
              id: story.id,
              title: story.title,
              href: story.href,
              category: story.category,
              excerpt: story.excerpt,
              image: story.imageUrl ?? '/images/placeholders/news-fallback.jpg',
              imageAlt: story.imageAlt ?? story.title,
            }))}
          />
        ) : null}

        <section className={styles.mainGrid}>
          <div className={styles.primaryColumn}>
            {secondaryTopStories.length ? (
              <NewsSection
                title="Top Stories"
                description="Major headlines and high-priority cultural coverage."
              >
                <div className={styles.topStoriesGrid}>
                  {secondaryTopStories.map((story) => (
                    <NewsCard
                      key={story.id}
                      title={story.title}
                      href={story.href}
                      category={story.category}
                      excerpt={story.excerpt}
                      image={
                        story.imageUrl ??
                        '/images/placeholders/news-fallback.jpg'
                      }
                      imageAlt={story.imageAlt ?? story.title}
                      layout="stacked"
                    />
                  ))}
                </div>
              </NewsSection>
            ) : null}

            {latestNews.length ? (
              <NewsSection
                title="Latest News"
                description="Fresh reporting and recently published stories."
              >
                <div className={styles.latestGrid}>
                  {latestNews.map((story) => (
                    <NewsCard
                      key={story.id}
                      title={story.title}
                      href={story.href}
                      category={story.category}
                      excerpt={story.excerpt}
                      image={
                        story.imageUrl ??
                        '/images/placeholders/news-fallback.jpg'
                      }
                      imageAlt={story.imageAlt ?? story.title}
                      layout="horizontal"
                    />
                  ))}
                </div>
              </NewsSection>
            ) : null}

            {editorsPicks.length ? (
              <NewsSection
                title="Editor’s Picks"
                description="Standout stories selected for depth, perspective, and relevance."
              >
                <div className={styles.picksGrid}>
                  {editorsPicks.map((story) => (
                    <NewsCard
                      key={story.id}
                      title={story.title}
                      href={story.href}
                      category={story.category}
                      excerpt={story.excerpt}
                      image={
                        story.imageUrl ??
                        '/images/placeholders/news-fallback.jpg'
                      }
                      imageAlt={story.imageAlt ?? story.title}
                      layout="stacked"
                    />
                  ))}
                </div>
              </NewsSection>
            ) : null}

            {featuredInterviews.length ? (
              <NewsSection
                title="Featured Interviews"
                description="Conversations with creators, artists, and cultural voices shaping what’s next."
              >
                <div className={styles.interviewsGrid}>
                  {featuredInterviews.map((item) => (
                    <NewsInterviewFeature
                      key={item.id}
                      eyebrow={item.eyebrow}
                      title={item.title}
                      href={item.href}
                      excerpt={item.excerpt}
                      person={item.person}
                      role={item.role}
                      subcategory={item.subcategory}
                      image={
                        item.imageUrl ??
                        '/images/placeholders/news-fallback.jpg'
                      }
                      imageAlt={item.imageAlt ?? item.title}
                    />
                  ))}
                </div>
              </NewsSection>
            ) : null}
          </div>

          <aside className={styles.sidebarColumn}>
            <NewsSidebarList
              title="Trending"
              items={trending}
              description="Fast-moving topics and stories readers are watching."
            />

            {tags.length ? (
              <NewsSidebarList
                title="Trending Tags"
                description="Topics readers are exploring across WaveNation."
                items={tags}
                variant="tags"
              />
            ) : null}
          </aside>
        </section>

        <MoreArticlesRail
          initialItems={moreArticlesResponse.items ?? []}
          initialHasMore={moreArticlesResponse.hasMore ?? false}
          archiveHref="/news/archive"
          apiEndpoint="/api/news/more-articles"
          autoLoadOnScroll
        />
      </div>
    </main>
  )
}