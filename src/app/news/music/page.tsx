import styles from './MusicNewsPage.module.css'
import { NewsHero } from '../components/NewsHero'
import { NewsSection } from '../components/NewsSection'
import { NewsCard } from '../components/NewsCard'
import { NewsSidebarList } from '../components/NewsSidebarList'
import { NewsInterviewFeature } from '../components/NewsInterviewFeature'
import { MoreArticlesRail } from '../components/MoreArticlesRail'

export const metadata = {
  title: 'Music News | WaveNation',
  description:
    'Breaking music news, new releases, artist interviews, charts, concert coverage, and editor’s picks from WaveNation.',
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
      console.error('[news/music/page] fetch failed', res.status, url)
      return fallback
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('[news/music/page] fetch error', url, error)
    return fallback
  }
}

export default async function MusicNewsPage() {
  const [
    topStories,
    latestMusicNews,
    newReleases,
    featuredInterviews,
    chartsAndRankings,
    concertsAndTours,
    trending,
    tags,
    moreArticlesResponse,
  ] = await Promise.all([
    safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/music/top-stories`, []),
    safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/music/latest`, []),
    safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/music/new-releases`, []),
    safeFetch<InterviewItem[]>(
      `${BASE_URL}/api/news/music/featured-interviews`,
      []
    ),
    safeFetch<NewsCardItem[]>(
      `${BASE_URL}/api/news/music/charts?limit=4`,
      []
    ),
    safeFetch<NewsCardItem[]>(
      `${BASE_URL}/api/news/music/concerts?limit=4`,
      []
    ),
    safeFetch<SidebarItem[]>(`${BASE_URL}/api/news/music/trending`, []),
    safeFetch<SidebarItem[]>(`${BASE_URL}/api/news/music/tags`, []),
    safeFetch<{ items: NewsCardItem[]; hasMore: boolean }>(
      `${BASE_URL}/api/news/music/more-articles?limit=12&offset=0`,
      { items: [], hasMore: false }
    ),
  ])

  const heroStories = topStories.slice(0, 3)
  const spotlightStories = topStories.slice(3, 5)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {heroStories.length ? (
          <NewsHero
            title="WaveNation Music"
            subtitle="Breaking music news, new releases, artist interviews, charts, tours, and editorial picks from across the culture."
            featured={heroStories.map((story) => ({
              id: story.id,
              title: story.title,
              href: story.href,
              category: story.category,
              excerpt: story.excerpt,
              image:
                story.imageUrl ?? '/images/placeholders/news-fallback.jpg',
              imageAlt: story.imageAlt ?? story.title,
            }))}
          />
        ) : null}

        <section className={styles.mainGrid}>
          <div className={styles.primaryColumn}>
            {spotlightStories.length ? (
              <NewsSection
                title="Music Spotlight"
                description="Major stories, culture-shifting releases, and artists leading the conversation."
              >
                <div className={styles.spotlightGrid}>
                  {spotlightStories.map((story) => (
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

            {latestMusicNews.length ? (
              <NewsSection
                title="Latest Music News"
                description="Fresh reporting on artists, labels, songs, albums, and the business of music."
              >
                <div className={styles.latestGrid}>
                  {latestMusicNews.map((story) => (
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

            {newReleases.length ? (
              <NewsSection
                title="New Releases"
                description="New singles, albums, projects, and standout drops worth your attention."
              >
                <div className={styles.releaseGrid}>
                  {newReleases.map((story) => (
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
                title="Artist Interviews"
                description="Conversations with artists, producers, executives, and culture-shaping voices."
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

            {(chartsAndRankings.length || concertsAndTours.length) ? (
              <section className={styles.featureBands}>
                {chartsAndRankings.length ? (
                  <NewsSection
                    title="Charts & Rankings"
                    description="WaveNation chart movement, breakout tracks, and artists rising now."
                  >
                    <div className={styles.bandGrid}>
                      {chartsAndRankings.map((story) => (
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

                {concertsAndTours.length ? (
                  <NewsSection
                    title="Concerts & Tours"
                    description="Live dates, tour announcements, festival appearances, and performance coverage."
                  >
                    <div className={styles.bandGrid}>
                      {concertsAndTours.map((story) => (
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
              </section>
            ) : null}
          </div>

          <aside className={styles.sidebarColumn}>
            <NewsSidebarList
              title="Trending in Music"
              items={trending}
              description="Fast-moving stories, artists, and releases readers are following."
            />

            {tags.length ? (
              <NewsSidebarList
                title="Music Tags"
                description="Genres, artists, scenes, and topics trending across WaveNation."
                items={tags}
                variant="tags"
              />
            ) : null}
          </aside>
        </section>

        <MoreArticlesRail
          initialItems={moreArticlesResponse.items ?? []}
          initialHasMore={moreArticlesResponse.hasMore ?? false}
          archiveHref="/news/music/archive"
          apiEndpoint="/api/news/music/more-articles"
          autoLoadOnScroll
        />
      </div>
    </main>
  )
}