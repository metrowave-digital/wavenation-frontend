export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

const TRENDING_QUERY = `
  query TrendingNews {
    Articles(
      where: { status: { equals: published } }
      sort: "-publishDate"
      limit: 24
    ) {
      docs {
        id
        title
        slug
        publishDate
        isBreaking
        isFeatured
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
      }
    }
  }
`

interface GraphQLCategory {
  name?: string | null
  slug?: string | null
}

interface GraphQLAiRanking {
  boost?: number | null
  decay?: number | null
  freshness?: number | null
  aiNotes?: string | null
}

interface GraphQLArticle {
  id: number
  title: string
  slug: string
  publishDate?: string | null
  isBreaking?: boolean | null
  isFeatured?: boolean | null
  categories?: GraphQLCategory[] | null
  subcategories?: GraphQLCategory[] | null
  aiRanking?: GraphQLAiRanking | null
}

interface GraphQLResponse {
  data?: {
    Articles?: {
      docs: GraphQLArticle[]
    }
  }
  errors?: unknown
}

function getHoursSincePublished(publishDate?: string | null): number {
  if (!publishDate) return 9999

  const published = new Date(publishDate).getTime()
  if (Number.isNaN(published)) return 9999

  const now = Date.now()
  return Math.max(0, (now - published) / (1000 * 60 * 60))
}

function computeTrendingScore(article: GraphQLArticle): number {
  const boost = article.aiRanking?.boost ?? 0
  const decay = article.aiRanking?.decay ?? 5
  const freshness = article.aiRanking?.freshness ?? 5
  const hoursOld = getHoursSincePublished(article.publishDate)

  const freshnessMultiplier = 1 + freshness / 10
  const decayRate = Math.max(0.25, decay / 24)

  const recencyScore = Math.max(0, freshnessMultiplier * 10 - hoursOld * decayRate)
  const breakingBonus = article.isBreaking ? 4 : 0
  const featuredBonus = article.isFeatured ? 1.5 : 0

  return Number((boost + recencyScore + breakingBonus + featuredBonus).toFixed(4))
}

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: TRENDING_QUERY }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/trending] bad response', res.status)
      return NextResponse.json([])
    }

    const result = (await res.json()) as GraphQLResponse
    const docs = result.data?.Articles?.docs ?? []

    const filtered = docs.filter((article) => {
      const slugs = [...(article.categories ?? []), ...(article.subcategories ?? [])]
        .map((c) => c.slug?.toLowerCase())
        .filter(Boolean) as string[]

      return !slugs.includes('artist-spotlight')
    })

    const ranked = [...filtered].sort((a, b) => {
      const scoreA = computeTrendingScore(a)
      const scoreB = computeTrendingScore(b)

      if (scoreB !== scoreA) return scoreB - scoreA

      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0

      return dateB - dateA
    })

    const items = ranked.map((article) => ({
      id: article.id,
      title: article.title,
      href: `/news/${article.slug}`,
      meta: article.categories?.[0]?.name ?? article.subcategories?.[0]?.name ?? 'Trending',
    }))

    return NextResponse.json(items.slice(0, 5))
  } catch (err) {
    console.error('[news/trending]', err)
    return NextResponse.json([])
  }
}