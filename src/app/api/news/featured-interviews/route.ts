export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import {
  fetchArticles,
  isFeaturedInterview,
  sortByPublishDateDesc,
  toInterviewItem,
} from '../_lib'

export async function GET() {
  try {
    const articles = await fetchArticles(100)

    const items = sortByPublishDateDesc(
      articles.filter((article) => isFeaturedInterview(article))
    )
      .slice(0, 4)
      .map(toInterviewItem)

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[api/news/featured-interviews] error', error)

    return NextResponse.json([], { status: 200 })
  }
}