// lib/charts/chartMetrics.ts

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

export type ChartSnapshot = {
  chartKey: string
  slug: string
  week: string
  publishDate: string | null
  entryCount: number
  topTrack: string | null
  topArtist: string | null
  uniqueArtistCount: number
  hasEntries: boolean
}

export type ChartsCollectionSnapshot = {
  totalCharts: number
  totalEntries: number
  averageEntriesPerChart: number
  latestPublishDate: string | null
  earliestPublishDate: string | null
  uniqueArtistCount: number
}

/* ======================================================
   SINGLE CHART SNAPSHOT
====================================================== */

export function buildChartSnapshot(chart: ChartDoc): ChartSnapshot {
  const entries = Array.isArray(chart.entries) ? chart.entries : []
  const topEntry = getTopEntry(entries)
  const uniqueArtistCount = countUniqueArtists(entries)

  return {
    chartKey: chart.chartKey,
    slug: chart.slug,
    week: chart.week,
    publishDate: chart.publishDate ?? null,
    entryCount: entries.length,
    topTrack: topEntry?.trackTitle ?? null,
    topArtist: topEntry?.artist ?? null,
    uniqueArtistCount,
    hasEntries: entries.length > 0,
  }
}

/* ======================================================
   MULTI-CHART SNAPSHOT
====================================================== */

export function buildChartsSnapshot(charts: ChartDoc[]): ChartsCollectionSnapshot {
  const safeCharts = Array.isArray(charts) ? charts : []

  const totalCharts = safeCharts.length
  const totalEntries = safeCharts.reduce((sum, chart) => {
    return sum + (Array.isArray(chart.entries) ? chart.entries.length : 0)
  }, 0)

  const averageEntriesPerChart =
    totalCharts > 0 ? Number((totalEntries / totalCharts).toFixed(2)) : 0

  const publishDates = safeCharts
    .map((chart) => chart.publishDate)
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const allArtists = new Set<string>()

  for (const chart of safeCharts) {
    for (const entry of chart.entries ?? []) {
      const normalized = normalizeArtist(entry.artist)
      if (normalized) allArtists.add(normalized)
    }
  }

  return {
    totalCharts,
    totalEntries,
    averageEntriesPerChart,
    latestPublishDate: publishDates.length
      ? publishDates[publishDates.length - 1]
      : null,
    earliestPublishDate: publishDates.length ? publishDates[0] : null,
    uniqueArtistCount: allArtists.size,
  }
}

/* ======================================================
   HELPERS
====================================================== */

export function getTopEntry(entries: ChartEntry[]): ChartEntry | null {
  if (!Array.isArray(entries) || !entries.length) return null

  const exactRankOne = entries.find((entry) => entry.rank === 1)
  if (exactRankOne) return exactRankOne

  const sorted = [...entries].sort((a, b) => a.rank - b.rank)
  return sorted[0] ?? null
}

export function countUniqueArtists(entries: ChartEntry[]): number {
  if (!Array.isArray(entries) || !entries.length) return 0

  const artists = new Set<string>()

  for (const entry of entries) {
    const normalized = normalizeArtist(entry.artist)
    if (normalized) artists.add(normalized)
  }

  return artists.size
}

export function normalizeArtist(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

export function isValidChartSlug(slug: string): boolean {
  return /^[a-z0-9-]+-\d{4}-W\d{2}$/i.test(slug)
}

export function extractYearFromChartSlug(slug: string): string | null {
  const match = slug.match(/-(\d{4})-W\d{2}$/i)
  return match?.[1] ?? null
}

export function extractWeekFromChartSlug(slug: string): string | null {
  const match = slug.match(/-W(\d{2})$/i)
  return match ? `W${match[1]}` : null
}