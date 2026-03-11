// lib/charts/getChartMetrics.ts

import { getChartBySlug } from './getChartBySlug'
import {
  buildChartSnapshot,
  type ChartDoc,
  type ChartSnapshot,
} from './chartMetrics'

export async function getChartMetrics(
  slug: string,
): Promise<ChartSnapshot | null> {
  const chart = (await getChartBySlug(slug)) as ChartDoc | null

  if (!chart) return null

  return buildChartSnapshot(chart)
}