const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'https://wavenation.media'

export async function getHomepageArticles() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?where[_status][equals]=published&sort=-publishDate&limit=15&depth=2`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching homepage articles:', error)
    return []
  }
}

// NEW: Fetch up to 2 featured articles for the Spotlight section
export async function getSpotlightArticles() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?where[isFeatured][equals]=true&where[_status][equals]=published&sort=-publishDate&limit=2&depth=2`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching spotlight articles:', error)
    return []
  }
}