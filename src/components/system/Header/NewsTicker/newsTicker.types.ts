export interface NewsTickerItem {
  id: string
  label: string
  href?: string
  category?: 'news' | 'music' | 'culture' | 'events'
  isBreaking?: boolean
}

export interface NewsTickerProps {
  label?: string
}