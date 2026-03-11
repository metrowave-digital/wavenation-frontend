export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { fetchArticles, sortByPublishDateDesc, toNewsCard } from '../../news/_lib'

type FeaturedEditorialItem = {
  id: number
  title: string
  excerpt: string
  href: string
  imageUrl: string | null
  imageAlt: string
  category: string
  publishDate: string | null
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

function toFeaturedEditorialItem(
  item: ReturnType<typeof toNewsCard>
): FeaturedEditorialItem {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || 'Read the latest story from WaveNation editorial.',
    href: item.href,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    category: item.subcategory || item.category || 'Featured',
    publishDate: item.publishDate,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const limit = Math.max(1, Math.min(6, Number(searchParams.get('limit') ?? 3)))

    const articles = await fetchArticles(200)
    const sorted = sortByPublishDateDesc(articles)

    const eligible = sorted.filter((article) => {
      return Boolean(article.id && article.title && article.slug)
    })

    const cards = eligible.map(toNewsCard)

    const withImages = cards.filter((item) => Boolean(item.imageUrl))
    const pool = withImages.length >= limit ? withImages : cards

    const items = shuffleArray(pool)
      .slice(0, limit)
      .map(toFeaturedEditorialItem)

    return NextResponse.json(
      { items },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('[api/home/featured-editorial] error', error)

    return NextResponse.json(
      { items: [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}