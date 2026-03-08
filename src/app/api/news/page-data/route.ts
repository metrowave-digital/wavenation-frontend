export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getNewsPageData } from '@/lib/news/getNewsPageData'

export async function GET() {
  try {
    const data = await getNewsPageData()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[news/page-data]', err)

    return NextResponse.json({
      topStories: [],
      trending: [],
      latestNews: [],
      editorsPicks: [],
      featuredInterviews: [],
      moreArticles: [],
      moreArticlesHasMore: false,
    })
  }
}