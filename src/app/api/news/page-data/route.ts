export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

const NEWS_PAGE_DATA_QUERY = `
  query NewsPageData {
    Articles(
      where: { status: { equals: published } }
      sort: "-publishDate"
      limit: 40
    ) {
      docs {
        id
        title
        subtitle
        excerpt
        slug
        publishDate
        categories {
          name
          slug
        }
        subcategories {
          name
          slug
        }
        aiRanking {
          boost
          decay
          freshness
          aiNotes
        }
        hero {
          image {
            url
            alt
            sizes {
              hero { url }
              card { url }
              thumb { url }
              square { url }
            }
          }
        }
      }
    }
  }
`

interface GraphQLCategory {
  name?: string | null
  slug?: string | null
}

interface GraphQLImage {
  url?: string | null
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null } | null
    card?: { url?: string | null } | null
    thumb?: { url?: string | null } | null
    square?: { url?: string | null } | null
  } | null
}

interface GraphQLArticle {
  id: number
  title: string
  subtitle?: string | null
  excerpt?: string | null
  slug: string
  publishDate?: string | null
  categories?: GraphQLCategory[] | null
  subcategories?: GraphQLCategory[] | null
  aiRanking?: {
    boost?: number | null
    decay?: number | null
    freshness?: number | null
    aiNotes?: string | null
  } | null
  hero?: {
    image?: GraphQLImage | null
  } | null
}

interface GraphQLResponse {
  data?: {
    Articles?: {
      docs: GraphQLArticle[]
    }
  }
  errors?: unknown
}

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

type PageDataResponse = {
  topStories: NewsCardItem[]
  latestNews: NewsCardItem[]
  editorsPicks: NewsCardItem[]
  featuredInterviews: InterviewItem[]
  trending: NewsCardItem[]
  moreArticles: NewsCardItem[]
  moreArticlesHasMore: boolean
}

const EMPTY_RESPONSE: PageDataResponse = {
  topStories: [],
  latestNews: [],
  editorsPicks: [],
  featuredInterviews: [],
  trending: [],
  moreArticles: [],
  moreArticlesHasMore: false,
}

function normalizeText(value?: string | null) {
  return (value ?? '').trim()
}

function lower(value?: string | null) {
  return normalizeText(value).toLowerCase()
}

function uniqueById<T extends { id: number }>(items: T[]) {
  const seen = new Set<number>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

function pickImage(article: GraphQLArticle) {
  const img = article.hero?.image ?? null

  return {
    imageUrl:
      img?.sizes?.hero?.url ??
      img?.sizes?.card?.url ??
      img?.sizes?.thumb?.url ??
      img?.sizes?.square?.url ??
      img?.url ??
      null,
    imageAlt: normalizeText(img?.alt) || article.title,
  }
}

function scoreArticle(article: GraphQLArticle) {
  const boost = article.aiRanking?.boost ?? 0
  const freshness = article.aiRanking?.freshness ?? 0
  const decay = article.aiRanking?.decay ?? 0

  const publishedAt = article.publishDate ? new Date(article.publishDate) : null
  const now = Date.now()
  const ageHours = publishedAt
    ? Math.max(0, (now - publishedAt.getTime()) / (1000 * 60 * 60))
    : 9999

  let recencyBonus = 0
  if (ageHours <= 12) recencyBonus = 3
  else if (ageHours <= 24) recencyBonus = 2
  else if (ageHours <= 72) recencyBonus = 1

  return boost + freshness - decay + recencyBonus
}

function mapArticle(article: GraphQLArticle): NewsCardItem {
  const primaryCategory = normalizeText(article.categories?.[0]?.name) || 'News'
  const primarySubcategory = normalizeText(article.subcategories?.[0]?.name)
  const { imageUrl, imageAlt } = pickImage(article)

  return {
    id: article.id,
    title: article.title,
    href: `/news/${article.slug}`,
    category: primaryCategory,
    excerpt: normalizeText(article.excerpt) || normalizeText(article.subtitle),
    imageUrl,
    imageAlt,
    subcategory: primarySubcategory,
    publishDate: article.publishDate ?? null,
    score: scoreArticle(article),
  }
}

function sortByPublishDateDesc<T extends { publishDate: string | null }>(
  items: T[]
) {
  return [...items].sort((a, b) => {
    const aTime = a.publishDate ? new Date(a.publishDate).getTime() : 0
    const bTime = b.publishDate ? new Date(b.publishDate).getTime() : 0
    return bTime - aTime
  })
}

function sortByScoreDesc<T extends { score: number; publishDate: string | null }>(
  items: T[]
) {
  return [...items].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score

    const aTime = a.publishDate ? new Date(a.publishDate).getTime() : 0
    const bTime = b.publishDate ? new Date(b.publishDate).getTime() : 0
    return bTime - aTime
  })
}

function hasSubcategorySlug(article: GraphQLArticle, slug: string) {
  return (article.subcategories ?? []).some(
    (item) => lower(item.slug) === lower(slug)
  )
}

function isInterviewArticle(article: GraphQLArticle) {
  const categoryNames = (article.categories ?? []).map((item) => lower(item.name))
  const categorySlugs = (article.categories ?? []).map((item) => lower(item.slug))
  const subcategoryNames = (article.subcategories ?? []).map((item) =>
    lower(item.name)
  )
  const subcategorySlugs = (article.subcategories ?? []).map((item) =>
    lower(item.slug)
  )
  const notes = lower(article.aiRanking?.aiNotes)

  return (
    subcategorySlugs.includes('artist-profiles') ||
    subcategorySlugs.includes('interviews') ||
    subcategoryNames.some((name) => name.includes('artist profile')) ||
    subcategoryNames.some((name) => name.includes('interview')) ||
    categorySlugs.includes('interviews') ||
    categoryNames.some((name) => name.includes('interview')) ||
    notes.includes('artist profile') ||
    notes.includes('interview') ||
    notes.includes('q&a') ||
    notes.includes('conversation')
  )
}

function buildInterviewItem(article: GraphQLArticle): InterviewItem {
  const base = mapArticle(article)
  const primaryCategory = normalizeText(article.categories?.[0]?.name) || 'Interview'
  const primarySubcategory =
    normalizeText(article.subcategories?.[0]?.name) || 'Featured Interview'

  const eyebrow = hasSubcategorySlug(article, 'artist-profiles')
    ? 'Artist Profile'
    : primarySubcategory

  return {
    ...base,
    eyebrow,
    person: article.title,
    role: primaryCategory,
    subcategory: primarySubcategory,
  }
}

function isEditorsPickArticle(article: GraphQLArticle) {
  const categoryNames = (article.categories ?? []).map((item) => lower(item.name))
  const subcategoryNames = (article.subcategories ?? []).map((item) =>
    lower(item.name)
  )
  const notes = lower(article.aiRanking?.aiNotes)

  return (
    categoryNames.some((name) => name.includes('editor')) ||
    subcategoryNames.some((name) => name.includes('editor')) ||
    notes.includes('editor') ||
    notes.includes('pick') ||
    (article.aiRanking?.boost ?? 0) >= 4
  )
}

function isTrendingArticle(article: GraphQLArticle) {
  const categoryNames = (article.categories ?? []).map((item) => lower(item.name))
  const subcategoryNames = (article.subcategories ?? []).map((item) =>
    lower(item.name)
  )
  const notes = lower(article.aiRanking?.aiNotes)

  return (
    categoryNames.some((name) => name.includes('trending')) ||
    subcategoryNames.some((name) => name.includes('trending')) ||
    notes.includes('trending') ||
    notes.includes('viral') ||
    (article.aiRanking?.freshness ?? 0) >= 3
  )
}

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: NEWS_PAGE_DATA_QUERY }),
      next: { revalidate: 60 },
      cache: 'force-cache',
    })

    if (!res.ok) {
      console.error('[news/page-data] bad response', res.status)
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 })
    }

    const result = (await res.json()) as GraphQLResponse

    if (result.errors) {
      console.error('[news/page-data] graphql errors', result.errors)
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 })
    }

    const docs = result.data?.Articles?.docs ?? []

    const allMapped = docs.map(mapArticle)
    const scored = sortByScoreDesc(allMapped)
    const latest = sortByPublishDateDesc(allMapped)

    const topStories = uniqueById(scored).slice(0, 6)
    const latestNews = uniqueById(latest).slice(0, 8)

    const editorsPicksPool = docs.filter(isEditorsPickArticle).map(mapArticle)
    const editorsPicksFallbackPool = allMapped.filter(
      (item) => !topStories.some((top) => top.id === item.id)
    )

    const editorsPicks =
      editorsPicksPool.length > 0
        ? uniqueById(sortByScoreDesc(editorsPicksPool)).slice(0, 6)
        : uniqueById(sortByScoreDesc(editorsPicksFallbackPool)).slice(0, 6)

    const interviewPool = docs.filter(isInterviewArticle).map(buildInterviewItem)

    const featuredInterviews =
      interviewPool.length > 0
        ? uniqueById(sortByScoreDesc(interviewPool)).slice(0, 4)
        : uniqueById(
            sortByScoreDesc(
              docs.slice(0, 12).map((article) => {
                const primarySubcategory =
                  normalizeText(article.subcategories?.[0]?.name) ||
                  'Featured Interview'

                return {
                  ...buildInterviewItem(article),
                  eyebrow: hasSubcategorySlug(article, 'artist-profiles')
                    ? 'Artist Profile'
                    : primarySubcategory,
                  role:
                    normalizeText(article.categories?.[0]?.name) || 'Interview',
                  subcategory: primarySubcategory,
                }
              })
            )
          ).slice(0, 4)

    const trendingPool = docs.filter(isTrendingArticle).map(mapArticle)
    const trendingFallbackPool = allMapped.filter(
      (item) => !topStories.some((top) => top.id === item.id)
    )

    const trending =
      trendingPool.length > 0
        ? uniqueById(sortByScoreDesc(trendingPool)).slice(0, 6)
        : uniqueById(sortByScoreDesc(trendingFallbackPool)).slice(0, 6)

    const usedIds = new Set<number>([
      ...topStories.map((item) => item.id),
      ...latestNews.map((item) => item.id),
      ...editorsPicks.map((item) => item.id),
      ...featuredInterviews.map((item) => item.id),
      ...trending.map((item) => item.id),
    ])

    const moreArticlesPool = latest.filter((item) => !usedIds.has(item.id))
    const moreArticles = moreArticlesPool.slice(0, 12)
    const moreArticlesHasMore = moreArticlesPool.length > 12

    const payload: PageDataResponse = {
      topStories,
      latestNews,
      editorsPicks,
      featuredInterviews,
      trending,
      moreArticles,
      moreArticlesHasMore,
    }

    return NextResponse.json(payload, { status: 200 })
  } catch (err) {
    console.error('[news/page-data]', err)
    return NextResponse.json(EMPTY_RESPONSE, { status: 200 })
  }
}