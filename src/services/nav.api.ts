import { NavConfigResponse, MainNavItem } from '@/components/layout/Header/nav/nav.types'

export async function getMainNav(): Promise<MainNavItem[]> {
  try {
    const res = await fetch(
      'https://wavenation.media/api/globals/nav-config?depth=2',
      {
        next: { 
          revalidate: 300, 
          tags: ['nav-config'] 
        },
      }
    )

    if (!res.ok) throw new Error('Failed to fetch navigation')

    const data: NavConfigResponse = await res.json()
    return data.mainNav || []
  } catch (error) {
    console.error('Nav Fetch Error:', error)
    return []
  }
}