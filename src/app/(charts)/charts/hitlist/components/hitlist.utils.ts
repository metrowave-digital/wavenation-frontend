// app/(charts)/charts/hitlist/components/hitlist.utils.ts

export type ChartEntry = {
  rank: number
  trackTitle: string
  artist: string
}

export type ChartDoc = {
  id: string
  slug: string
  chartKey: string
  week: string
  publishDate: string
  entries: ChartEntry[]
}

export function sortChartsByPublishDateDesc<T extends { publishDate?: string }>(
  charts: T[],
): T[] {
  return [...charts].sort((a, b) => {
    const aTime = a.publishDate ? new Date(a.publishDate).getTime() : 0
    const bTime = b.publishDate ? new Date(b.publishDate).getTime() : 0
    return bTime - aTime
  })
}

export function sortChartsByWeekDesc<T extends { slug?: string }>(charts: T[]): T[] {
  return [...charts].sort((a, b) => {
    const aKey = extractSlugSortKey(a.slug ?? '')
    const bKey = extractSlugSortKey(b.slug ?? '')
    return bKey - aKey
  })
}

function extractSlugSortKey(slug: string): number {
  const match = slug.match(/hitlist-(\d{4})-W(\d{1,2})/i)
  if (!match) return 0

  const year = Number(match[1])
  const week = Number(match[2])

  return year * 100 + week
}

export function extractYearFromSlug(slug: string): string | null {
  const match = slug.match(/hitlist-(\d{4})-W\d{1,2}/i)
  return match?.[1] ?? null
}

export function extractWeekFromSlug(slug: string): string | null {
  const match = slug.match(/hitlist-(\d{4})-W(\d{1,2})/i)
  if (!match) return null
  return `W${String(match[2]).padStart(2, '0')}`
}

export function buildHitlistSlug(year: string, week: string): string {
  const normalizedWeek = week.toUpperCase().replace(/^W/, '')
  return `hitlist-${year}-W${String(normalizedWeek).padStart(2, '0')}`
}

export function formatPublishDate(date?: string | null): string {
  if (!date) return 'Date TBA'

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
  } catch {
    return date
  }
}

export function getAvailableYears(charts: { slug: string }[]): string[] {
  const years = new Set<string>()

  for (const chart of charts) {
    const year = extractYearFromSlug(chart.slug)
    if (year) years.add(year)
  }

  return [...years].sort((a, b) => Number(b) - Number(a))
}

export function getWeeksForYear<T extends { slug: string }>(
  charts: T[],
  year: string,
): T[] {
  return sortChartsByWeekDesc(
    charts.filter((chart) => extractYearFromSlug(chart.slug) === year),
  )
}

export function getCurrentHitlist<T extends { slug: string; publishDate?: string }>(
  charts: T[],
): T | null {
  const hitlistCharts = charts.filter((chart) => /^hitlist-\d{4}-W\d{1,2}$/i.test(chart.slug))
  if (!hitlistCharts.length) return null

  return sortChartsByPublishDateDesc(hitlistCharts)[0] ?? null
}