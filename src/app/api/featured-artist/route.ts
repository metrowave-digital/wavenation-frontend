import { NextResponse } from 'next/server'

/* ======================================================
   ENV
====================================================== */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

/* ======================================================
   CMS Types (Payload REST shape)
====================================================== */

type MediaSize = {
  url?: string | null
  width?: number | null
  height?: number | null
}

type MediaImage = {
  url?: string | null
  alt?: string | null
  caption?: string | null
  credit?: string | null
  sizes?: {
    square?: MediaSize | null
    card?: MediaSize | null
    hero?: MediaSize | null
    thumb?: MediaSize | null
  }
}

type Author = {
  displayName?: string | null
}

type ArtistSpotlightBlock = {
  blockType: 'artistSpotlight'
  artistName: string
  image?: MediaImage | null
  description?: string | null
}

type UnknownBlock = {
  blockType: string
  [key: string]: unknown
}

type ArticleDoc = {
  slug: string
  title: string
  excerpt?: string | null
  author?: Author | null
  hero?: {
    image?: MediaImage | null
  } | null
  contentBlocks?: Array<ArtistSpotlightBlock | UnknownBlock> | null
}

/* ======================================================
   API Response Shape
====================================================== */

type FeaturedArtistResponse = {
  slug: string
  articleTitle: string
  excerpt?: string
  author?: {
    name: string
  }
  artist: {
    name: string
    image?: {
      url: string
      alt?: string
    }
  }
  heroImage?: {
    url: string
    alt?: string
    caption?: string
  }
}

/* ======================================================
   GET
====================================================== */

export async function GET() {
  try {
    const url = new URL('/api/articles', CMS_URL)

    // ✅ Payload REST filters
    url.searchParams.set('where[_status][equals]', 'published')
    url.searchParams.set('where[isFeatured][equals]', 'true')
    url.searchParams.set('sort', '-publishDate')
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '2')

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error(`CMS request failed: ${res.status}`)
    }

    const data = (await res.json()) as {
      docs?: ArticleDoc[]
    }

    const doc = data?.docs?.[0]

    if (!doc || !Array.isArray(doc.contentBlocks)) {
      return NextResponse.json({ featured: null })
    }

    /* =========================================
       Find Artist Spotlight block
    ========================================= */

    const spotlightBlock = doc.contentBlocks.find(
      (block): block is ArtistSpotlightBlock =>
        block.blockType === 'artistSpotlight'
    )

    if (!spotlightBlock) {
      return NextResponse.json({ featured: null })
    }

    /* =========================================
       Resolve artist image
    ========================================= */

    const spotlightImage =
      spotlightBlock.image?.sizes?.square?.url ||
      spotlightBlock.image?.sizes?.card?.url ||
      spotlightBlock.image?.url ||
      null

    /* =========================================
       Resolve hero image
    ========================================= */

    const heroImage =
      doc.hero?.image?.sizes?.hero?.url ||
      doc.hero?.image?.url ||
      null

    /* =========================================
       Build response
    ========================================= */

    const response: FeaturedArtistResponse = {
      slug: doc.slug,
      articleTitle: doc.title,
      excerpt: doc.excerpt ?? undefined,

      author: doc.author?.displayName
        ? { name: doc.author.displayName }
        : undefined,

      artist: {
        name: spotlightBlock.artistName,
        image: spotlightImage
          ? {
              url: spotlightImage,
              alt: spotlightBlock.image?.alt ?? undefined,
            }
          : undefined,
      },

      heroImage: heroImage
        ? {
            url: heroImage,
            alt: doc.hero?.image?.alt ?? undefined,
            caption: doc.hero?.image?.caption ?? undefined,
          }
        : undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[featured-artist]', error)
    return NextResponse.json(
      { featured: null },
      { status: 500 }
    )
  }
}
