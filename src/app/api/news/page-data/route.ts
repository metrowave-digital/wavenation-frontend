export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : process.env.VERCEL_URL
    ? process.env.VERCEL_URL.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      console.error('[news/page-data] fetch failed', res.status, url)
      return fallback
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('[news/page-data] fetch error', url, error)
    return fallback
  }
}

type NewsCardItem = {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl?: string | null
  imageAlt?: string | null
}

type TrendingItem = {
  id: number
  title: string
  href: string
  meta: string
}

type FeaturedInterviewItem = {
  id: number
  eyebrow: string
  title: string
  href: string
  excerpt: string
  person: string
  role: string
  subcategory?: string
  imageUrl?: string | null
  imageAlt?: string | null
}

type MoreArticlesResponse = {
  items: NewsCardItem[]
  hasMore: boolean
  nextPage: number | null
}

export async function GET() {
  try {
    const [
      topStories,
      trending,
      latestNews,
      editorsPicks,
      featuredInterviews,
      moreArticlesResponse,
    ] = await Promise.all([
      safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/top-stories`, []),
      safeFetch<TrendingItem[]>(`${BASE_URL}/api/news/trending`, []),
      safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/latest`, []),
      safeFetch<NewsCardItem[]>(`${BASE_URL}/api/news/editors-picks`, []),
      safeFetch<FeaturedInterviewItem[]>(
        `${BASE_URL}/api/news/featured-interviews`,
        []
      ),
      safeFetch<MoreArticlesResponse>(
        `${BASE_URL}/api/news/more-articles?page=1`,
        {
          items: [],
          hasMore: false,
          nextPage: null,
        }
      ),
    ])

    return NextResponse.json({
      topStories,
      trending,
      latestNews,
      editorsPicks,
      featuredInterviews,
      moreArticles: moreArticlesResponse.items ?? [],
      moreArticlesHasMore: moreArticlesResponse.hasMore ?? false,
    })
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