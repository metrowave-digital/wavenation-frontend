export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import {
  fetchArticles,
  isFeaturedInterview,
  sortByAiScoreDesc,
  sortByPublishDateDesc,
  toInterviewItem,
  toNewsCard,
} from '../_lib'

export async function GET() {
  try {
    const articles = await fetchArticles(200)

    const ranked = sortByAiScoreDesc(articles)
    const latestSorted = sortByPublishDateDesc(articles)

    const topStories = ranked.slice(0, 4).map(toNewsCard)

    const latestNews = latestSorted.slice(0, 8).map(toNewsCard)

    const featuredInterviews = latestSorted
      .filter((article) => isFeaturedInterview(article))
      .slice(0, 4)
      .map(toInterviewItem)

    const editorsPicks = latestSorted
      .filter(
        (article) =>
          article.isFeatured === true && !isFeaturedInterview(article)
      )
      .slice(0, 6)
      .map(toNewsCard)

    const topStoryIds = new Set(ranked.slice(0, 4).map((item) => item.id))

    const trending = ranked
      .filter((article) => !topStoryIds.has(article.id))
      .slice(0, 6)
      .map(toNewsCard)

    const moreArticles = latestSorted.slice(0, 12).map(toNewsCard)
    const moreArticlesHasMore = latestSorted.length > 12

    return NextResponse.json(
      {
        topStories,
        latestNews,
        editorsPicks,
        featuredInterviews,
        trending,
        moreArticles,
        moreArticlesHasMore,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('[api/news/page-data] error', error)

    return NextResponse.json(
      {
        topStories: [],
        latestNews: [],
        editorsPicks: [],
        featuredInterviews: [],
        trending: [],
        moreArticles: [],
        moreArticlesHasMore: false,
      },
      { status: 200 }
    )
  }
}