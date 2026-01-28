import { NextResponse } from 'next/server'

/* ======================================================
   Minimal Payload Types (API-safe)
====================================================== */

type MediaSize = {
  url: string
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

type ArtistLink = {
  label: string
  url: string
}

type ArtistSpotlightBlock = {
  blockType: 'artistSpotlight'
  artistName: string
  image?: MediaImage
  description?: string
  links?: ArtistLink[]
}

type ContentBlock =
  | ArtistSpotlightBlock
  | {
      blockType: string
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
  contentBlocks?: ContentBlock[]
}

type ArticlesResponse = {
  docs: ArticleDoc[]
}


const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/* ======================================================
   GET Featured Artist Hero
====================================================== */

export async function GET() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?` +
        new URLSearchParams({
          depth: '2',
          draft: 'false',
          limit: '5',
          sort: '-publishDate',
          'where[status][equals]': 'published',
          'where[isFeatured][equals]': 'true',
          'where[subcategories.slug][equals]': 'artist-profiles',
        }),
      { cache: 'no-store' }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch featured artist hero')
    }

    const data = (await res.json()) as ArticlesResponse

    const featured = data.docs.find((doc) =>
      doc.contentBlocks?.some(
        (block): block is ArtistSpotlightBlock =>
          block.blockType === 'artistSpotlight'
      )
    )

    if (!featured) {
      return NextResponse.json(null)
    }

    const spotlight = featured.contentBlocks?.find(
      (block): block is ArtistSpotlightBlock =>
        block.blockType === 'artistSpotlight'
    )

    return NextResponse.json({
      id: featured.id,
      slug: featured.slug,
      title: featured.title,
      subtitle: featured.subtitle,
      excerpt: featured.excerpt,
      publishDate: featured.publishDate,
      hero: featured.hero,
      artistSpotlight: spotlight,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to load featured artist hero' },
      { status: 500 }
    )
  }
}
