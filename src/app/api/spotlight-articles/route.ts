export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/* ======================================================
   GraphQL Query
   - Published
   - Featured
   - Latest
   - NO subcategory filtering here
====================================================== */

const SPOTLIGHT_ARTICLES_QUERY = `
  query SpotlightArticles {
    Articles(
      where: {
        status: { equals: published }
        isFeatured: { equals: true }
      }
      sort: "-publishDate"
      limit: 5
    ) {
      docs {
        id
        title
        slug
        subcategories {
          name
        }
        hero {
          image {
            url
            alt
            caption
            credit
            sizes {
              card { url }
              thumb { url }
            }
          }
        }
      }
    }
  }
`

/* ======================================================
   Types
====================================================== */

interface ImageSizes {
  card?: { url?: string | null }
  thumb?: { url?: string | null }
}

interface Image {
  url?: string | null
  alt?: string | null
  caption?: string | null
  credit?: string | null
  sizes?: ImageSizes
}

interface Subcategory {
  name?: string | null
}

interface Article {
  id: number
  title: string
  slug: string
  subcategories?: Subcategory[] | null
  hero?: {
    image?: Image | null
  } | null
}

interface GraphQLResponse {
  data?: {
    Articles?: {
      docs?: Article[]
    }
  }
}

/* ======================================================
   GET /api/spotlight-articles
====================================================== */

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: SPOTLIGHT_ARTICLES_QUERY }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json([], { status: 200 })
    }

    const json = (await res.json()) as GraphQLResponse
    const docs = json.data?.Articles?.docs ?? []

    /* =========================================
       FILTER OUT "Artist Profiles"
    ========================================= */

    const filtered = docs.filter((article) => {
      const subs = article.subcategories ?? []
      return !subs.some(
        (s) => s?.name?.toLowerCase() === 'artist profiles'
      )
    })

    /* =========================================
       Map response
    ========================================= */

    const items = filtered.slice(0, 2).map((article) => {
      const image = article.hero?.image ?? null
      const category =
        article.subcategories?.[0]?.name ?? 'Featured'

      return {
        id: article.id,
        title: article.title,
        href: `/news/${article.slug}`,

        imageUrl:
          image?.sizes?.card?.url ??
          image?.sizes?.thumb?.url ??
          image?.url ??
          null,

        imageAlt: image?.alt ?? '',
        category,
        caption: image?.caption ?? '',
        credit: image?.credit ?? '',
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('[spotlight-articles]', error)
    return NextResponse.json([], { status: 200 })
  }
}
