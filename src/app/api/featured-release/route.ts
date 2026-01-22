import { NextResponse } from 'next/server'

/* ======================================================
   ENV
====================================================== */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

/* ======================================================
   CMS Types (MINIMAL, SAFE)
====================================================== */

type MediaSize = {
  url: string
}

type MediaImage = {
  url: string
  alt?: string | null
  sizes?: {
    square?: MediaSize
  }
}

type AlbumTrack = {
  id: string
  title: string
  artist?: string | null
}

type AlbumDoc = {
  title: string
  slug: string
  primaryArtist: string
  releaseDate?: string | null
  coverArt?: MediaImage | null
  manualTracks?: AlbumTrack[] | null
}

type AlbumsApiResponse = {
  docs?: AlbumDoc[]
}

/* ======================================================
   GET
====================================================== */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(null)
    }

    const url = new URL('/api/albums', CMS_URL)
    url.searchParams.set('where[slug][equals]', slug)
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '2')

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error('Album fetch failed')
    }

    const data = (await res.json()) as AlbumsApiResponse
    const album = data.docs?.[0]

    if (!album) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      title: album.title,
      slug: album.slug,
      primaryArtist: album.primaryArtist,
      releaseDate: album.releaseDate ?? null,
      coverArt: album.coverArt
        ? {
            url:
              album.coverArt.sizes?.square?.url ??
              album.coverArt.url,
            alt: album.coverArt.alt ?? null,
          }
        : null,
      tracks:
        album.manualTracks?.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist ?? null,
        })) ?? null,
    })
  } catch (error) {
    console.error('[featured-release]', error)
    return NextResponse.json(null)
  }
}
