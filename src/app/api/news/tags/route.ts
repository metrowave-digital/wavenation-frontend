export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

type Tag = {
  label?: string | null
  slug?: string | null
}

type Article = {
  tags?: Tag[] | null
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

export async function GET() {
  try {
    const url = new URL('/api/articles', CMS_URL)

    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', '100')
    url.searchParams.set('depth', '1')

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error(`Tag fetch failed: ${res.status}`)
    }

    const data = await res.json()

    const articles: Article[] = data.docs ?? []

    const tagMap = new Map<string, { title: string; href: string }>()

    articles.forEach((article) => {
      article.tags?.forEach((tag) => {
        if (!tag.slug || !tag.label) return

        tagMap.set(tag.slug, {
          title: tag.label,
          href: `/news/tag/${tag.slug}`,
        })
      })
    })

    const tags = Array.from(tagMap.values())

    const randomTags = shuffle(tags).slice(0, 10)

    return NextResponse.json(randomTags, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[api/news/tags] error', error)
    return NextResponse.json([], { status: 200 })
  }
}