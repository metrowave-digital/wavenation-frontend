import {
  Compass, Radio, Newspaper, Tv,
  ShoppingBag, Users, Music4, TrendingUp, Sparkles
} from 'lucide-react'
import type { MainNavItem } from './nav.types'

export const MAIN_NAV: MainNavItem[] = [
  {
    id: 'discover',
    label: 'Discover',
    href: '/discover',
    featured: {
      eyebrow: 'Start here',
      title: 'Discover WaveNation',
      description: 'Jump into playlists, charts, creators, and culture-shaping moments.',
      href: '/discover',
      accent: 'blue',
    },
    columns: [
      {
        label: 'Playlists',
        icon: Music4,
        links: [
          { label: 'Hitlist 20', href: '/playlists/hitlist-20', badge: 'editor-pick' },
          { label: 'Midnight Silk', href: '/playlists/midnight-silk' },
          { label: 'Late Night Vibes', href: '/playlists/late-night' },
          { label: 'Hip-Hop Essentials', href: '/playlists/hip-hop', badge: 'trending' },
        ],
      },
      {
        label: 'Charts',
        icon: TrendingUp,
        links: [
          { label: 'Trending', href: '/charts/trending', badge: 'trending' },
          { label: 'Archive', href: '/charts/archive' },
          { label: 'R&B / Soul', href: '/charts/rnb' },
          { label: 'Southern Soul', href: '/charts/southern-soul' },
        ],
      },
      {
        label: 'Creators',
        icon: Sparkles,
        links: [
          { label: 'All Creators', href: '/creators' },
          { label: 'Spotlights', href: '/creators/spotlights' },
          { label: 'Join the Network', href: '/creators/join', badge: 'new' },
        ],
      },
    ],
  },
  {
    id: 'onair',
    label: 'On-Air',
    href: '/radio',
    featured: {
      eyebrow: 'Live now',
      title: 'WaveNation FM',
      description: 'Jump into the live stream, current shows, and real-time listening.',
      href: '/radio/live',
      accent: 'magenta',
    },
    columns: [
      {
        label: 'Listen',
        icon: Radio,
        links: [
          { label: 'Listen Live', href: '/radio/live', badge: 'live' },
          { label: 'Now Playing', href: '/radio/now-playing' },
        ],
      },
      {
        label: 'Schedule & Shows',
        links: [
          { label: 'Today\'s Lineup', href: '/radio/schedule/today' },
          { label: 'Weekly Schedule', href: '/radio/schedule' },
          { label: 'Featured Shows', href: '/radio/shows/featured', badge: 'editor-pick' },
          { label: 'Morning Shows', href: '/radio/shows/mornings' },
        ],
      },
    ],
  },
  {
    id: 'news',
    label: 'News',
    href: '/news',
    featured: {
      eyebrow: 'Top Story',
      title: 'The Blueprint',
      description: 'The latest moves shifting the culture in music and media.',
      href: '/news/trending',
      accent: 'news',
    },
    columns: [
      {
        label: 'Music',
        icon: Music4,
        links: [
          { label: 'New Music', href: '/news/music/new', badge: 'new' },
          { label: 'Artist Interviews', href: '/news/music/artists' },
          { label: 'Industry Updates', href: '/news/music/industry' },
        ],
      },
      {
        label: 'Film & TV',
        icon: Tv,
        links: [
          { label: 'Reviews', href: '/news/film-tv/reviews' },
          { label: 'Interviews', href: '/news/film-tv/interviews' },
          { label: 'Streaming Guide', href: '/news/film-tv/streaming' },
        ],
      },
      {
        label: 'Culture & Sports',
        icon: Newspaper,
        links: [
          { label: 'Culture & Politics', href: '/news/culture' },
          { label: 'Sports Highlights', href: '/news/sports/viral', badge: 'trending' },
          { label: 'Athlete Culture', href: '/news/sports/culture' },
        ],
      },
    ],
  },
  {
    id: 'watch',
    label: 'Watch',
    href: '/tv',
    columns: [
      {
        label: 'Video Hub',
        icon: Tv,
        links: [
          { label: 'Live TV', href: '/tv/live', badge: 'live' },
          { label: 'All Series', href: '/tv/series' },
          { label: 'Documentaries', href: '/tv/documentaries' },
          { label: 'Interviews', href: '/tv/interviews' },
        ],
      },
    ],
  },
  {
    id: 'shop',
    label: 'Shop',
    href: '/shop',
    columns: [
      {
        label: 'Collections',
        icon: ShoppingBag,
        links: [
          { label: 'Shop All', href: '/shop/all' },
          { label: 'Limited Drops', href: '/shop/drops', badge: 'new' },
          { label: 'Apparel', href: '/shop/apparel' },
        ],
      },
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    href: '/connect',
    columns: [
      {
        label: 'Network',
        icon: Users,
        links: [
          { label: 'Submit Music', href: '/submit' },
          { label: 'Partnerships', href: '/partnerships' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
    ],
  },
]