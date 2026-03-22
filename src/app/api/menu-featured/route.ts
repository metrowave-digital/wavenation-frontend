import { NextResponse } from 'next/server'

type CMSImageSize = {
  url?: string | null
}

type CMSHeroImage = {
  alt?: string | null
  url?: string | null
  sizes?: {
    hero?: CMSImageSize | null
    card?: CMSImageSize | null
    thumb?: CMSImageSize | null
    square?: CMSImageSize | null
  } | null
} | null

type CMSArticle = {
  id: string | number
  title: string
  slug: string
  menuFeature?: boolean | null
  menuContext?: string | null
  menuEyebrow?: string | null
  menuDescription?: string | null
  hero?: {
    image?: CMSHeroImage
  } | null
}

type CMSArticlesResponse = {
  docs?: CMSArticle[]
}

function getCmsBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_CMS_URL ?? '').replace(/\/$/, '')
}

function toAbsoluteUrl(url?: string | null): string | null {
  if (!url) return null

  const trimmed = url.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const base = getCmsBaseUrl()
  if (!base) return trimmed

  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`
}

function pickHeroImageUrl(image?: CMSHeroImage): string | null {
  if (!image) return null

  return toAbsoluteUrl(
    image.sizes?.hero?.url ??
      image.sizes?.card?.url ??
      image.sizes?.thumb?.url ??
      image.sizes?.square?.url ??
      null
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const context = searchParams.get('context')?.trim().toLowerCase()
  const cmsBaseUrl = getCmsBaseUrl()

  if (!context || !cmsBaseUrl) {
    return NextResponse.json([])
  }

  const query = new URLSearchParams({
    'where[status][equals]': 'published',
    'where[menuFeature][equals]': 'true',
    'where[menuContext][equals]': context,
    limit: '4',
    sort: '-publishDate',
    depth: '2',
  })

  try {
    const res = await fetch(`${cmsBaseUrl}/api/articles?${query.toString()}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[menu-featured] bad response', res.status)
      return NextResponse.json([])
    }

    const json = (await res.json()) as CMSArticlesResponse
    const docs = Array.isArray(json.docs) ? json.docs : []

    const items = docs.map((article) => {
      const image = article.hero?.image ?? null
      const imageUrl = pickHeroImageUrl(image)

      return {
        id: article.id,
        title: article.title,
        description: article.menuDescription ?? '',
        eyebrow: article.menuEyebrow ?? '',
        href: `/news/${article.slug}`,
        image: imageUrl
          ? {
              url: imageUrl,
              alt: image?.alt ?? article.title,
            }
          : null,
      }
    })

    console.log(
      '[menu-featured] mapped',
      items.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image?.url ?? null,
      }))
    )

    return NextResponse.json(items)
  } catch (error) {
    console.error('[menu-featured]', error)
    return NextResponse.json([])
  }
}