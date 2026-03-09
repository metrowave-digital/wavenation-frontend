export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { fetchArticles, sortByAiScoreDesc, toNewsCard } from '../_lib'

export async function GET() {
  try {
    const articles = await fetchArticles(100)
    const ranked = sortByAiScoreDesc(articles)

    const topStoryIds = new Set(ranked.slice(0, 4).map((item) => item.id))

    const items = ranked
      .filter((article) => !topStoryIds.has(article.id))
      .slice(0, 6)
      .map(toNewsCard)

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[api/news/trending] error', error)
    return NextResponse.json([], { status: 200 })
  }
}