import type { NewsArticle } from '@/app/news/news.types'
import FeaturedEditorialClient from './FeaturedEditorialClient'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media'

async function getRandomEditorialArticles(): Promise<NewsArticle[]> {
  try {
    // 1. Fetch from server (bypasses CORS)
    // 2. Use no-store to ensure it is fresh and randomized on every page load
    const res = await fetch(
      `${CMS_URL}/api/articles?where[_status][equals]=published&limit=15&sort=-publishDate&depth=2`,
      { cache: 'no-store' }
    )
    
    if (!res.ok) {
      console.error('Failed to fetch editorial slider articles. Status:', res.status)
      return []
    }
    
    const data = await res.json()
    const articles = data.docs || []

    if (articles.length === 0) return []

    // 3. Randomize the array on the server
    const shuffled = [...articles].sort(() => 0.5 - Math.random())

    // 4. Return top 3
    return shuffled.slice(0, 3)
  } catch (error) {
    console.error('Error fetching editorial slider:', error)
    return []
  }
}

export default async function FeaturedEditorialSlider() {
  const articles = await getRandomEditorialArticles()

  // Fail gracefully if CMS is empty or offline
  if (!articles || articles.length === 0) {
    return null
  }

  // Pass the safely fetched data to the interactive client component
  return <FeaturedEditorialClient articles={articles} />
}