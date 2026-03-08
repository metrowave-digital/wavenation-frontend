import 'server-only'

export type NewsCardItem = {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl?: string | null
  imageAlt?: string | null
}

export type TrendingItem = {
  id: number
  title: string
  href: string
  meta: string
}

export type FeaturedInterviewItem = {
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

export type MoreArticlesResponse = {
  items: NewsCardItem[]
  hasMore: boolean
  nextPage: number | null
}

export type NewsPageData = {
  topStories: NewsCardItem[]
  trending: TrendingItem[]
  latestNews: NewsCardItem[]
  editorsPicks: NewsCardItem[]
  featuredInterviews: FeaturedInterviewItem[]
  moreArticles: NewsCardItem[]
  moreArticlesHasMore: boolean
}