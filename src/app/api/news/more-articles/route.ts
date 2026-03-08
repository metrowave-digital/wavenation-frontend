export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

type GraphQLCategory = {
  name?: string | null
  slug?: string | null
}

type GraphQLImage = {
  url?: string | null
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null }
    card?: { url?: string | null }
    thumb?: { url?: string | null }
  }
}

type GraphQLArticle = {
  id: number
  title: string
  subtitle?: string | null
  excerpt?: string | null
  slug: string
  publishDate?: string | null
  categories?: GraphQLCategory[] | null
  subcategories?: GraphQLCategory[] | null
  hero?: {
    image?: GraphQLImage | null
  } | null
}

type GraphQLResponse = {
  data?: {
    Articles?: {
      docs: GraphQLArticle[]
      hasNextPage?: boolean
      page?: number
      totalPages?: number
    }
  }
  errors?: unknown
}

function buildQuery(limit: number, page: number) {
  return `
    query MoreArticles {
      Articles(
        where: { status: { equals: published } }
        sort: "-publishDate"
        limit: ${limit}
        page: ${page}
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
        hasNextPage
        page
        totalPages
      }
    }
  `
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? '1')
    const limit = 8

    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: buildQuery(limit, page),
      }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/more-articles] bad response', res.status)
      return NextResponse.json(
        { items: [], hasMore: false, nextPage: null },
        { status: 200 }
      )
    }

    const result = (await res.json()) as GraphQLResponse
    const docs = result.data?.Articles?.docs ?? []
    const hasNextPage = Boolean(result.data?.Articles?.hasNextPage)
    const currentPage = result.data?.Articles?.page ?? page

    const filtered = docs.filter((article) => {
      const slugs = [...(article.categories ?? []), ...(article.subcategories ?? [])]
        .map((c) => c.slug?.toLowerCase())
        .filter(Boolean) as string[]

      return !slugs.includes('artist-spotlight')
    })

    const items = filtered.map((article) => {
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
        category: article.categories?.[0]?.name ?? 'News',
        subcategory: article.subcategories?.[0]?.name ?? '',
        publishDate: article.publishDate ?? null,
      }
    })

    return NextResponse.json({
      items,
      hasMore: hasNextPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
    })
  } catch (err) {
    console.error('[news/more-articles]', err)
    return NextResponse.json(
      { items: [], hasMore: false, nextPage: null },
      { status: 200 }
    )
  }
}