import { 
  TrendingUp, 
  Music4, 
  Brain, 
  Radio, 
  Podcast, // Use Podcast for the "Broadcast" visual
  Mic, 
  Tv, 
  Newspaper, 
  CirclePlay, // Modern name for PlayCircle
  Calendar, 
  ShoppingBag, 
  Star, 
  Users, 
  Handshake,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const NAV_ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Music4,
  Brain,
  Radio,
  // We map the string "Broadcast" (from CMS) to the Podcast component
  Broadcast: Podcast, 
  Mic,
  Tv,
  Newspaper,
  // We map the string "PlayCircle" (from CMS) to the CirclePlay component
  PlayCircle: CirclePlay,
  Calendar,
  ShoppingBag,
  Star,
  Users,
  Handshake,
}