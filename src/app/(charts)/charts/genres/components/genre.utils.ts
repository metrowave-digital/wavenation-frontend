// src/app/(charts)/charts/genres/components/genre.utils.ts

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

export function getCurrentChart<T extends { publishDate?: string }>(
  charts: T[],
): T | null {
  const sorted = sortChartsByPublishDateDesc(charts)
  return sorted[0] ?? null
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