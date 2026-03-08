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

type NewsPageData = {
  topStories: NewsCardItem[]
  latestNews: NewsCardItem[]
  editorsPicks: NewsCardItem[]
  featuredInterviews: InterviewItem[]
  trending: NewsCardItem[]
  moreArticles: NewsCardItem[]
  moreArticlesHasMore: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : process.env.VERCEL_URL
    ? process.env.VERCEL_URL.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

async function getNewsPageData(): Promise<NewsPageData> {
  const fallback: NewsPageData = {
    topStories: [],
    latestNews: [],
    editorsPicks: [],
    featuredInterviews: [],
    trending: [],
    moreArticles: [],
    moreArticlesHasMore: false,
  }

  try {
    const res = await fetch(`${BASE_URL}/api/news/page-data`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/page] failed to load page data', res.status)
      return fallback
    }

    return (await res.json()) as NewsPageData
  } catch (error) {
    console.error('[news/page] page data fetch error', error)
    return fallback
  }
}

export default async function NewsPage() {
  const data = await getNewsPageData()

  const heroStories = data.topStories.slice(0, 3)
  const secondaryTopStories = data.topStories.slice(3)

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

            {data.latestNews.length ? (
              <NewsSection
                title="Latest News"
                description="Fresh reporting and recently published stories."
              >
                <div className={styles.latestGrid}>
                  {data.latestNews.map((story) => (
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

            {data.editorsPicks.length ? (
              <NewsSection
                title="Editor’s Picks"
                description="Standout stories selected for depth, perspective, and relevance."
              >
                <div className={styles.picksGrid}>
                  {data.editorsPicks.map((story) => (
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

            {data.featuredInterviews.length ? (
              <NewsSection
                title="Featured Interviews"
                description="Conversations with creators, artists, and cultural voices shaping what’s next."
              >
                <div className={styles.interviewsGrid}>
                  {data.featuredInterviews.map((item) => (
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
              items={data.trending}
              description="Fast-moving topics and stories readers are watching."
            />
          </aside>
        </section>

        <MoreArticlesRail
          initialItems={data.moreArticles ?? []}
          initialHasMore={data.moreArticlesHasMore ?? false}
          archiveHref="/news/archive"
          apiEndpoint="/api/news/more-articles"
          autoLoadOnScroll
        />
      </div>
    </main>
  )
}