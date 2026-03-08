export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

const TOP_STORIES_QUERY = `
  query TopStories {
    Articles(
      where: { status: { equals: published } }
      sort: "-publishDate"
      limit: 24
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
    hero?: { url?: string | null }
    card?: { url?: string | null }
    thumb?: { url?: string | null }
  }
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
  subtitle?: string | null
  excerpt?: string | null
  slug: string
  publishDate?: string | null
  categories?: GraphQLCategory[] | null
  subcategories?: GraphQLCategory[] | null
  aiRanking?: GraphQLAiRanking | null
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

type TopStoryItem = {
  id: number
  title: string
  excerpt: string
  href: string
  imageUrl: string | null
  imageAlt: string
  category: string
  subcategory: string
  publishDate: string | null
  ranking: {
    score: number
    boost: number
    decay: number
    freshness: number
  }
}

function getHoursSincePublished(publishDate?: string | null): number {
  if (!publishDate) return 9999

  const published = new Date(publishDate).getTime()
  if (Number.isNaN(published)) return 9999

  const now = Date.now()
  return Math.max(0, (now - published) / (1000 * 60 * 60))
}

/**
 * Simple editorial ranking model:
 *
 * - boost: direct editorial lift from CMS
 * - freshness: stronger recency preference
 * - decay: slows/accelerates how fast a story falls off
 *
 * Higher score = higher placement
 */
function computeAiScore(article: GraphQLArticle): number {
  const boost = article.aiRanking?.boost ?? 0
  const decay = article.aiRanking?.decay ?? 5
  const freshness = article.aiRanking?.freshness ?? 5

  const hoursOld = getHoursSincePublished(article.publishDate)

  // More freshness = slower drop for recent stories
  const freshnessMultiplier = 1 + freshness / 10

  // More decay = faster score drop as story ages
  const decayRate = Math.max(0.25, decay / 24)

  // Recency score falls over time but never goes negative
  const recencyScore = Math.max(0, freshnessMultiplier * 10 - hoursOld * decayRate)

  // Final score: editorial boost + time-sensitive recency weight
  return Number((boost + recencyScore).toFixed(4))
}

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: TOP_STORIES_QUERY }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/top-stories] bad response', res.status)
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

    const ranked = [...filtered]
      .sort((a, b) => {
        const scoreA = computeAiScore(a)
        const scoreB = computeAiScore(b)

        if (scoreB !== scoreA) return scoreB - scoreA

        // Tie-breaker: newest publish date first
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0
        return dateB - dateA
      })

    const items: TopStoryItem[] = ranked.map((article) => {
      const img = article.hero?.image ?? null
      const boost = article.aiRanking?.boost ?? 0
      const decay = article.aiRanking?.decay ?? 5
      const freshness = article.aiRanking?.freshness ?? 5

      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt ?? article.subtitle ?? '',
        href: `/news/${article.slug}`,
        imageUrl:
          img?.sizes?.hero?.url ??
          img?.sizes?.card?.url ??
          img?.sizes?.thumb?.url ??
          img?.url ??
          null,
        imageAlt: img?.alt ?? article.title,
        category: article.categories?.[0]?.name ?? 'Top Story',
        subcategory: article.subcategories?.[0]?.name ?? '',
        publishDate: article.publishDate ?? null,
        ranking: {
          score: computeAiScore(article),
          boost,
          decay,
          freshness,
        },
      }
    })

    return NextResponse.json(items.slice(0, 6))
  } catch (err) {
    console.error('[news/top-stories]', err)
    return NextResponse.json([])
  }
}