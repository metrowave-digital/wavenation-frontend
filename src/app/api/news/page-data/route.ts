export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL?.startsWith('http')
    ? process.env.VERCEL_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

async function safeFetch<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      return [] as T
    }

    return (await res.json()) as T
  } catch {
    return [] as T
  }
}

export async function GET() {
  try {
    const [topStories, trending, latestNews, editorsPicks, featuredInterviews] = await Promise.all([
      safeFetch(`${BASE_URL}/api/news/top-stories`),
      safeFetch(`${BASE_URL}/api/news/trending`),
      safeFetch(`${BASE_URL}/api/news/latest`),
      safeFetch(`${BASE_URL}/api/news/editors-picks`),
      safeFetch(`${BASE_URL}/api/news/featured-interviews`),
    ])

    return NextResponse.json({
      topStories,
      trending,
      latestNews,
      editorsPicks,
      featuredInterviews,
    })
  } catch (err) {
    console.error('[news/page-data]', err)
    return NextResponse.json({
      topStories: [],
      trending: [],
      latestNews: [],
      editorsPicks: [],
      featuredInterviews: [],
    })
  }
}
export type NewsCardItem = {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl?: string | null
  imageAlt?: string | null
}

export interface NewsPageData {
  topStories: NewsCardItem[]
  trending: Array<{
    id: number
    title: string
    href: string
    meta: string
  }>
  latestNews: NewsCardItem[]
  editorsPicks: NewsCardItem[]
  featuredInterviews: Array<{
    id: number
    eyebrow: string
    title: string
    href: string
    excerpt: string
    person: string
    role: string
    imageUrl?: string | null
    imageAlt?: string | null
  }>
  moreArticles: NewsCardItem[]
  moreArticlesHasMore?: boolean
}