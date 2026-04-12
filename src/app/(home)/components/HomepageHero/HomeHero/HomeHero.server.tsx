import { getHomepageCharts } from '../../../../lib/charts/getHomepageCharts'
import { getEditorsPicks } from '@/services/news.api' // Connected news service
import HomeHeroClient from './HomeHero.client'

/**
 * Server Component: HomeHero
 * Fetches all necessary data for the Command Center on the server
 * to ensure zero layout shift and SEO optimization.
 */
export default async function HomeHero() {
  // Concurrently fetch Charts and Featured News
  const [charts, heroArticles] = await Promise.all([
    getHomepageCharts(),
    getEditorsPicks(5) // Fetch top 5 Editor's Picks for the HeroSlider
  ])

  return (
    <HomeHeroClient 
      charts={charts} 
      heroArticles={heroArticles} 
    />
  )
}