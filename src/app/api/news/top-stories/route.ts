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
      limit: 12
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

function scoreArticle(article: GraphQLArticle) {
  const boost = article.aiRanking?.boost ?? 0
  const freshness = article.aiRanking?.freshness ?? 0
  const decay = article.aiRanking?.decay ?? 0

  return boost + freshness - decay
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

    const items = docs
      .map((article) => {
        const img = article.hero?.image ?? null

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
          score: scoreArticle(article),
        }
      })
      .sort((a, b) => b.score - a.score)

    return NextResponse.json(items.slice(0, 6))
  } catch (err) {
    console.error('[news/top-stories]', err)
    return NextResponse.json([])
  }
}