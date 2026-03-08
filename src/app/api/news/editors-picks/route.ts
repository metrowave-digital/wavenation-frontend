export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

const EDITORS_PICKS_QUERY = `
  query EditorsPicks {
    Articles(
      where: { status: { equals: published } }
      sort: "-publishDate"
      limit: 20
    ) {
      docs {
        id
        title
        subtitle
        excerpt
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
  isBreaking?: boolean | null
  isFeatured?: boolean | null
  categories?: GraphQLCategory[] | null
  subcategories?: GraphQLCategory[] | null
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

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: EDITORS_PICKS_QUERY }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/editors-picks] bad response', res.status)
      return NextResponse.json([])
    }

    const result = (await res.json()) as GraphQLResponse
    const docs = result.data?.Articles?.docs ?? []

    // ONLY allow breaking or featured
    const picks = docs.filter(
      (article) => article.isBreaking === true || article.isFeatured === true
    )

    const items = picks.map((article) => {
      const img = article.hero?.image ?? null

      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt ?? article.subtitle ?? '',
        href: `/news/${article.slug}`,
        imageUrl:
          img?.sizes?.card?.url ??
          img?.sizes?.hero?.url ??
          img?.sizes?.thumb?.url ??
          img?.url ??
          null,
        imageAlt: img?.alt ?? article.title,
        category: article.isBreaking ? 'Breaking News' : 'Editor’s Pick',
        subcategory: article.subcategories?.[0]?.name ?? '',
        publishDate: article.publishDate ?? null,
      }
    })

    return NextResponse.json(items.slice(0, 3))
  } catch (err) {
    console.error('[news/editors-picks]', err)
    return NextResponse.json([])
  }
}