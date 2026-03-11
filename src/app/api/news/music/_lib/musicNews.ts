import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

export type NewsCardItem = {
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

export type InterviewItem = NewsCardItem & {
  eyebrow: string
  person: string
  role: string
}

export type SidebarItem = {
  title: string
  href: string
  meta?: string
}

type CMSRelation = {
  id?: number | string
  name?: string | null
  title?: string | null
  slug?: string | null
}

type CMSImage = {
  url?: string | null
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null }
    card?: { url?: string | null }
    thumb?: { url?: string | null }
  } | null
}

type CMSAuthor = {
  name?: string | null
  displayName?: string | null
  role?: string | null
  title?: string | null
}

type CMSArticle = {
  id?: number
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  subtitle?: string | null
  publishDate?: string | null
  score?: number | null
  hero?: {
    image?: CMSImage | null
  } | null
  categories?: CMSRelation[] | null
  subcategories?: CMSRelation[] | null
  tags?: CMSRelation[] | null
  authors?: CMSAuthor[] | null
  interviewSubject?: string | null
  interviewRole?: string | null
  featured?: boolean | null
  trendingScore?: number | null
}

type CMSListResponse = {
  docs?: CMSArticle[]
  totalDocs?: number
  limit?: number
  totalPages?: number
  page?: number
}

async function fetchCMS<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      console.error('[api/news/music] cms fetch failed', res.status, path)
      return fallback
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('[api/news/music] cms fetch error', path, error)
    return fallback
  }
}

function getCategoryName(article: CMSArticle): string {
  const category =
    article.categories?.find(Boolean)?.name ??
    article.categories?.find(Boolean)?.title ??
    'Music'

  return category
}

function getSubcategoryName(article: CMSArticle): string | undefined {
  return (
    article.subcategories?.find(Boolean)?.name ??
    article.subcategories?.find(Boolean)?.title ??
    undefined
  )
}

function getImage(article: CMSArticle): { imageUrl: string | null; imageAlt: string } {
  const image = article.hero?.image
  const imageUrl =
    image?.sizes?.card?.url ??
    image?.sizes?.hero?.url ??
    image?.url ??
    null

  const imageAlt = image?.alt ?? article.title ?? 'WaveNation article'

  return {
    imageUrl,
    imageAlt,
  }
}

export function mapArticleToNewsCard(article: CMSArticle): NewsCardItem {
  const { imageUrl, imageAlt } = getImage(article)

  return {
    id: article.id ?? 0,
    title: article.title ?? 'Untitled',
    href: article.slug ? `/news/${article.slug}` : '/news',
    category: getCategoryName(article),
    excerpt: article.excerpt ?? article.subtitle ?? '',
    imageUrl,
    imageAlt,
    subcategory: getSubcategoryName(article),
    publishDate: article.publishDate ?? null,
    score: article.score ?? article.trendingScore ?? 0,
  }
}

export function mapArticleToInterview(article: CMSArticle): InterviewItem {
  const base = mapArticleToNewsCard(article)

  const firstAuthor = article.authors?.[0]

  return {
    ...base,
    eyebrow: 'Featured Interview',
    person:
      article.interviewSubject ??
      firstAuthor?.name ??
      firstAuthor?.displayName ??
      'WaveNation Feature',
    role:
      article.interviewRole ??
      firstAuthor?.role ??
      firstAuthor?.title ??
      'Artist / Creative Voice',
  }
}

function buildArticleQuery(params: {
  limit?: number
  page?: number
  sort?: string
  categorySlug?: string
  subcategorySlug?: string
  tagSlug?: string
  featured?: boolean
}): string {
  const search = new URLSearchParams()

  search.set('limit', String(params.limit ?? 12))
  search.set('depth', '2')

  if (params.page) {
    search.set('page', String(params.page))
  }

  if (params.sort) {
    search.set('sort', params.sort)
  }

  search.set('where[status][equals]', 'published')

  if (params.categorySlug) {
    search.set('where[categories.slug][in][0]', params.categorySlug)
  }

  if (params.subcategorySlug) {
    search.set('where[subcategories.slug][in][0]', params.subcategorySlug)
  }

  if (params.tagSlug) {
    search.set('where[tags.slug][in][0]', params.tagSlug)
  }

  if (typeof params.featured === 'boolean') {
    search.set('where[featured][equals]', String(params.featured))
  }

  return `/api/articles?${search.toString()}`
}

export async function getMusicTopStories(limit = 5): Promise<NewsCardItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-publishDate',
      categorySlug: 'music',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(mapArticleToNewsCard)
}

export async function getLatestMusicNews(limit = 8): Promise<NewsCardItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-publishDate',
      subcategorySlug: 'music-news',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(mapArticleToNewsCard)
}

export async function getMusicNewReleases(limit = 6): Promise<NewsCardItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-publishDate',
      subcategorySlug: 'new-releases',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(mapArticleToNewsCard)
}

export async function getMusicFeaturedInterviews(limit = 4): Promise<InterviewItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-publishDate',
      subcategorySlug: 'artist-interviews',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(mapArticleToInterview)
}

export async function getMusicCharts(limit = 4): Promise<NewsCardItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-publishDate',
      subcategorySlug: 'charts-rankings',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(mapArticleToNewsCard)
}

export async function getMusicConcerts(limit = 4): Promise<NewsCardItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-publishDate',
      subcategorySlug: 'concerts-tours',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(mapArticleToNewsCard)
}

export async function getMusicTrending(limit = 8): Promise<SidebarItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      sort: '-score',
      categorySlug: 'music',
    }),
    { docs: [] }
  )

  return (json.docs ?? []).map(article => ({
    title: article.title ?? 'Untitled',
    href: article.slug ? `/news/${article.slug}` : '/news',
    meta:
      article.publishDate
        ? new Date(article.publishDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : undefined,
  }))
}

export async function getMusicTags(limit = 10): Promise<SidebarItem[]> {
  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit: 40,
      sort: '-publishDate',
      categorySlug: 'music',
    }),
    { docs: [] }
  )

  const tagMap = new Map<string, { title: string; href: string; count: number }>()

  for (const article of json.docs ?? []) {
    for (const tag of article.tags ?? []) {
      const slug = tag.slug
      const name = tag.name ?? tag.title

      if (!slug || !name) continue

      const current = tagMap.get(slug)

      if (current) {
        current.count += 1
      } else {
        tagMap.set(slug, {
          title: name,
          href: `/news/music/tag/${slug}`,
          count: 1,
        })
      }
    }
  }

  return [...tagMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(tag => ({
      title: tag.title,
      href: tag.href,
      meta: `${tag.count} stories`,
    }))
}

export async function getMoreMusicArticles(limit = 12, offset = 0): Promise<{
  items: NewsCardItem[]
  hasMore: boolean
}> {
  const page = Math.floor(offset / limit) + 1

  const json = await fetchCMS<CMSListResponse>(
    buildArticleQuery({
      limit,
      page,
      sort: '-publishDate',
      categorySlug: 'music',
    }),
    { docs: [], totalDocs: 0 }
  )

  const items = (json.docs ?? []).map(mapArticleToNewsCard)
  const totalDocs = json.totalDocs ?? 0
  const hasMore = offset + items.length < totalDocs

  return {
    items,
    hasMore,
  }
}

export function jsonResponse<T>(data: T) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}