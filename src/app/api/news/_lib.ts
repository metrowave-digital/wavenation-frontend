const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

type CategoryLike = {
  id?: number
  name?: string | null
  slug?: string | null
}

type TagLike = {
  id?: number
  label?: string | null
  slug?: string | null
}

type ImageSizes = {
  hero?: { url?: string | null } | null
  card?: { url?: string | null } | null
  thumb?: { url?: string | null } | null
  square?: { url?: string | null } | null
}

type MediaLike = {
  url?: string | null
  alt?: string | null
  sizes?: ImageSizes | null
}

type ArticleLike = {
  id: number
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  publishDate?: string | null
  isFeatured?: boolean | null
  categories?: CategoryLike[] | null
  subcategories?: CategoryLike[] | null
  tags?: TagLike[] | null
  hero?: {
    image?: MediaLike | null
  } | null
  aiRanking?: {
    boost?: number | null
    decay?: number | null
    freshness?: number | null
  } | null
}

export type NewsCardItem = {
  id: number
  title: string
  href: string
  category: string
  excerpt: string
  imageUrl: string | null
  imageAlt: string
  subcategory?: string
  publishDate: string | null
  score: number
}

export type InterviewItem = NewsCardItem & {
  eyebrow: string
  person: string
  role: string
}

export async function fetchArticles(limit = 100): Promise<ArticleLike[]> {
  const url = new URL('/api/articles', CMS_URL)

  url.searchParams.set('where[status][equals]', 'published')
  url.searchParams.set('depth', '2')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('sort', '-publishDate')

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`)
  }

  const data = (await res.json()) as { docs?: ArticleLike[] }
  return data.docs ?? []
}

export function normalizeText(value?: string | null): string {
  return (value ?? '').trim()
}

export function getCategoryName(article: ArticleLike): string {
  const name = article.categories?.find((item) => normalizeText(item.name))?.name
  return name ?? 'News'
}

export function getSubcategoryName(article: ArticleLike): string | undefined {
  const name =
    article.subcategories?.find((item) => normalizeText(item.name))?.name
  return name ?? undefined
}

export function getImage(article: ArticleLike): {
  imageUrl: string | null
  imageAlt: string
} {
  const image = article.hero?.image
  const imageUrl =
    image?.sizes?.card?.url ??
    image?.sizes?.hero?.url ??
    image?.sizes?.thumb?.url ??
    image?.sizes?.square?.url ??
    image?.url ??
    null

  return {
    imageUrl,
    imageAlt: image?.alt ?? article.title ?? 'WaveNation article',
  }
}

export function getAiScore(article: ArticleLike): number {
  const boost = Number(article.aiRanking?.boost ?? 0)
  const decay = Number(article.aiRanking?.decay ?? 0)
  const freshness = Number(article.aiRanking?.freshness ?? 0)

  return boost + decay + freshness
}

export function toNewsCard(article: ArticleLike): NewsCardItem {
  const { imageUrl, imageAlt } = getImage(article)

  return {
    id: article.id,
    title: article.title ?? 'Untitled',
    href: `/news/${article.slug ?? article.id}`,
    category: getCategoryName(article),
    excerpt: article.excerpt ?? '',
    imageUrl,
    imageAlt,
    subcategory: getSubcategoryName(article),
    publishDate: article.publishDate ?? null,
    score: getAiScore(article),
  }
}

export function hasCategory(article: ArticleLike, slug: string): boolean {
  const needle = slug.toLowerCase()

  return (article.categories ?? []).some(
    (item) => (item.slug ?? '').toLowerCase() === needle
  )
}

export function hasSubcategory(article: ArticleLike, slug: string): boolean {
  const needle = slug.toLowerCase()

  return (article.subcategories ?? []).some(
    (item) => (item.slug ?? '').toLowerCase() === needle
  )
}

export function hasTag(article: ArticleLike, slug: string): boolean {
  const needle = slug.toLowerCase()

  return (article.tags ?? []).some(
    (item) => (item.slug ?? '').toLowerCase() === needle
  )
}

export function isArtistProfile(article: ArticleLike): boolean {
  return (
    hasCategory(article, 'artist-profile') ||
    hasCategory(article, 'artist-profiles') ||
    hasSubcategory(article, 'artist-profile') ||
    hasSubcategory(article, 'artist-profiles') ||
    hasTag(article, 'artist-profile') ||
    hasTag(article, 'artist-profiles')
  )
}

export function isInterview(article: ArticleLike): boolean {
  return (
    hasCategory(article, 'interview') ||
    hasCategory(article, 'interviews') ||
    hasSubcategory(article, 'interview') ||
    hasSubcategory(article, 'interviews') ||
    hasTag(article, 'interview') ||
    hasTag(article, 'interviews')
  )
}

export function isFeaturedInterview(article: ArticleLike): boolean {
  return isArtistProfile(article) || isInterview(article)
}

export function sortByPublishDateDesc<T extends { publishDate?: string | null }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aTime = a.publishDate ? new Date(a.publishDate).getTime() : 0
    const bTime = b.publishDate ? new Date(b.publishDate).getTime() : 0
    return bTime - aTime
  })
}

export function sortByAiScoreDesc(items: ArticleLike[]): ArticleLike[] {
  return [...items].sort((a, b) => {
    const scoreDiff = getAiScore(b) - getAiScore(a)

    if (scoreDiff !== 0) return scoreDiff

    const aTime = a.publishDate ? new Date(a.publishDate).getTime() : 0
    const bTime = b.publishDate ? new Date(b.publishDate).getTime() : 0

    return bTime - aTime
  })
}

export function extractPersonName(article: ArticleLike): string {
  const title = article.title ?? ''

  const match = title.match(
    /^(.+?)\s+(?:on|talks|discusses|opens up|reflects|shares)\b/i
  )

  if (match?.[1]) {
    return match[1].trim()
  }

  const firstTag = article.tags?.find((tag) => normalizeText(tag.label))?.label
  return firstTag ?? 'Featured Guest'
}

export function extractRole(article: ArticleLike): string {
  const subcategory = getSubcategoryName(article)

  if (subcategory) return subcategory

  return getCategoryName(article)
}

export function toInterviewItem(article: ArticleLike): InterviewItem {
  const base = toNewsCard(article)

  return {
    ...base,
    eyebrow: isArtistProfile(article) ? 'Artist Profile' : 'Interview',
    person: extractPersonName(article),
    role: extractRole(article),
  }
}