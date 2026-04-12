export interface NewsTickerItem {
  id: string
  label: string
  href: string
  category?: string
  isBreaking?: boolean
  validUntil?: string | null
  accentOverride?: string | null
}

export interface NewsTickerSettings {
  id: number
  defaultLabel: string
  scrollSpeed: number
  isCrisisMode: boolean
  crisisPrimaryColor: string 
  crisisTextColor: string    
  manualInjects: NewsTickerItem[]
  updatedAt: string
  createdAt: string
  globalType: string
}

export interface NewsTickerProps {
  label?: string
  isCrisisMode?: boolean
}