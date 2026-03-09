export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { fetchArticles, sortByPublishDateDesc, toNewsCard } from '../_lib'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const limit = Math.max(1, Math.min(24, Number(searchParams.get('limit') ?? 12)))
    const offset = Math.max(0, Number(searchParams.get('offset') ?? 0))

    const articles = await fetchArticles(200)
    const sorted = sortByPublishDateDesc(articles)

    const page = sorted.slice(offset, offset + limit)
    const hasMore = offset + limit < sorted.length

    return NextResponse.json(
      {
        items: page.map(toNewsCard),
        hasMore,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('[api/news/more-articles] error', error)
    return NextResponse.json(
      { items: [], hasMore: false },
      { status: 200 }
    )
  }
}