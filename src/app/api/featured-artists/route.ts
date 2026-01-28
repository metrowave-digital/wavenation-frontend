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
   GET Featured Artists (up to 3)
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
      throw new Error('Failed to fetch featured artists')
    }

    const data = (await res.json()) as ArticlesResponse

    const artists = data.docs
      .filter((doc) =>
        doc.contentBlocks?.some(
          (block): block is ArtistSpotlightBlock =>
            block.blockType === 'artistSpotlight'
        )
      )
      .slice(0, 3)
      .map((doc) => {
        const spotlight = doc.contentBlocks?.find(
          (block): block is ArtistSpotlightBlock =>
            block.blockType === 'artistSpotlight'
        )

        return {
          id: doc.id,
          slug: doc.slug,
          title: doc.title,
          subtitle: doc.subtitle,
          excerpt: doc.excerpt,
          publishDate: doc.publishDate,
          hero: doc.hero,
          artistSpotlight: spotlight,
        }
      })

    return NextResponse.json(artists)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to load featured artists' },
      { status: 500 }
    )
  }
}
