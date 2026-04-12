// Make sure your .env.local has NEXT_PUBLIC_CMS_URL=https://wavenation.media
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'https://wavenation.media'

export async function getShows() {
  try {
    // CHANGED: /api/shows -> /api/radioShows
    // ADDED: &depth=2 to ensure logos and hosts resolve fully
    const res = await fetch(
      `${CMS_URL}/api/radioShows?where[_status][equals]=published&limit=50&sort=-createdAt&depth=2`,
      { cache: 'no-store' }
    )
    
    if (!res.ok) {
      console.error('Failed to fetch shows. Status:', res.status)
      return []
    }
    
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching shows:', error)
    return []
  }
}

export async function getShowBySlug(slug: string) {
  try {
    // CHANGED: /api/shows -> /api/radioShows
    // ADDED: &depth=2
    const res = await fetch(
      `${CMS_URL}/api/radioShows?where[slug][equals]=${slug}&limit=1&depth=2`,
      { cache: 'no-store' }
    )
    
    if (!res.ok) {
      console.error(`Failed to fetch show ${slug}. Status:`, res.status)
      return null
    }
    
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error(`Error fetching show ${slug}:`, error)
    return null
  }
}