export interface NewsCardItem {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl?: string | null
  imageAlt?: string | null
  subcategory?: string
  publishDate?: string | null
}

export interface TrendingItem {
  id: number
  title: string
  href: string
  meta: string
}

export interface InterviewItem {
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
  publishDate?: string | null
}

export interface NewsPageData {
  topStories: NewsCardItem[]
  trending: TrendingItem[]
  latestNews: NewsCardItem[]
  editorsPicks: NewsCardItem[]
  featuredInterviews: InterviewItem[]
  moreArticles: NewsCardItem[]
  moreArticlesHasMore?: boolean
}