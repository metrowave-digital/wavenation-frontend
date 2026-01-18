import type { MegaMenuItem } from '../MegaMenu/MegaMenu.types'
import {
  Compass,
  Radio,
  Newspaper,
  Tv,
  ShoppingBag,
  Users,
} from 'lucide-react'

export const MAIN_NAV: MegaMenuItem[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: Compass,
    description:
      'Explore music, culture, creators, playlists, and what’s moving the culture forward.',
    children: [
      {
        label: 'Playlists',
        href: '/music/playlists',
        description: 'Curated playlists across genres and moods.',
      },

      {
        label: 'Charts',
        href: '/charts',
        description:
          'Weekly rankings tracking what’s rising, debuting, and moving the culture.',
        children: [
          {
            label: 'Overview',
            href: '/charts',
            description: 'This week’s chart highlights.',
          },
          {
            label: 'Hitlist',
            href: '/charts/hitlist',
            description: 'WaveNation’s official flagship chart.',
          },
          {
            label: 'R&B / Soul',
            href: '/charts/rnb-soul',
            description: 'Modern and classic R&B movements.',
          },
          {
            label: 'Southern Soul',
            href: '/charts/southern-soul',
            description: 'Southern-rooted soul and blues.',
          },
          {
            label: 'Gospel',
            href: '/charts/gospel',
            description: 'Faith-driven and inspirational records.',
          },
          {
            label: 'Hip-Hop',
            href: '/charts/hip-hop',
            description: 'The pulse of hip-hop culture.',
          },
          {
            label: 'Archive',
            href: '/charts/archive',
            description: 'Past charts and historical rankings.',
          },
        ],
      },

      {
        label: 'Creators',
        href: '/creators',
        description: 'Artists, hosts, and cultural voices.',
      },
      {
        label: 'Trending',
        href: '/discover/trending',
        description: 'What’s gaining momentum right now.',
      },
      {
        label: 'Events',
        href: '/events',
        description: 'Live events, releases, and community moments.',
      },
    ],
  },

  {
    id: 'onair',
    label: 'On-Air',
    icon: Radio,
    description:
      'Live radio, scheduled shows, hosts, and what’s playing now.',
    children: [
      {
        label: 'Live Stream',
        href: '/radio',
        description: 'Listen live to WaveNation Radio.',
      },
      {
        label: 'Show Schedule',
        href: '/radio/schedule',
        description: 'Daily and weekly programming.',
      },
      {
        label: 'Hosts',
        href: '/radio/hosts',
        description: 'Meet our on-air personalities.',
      },
    ],
  },

  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    description:
      'Culture-driven journalism covering music, community, and the Black experience.',
    children: [
      {
        label: 'Music News',
        href: '/news/music',
        description: 'Industry and artist updates.',
      },
      {
        label: 'Culture',
        href: '/news/culture',
        description: 'Stories shaping the culture.',
      },
      {
        label: 'Opinions',
        href: '/news/opinion',
        description: 'Voices, commentary, and perspectives.',
      },
    ],
  },

  {
    id: 'watch',
    label: 'Watch',
    icon: Tv,
    description:
      'Original series, interviews, documentaries, and live TV.',
    children: [
      {
        label: 'Live TV',
        href: '/tv/live',
        description: 'Watch WaveNation live.',
      },
      {
        label: 'Series',
        href: '/tv/series',
        description: 'Original episodic content.',
      },
      {
        label: 'Creator Spotlights',
        href: '/tv/creators',
        description: 'Featured creators and interviews.',
      },
    ],
  },

  {
    id: 'merch',
    label: 'Merch',
    icon: ShoppingBag,
    description:
      'WaveNation apparel, show merch, and limited edition drops.',
    children: [
      {
        label: 'Shop All',
        href: '/shop',
        description: 'Browse all merchandise.',
      },
      {
        label: 'Limited Drops',
        href: '/shop/drops',
        description: 'Exclusive and limited releases.',
      },
    ],
  },

  {
    id: 'connect',
    label: 'Connect',
    icon: Users,
    description:
      'Community, creators, submissions, and partnerships.',
    children: [
      {
        label: 'Creator Hub',
        href: '/creators/join',
        description: 'Join WaveNation as a creator.',
      },
      {
        label: 'Submit Music',
        href: '/submit',
        description: 'Send us your music.',
      },
      {
        label: 'Contact',
        href: '/contact',
        description: 'Get in touch with the team.',
      },
    ],
  },
]
