import { getHomepageCharts } from '../../../../lib/charts/getHomepageCharts'
import { getEditorsPicks } from '@/services/news.api'
import HomeHeroClient from './HomeHero.client'
import type { NewsArticle } from '@/app/news/news.types'

/**
 * Server Component: HomeHero
 * Updated to accept manually selected spotlight articles from the CMS.
 */
interface HomeHeroProps {
  spotlightArticles: (NewsArticle | string | number)[]
}

export default async function HomeHero({ spotlightArticles }: HomeHeroProps) {
  // Concurrently fetch Charts and Featured News for the Slider
  const [charts, heroArticles] = await Promise.all([
    getHomepageCharts(),
    getEditorsPicks(5) // Fetch top 5 Editor's Picks for the HeroSlider
  ])

  return (
    <HomeHeroClient 
      charts={charts} 
      heroArticles={heroArticles} 
      spotlightArticles={spotlightArticles} // Now passed through to the Client UI
    />
  )
}