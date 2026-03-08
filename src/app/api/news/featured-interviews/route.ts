export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

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
    hero?: MediaSize | null
    card?: MediaSize | null
    thumb?: MediaSize | null
    square?: MediaSize | null
  } | null
}

type CategoryLike = {
  name?: string | null
  slug?: string | null
}

type ArticleDoc = {
  id: number
  slug: string
  title: string
  subtitle?: string | null
  excerpt?: string | null
  publishDate?: string | null
  hero?: {
    image?: MediaImage | null
  } | null
  categories?: CategoryLike[] | null
  subcategories?: CategoryLike[] | null
}

type ArticlesResponse = {
  docs: ArticleDoc[]
}

type InterviewItem = {
  id: number
  eyebrow: string
  title: string
  href: string
  excerpt: string
  person: string
  role: string
  subcategory?: string
  imageUrl: string | null
  imageAlt: string
  publishDate: string | null
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

function getImage(image?: MediaImage | null) {
  return (
    image?.sizes?.hero?.url ??
    image?.sizes?.card?.url ??
    image?.sizes?.thumb?.url ??
    image?.sizes?.square?.url ??
    image?.url ??
    null
  )
}

function normalizeText(value?: string | null) {
  return (value ?? '').trim()
}

function mapInterview(doc: ArticleDoc): InterviewItem {
  const heroImage = doc.hero?.image ?? null
  const primaryCategory = normalizeText(doc.categories?.[0]?.name) || 'Interview'
  const primarySubcategory =
    normalizeText(doc.subcategories?.[0]?.name) || 'Featured Interview'

  return {
    id: doc.id,
    eyebrow: primarySubcategory,
    title: doc.title,
    href: `/news/${doc.slug}`,
    excerpt: normalizeText(doc.excerpt) || normalizeText(doc.subtitle),
    person: doc.title,
    role: primaryCategory,
    subcategory: primarySubcategory,
    imageUrl: getImage(heroImage),
    imageAlt: normalizeText(heroImage?.alt) || doc.title,
    publishDate: doc.publishDate ?? null,
  }
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      depth: '2',
      draft: 'false',
      limit: '6',
      sort: '-publishDate',
      'where[status][equals]': 'published',
      'where[subcategories.slug][equals]': 'artist-profiles',
    })

    const res = await fetch(`${CMS_URL}/api/articles?${params.toString()}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[news/featured-interviews] bad response', res.status)
      return NextResponse.json([], { status: 200 })
    }

    const data = (await res.json()) as ArticlesResponse
    const docs = data.docs ?? []

    const interviews = docs.slice(0, 4).map(mapInterview)

    return NextResponse.json(interviews, { status: 200 })
  } catch (error) {
    console.error('[news/featured-interviews]', error)
    return NextResponse.json([], { status: 200 })
  }
}