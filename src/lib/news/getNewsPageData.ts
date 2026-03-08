// src/lib/news/getNewsPageData.ts
import 'server-only'
import type { NewsPageData } from '@/app/news/components/types'

export async function getNewsPageData(): Promise<NewsPageData> {
  const fallback: NewsPageData = {
    topStories: [],
    trending: [],
    latestNews: [],
    editorsPicks: [],
    featuredInterviews: [],
    moreArticles: [],
    moreArticlesHasMore: false,
  }

  try {
    // call CMS directly here, not your own /api route
    // example:
    // const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/...`, {
    //   next: { revalidate: 60 },
    // })

    // if (!res.ok) return fallback
    // return await res.json()

    return fallback
  } catch {
    return fallback
  }
}