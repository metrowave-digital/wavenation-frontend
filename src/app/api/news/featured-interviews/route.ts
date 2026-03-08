import { NextResponse } from 'next/server'

type MediaSize = {
  url?: string
  width?: number
  height?: number
}

type MediaImage = {
  url?: string
  alt?: string
  caption?: string
  credit?: string
  sizes?: {
    hero?: MediaSize
    card?: MediaSize
    thumb?: MediaSize
    square?: MediaSize
  }
}

type CategoryLike = {
  name?: string
  slug?: string
}

type ArticleDoc = {
  id: number
  slug: string
  title: string
  subtitle?: string
  excerpt?: string
  publishDate?: string
  hero?: {
    image?: MediaImage
  }
  categories?: CategoryLike[]
  subcategories?: CategoryLike[]
}

type ArticlesResponse = {
  docs: ArticleDoc[]
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/* ======================================================
   GET Artist Profiles
====================================================== */

export async function GET() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?` +
        new URLSearchParams({
          depth: '2',
          draft: 'false',
          limit: '10',
          sort: '-publishDate',
          'where[status][equals]': 'published',
          'where[subcategories.slug][equals]': 'artist-profiles',
        }),
      { cache: 'no-store' }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch artist profiles: ${res.status}`)
    }

    const data = (await res.json()) as ArticlesResponse

    const profiles = data.docs.slice(0, 2).map((doc) => {
      const heroImage = doc.hero?.image
      const primaryCategory = doc.categories?.[0]?.name ?? 'Music'
      const primarySubcategory = doc.subcategories?.[0]?.name ?? 'Artist Profile'

      return {
        id: doc.id,
        eyebrow: 'Artist Profile',
        title: doc.title,
        href: `/news/${doc.slug}`,
        excerpt: doc.excerpt ?? doc.subtitle ?? '',
        person: doc.title,
        role: primaryCategory,
        subcategory: primarySubcategory,
        imageUrl:
          heroImage?.sizes?.hero?.url ??
          heroImage?.sizes?.card?.url ??
          heroImage?.sizes?.thumb?.url ??
          heroImage?.url ??
          null,
        imageAlt: heroImage?.alt ?? doc.title,
        publishDate: doc.publishDate ?? null,
      }
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('[news/artist-profiles]', error)
    return NextResponse.json([], { status: 200 })
  }
}