export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { fetchArticles, sortByAiScoreDesc, toNewsCard } from '../_lib'

export async function GET() {
  try {
    const articles = await fetchArticles(100)

    const items = sortByAiScoreDesc(articles).slice(0, 4).map(toNewsCard)

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[api/news/top-stories] error', error)
    return NextResponse.json([], { status: 200 })
  }
}