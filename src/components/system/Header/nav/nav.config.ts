import type { MainNavItem } from './nav.types'
import {
  Compass,
  Radio,
  Newspaper,
  Tv,
  ShoppingBag,
  Users,
  Music4,
  TrendingUp,
  Sparkles,
  Mic2,
} from 'lucide-react'

export const MAIN_NAV: MainNavItem[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: Compass,
    badge: 'trending',
    description:
      'Explore music, culture, creators, playlists, charts, and what is moving the culture.',
    children: [
      {
        label: 'Discover Home',
        href: '/discover',
        description: 'The main hub for discovery across WaveNation.',
        icon: Compass,
        featured: {
          eyebrow: 'Start here',
          title: 'Discover WaveNation',
          description:
            'Jump into playlists, charts, creators, and culture-shaping moments.',
          accent: 'blue',
        },
      },
      {
        label: 'Playlists',
        href: '/music/playlists',
        icon: Music4,
        badge: 'new',
        description: 'Curated playlists across moods, genres, and moments.',
        featured: {
          eyebrow: 'Featured',
          title: 'Editorial playlists',
          description:
            'Explore flagship playlist brands, mood-based listening, and genre-driven curation.',
          accent: 'magenta',
        },
        children: [
          {
            label: 'Editorial Playlists',
            href: '/music/playlists/editorial',
            description: 'Flagship WaveNation playlist brands.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'All Editorial Playlists',
                href: '/music/playlists/editorial',
                description: 'Browse all flagship editorial playlists.',
              },
              {
                label: 'Hitlist 20',
                href: '/music/playlists/editorial/hitlist-20',
                badge: 'editor-pick',
                description: 'WaveNation’s flagship ranking and playlist brand.',
              },
              {
                label: 'Midnight Silk',
                href: '/music/playlists/editorial/midnight-silk',
                description: 'Late-night R&B and soul selections.',
              },
              {
                label: 'Southern Soul Saturdays',
                href: '/music/playlists/editorial/southern-soul-saturdays',
                description: 'A signature Southern Soul destination.',
              },
            ],
          },
          {
            label: 'Mood & Vibes',
            href: '/music/playlists/moods',
            description: 'Playlists built around mood, energy, and feel.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Late Night',
                href: '/music/playlists/moods/late-night',
                description: 'Smooth and after-dark listening.',
              },
              {
                label: 'Workout',
                href: '/music/playlists/moods/workout',
                description: 'High-energy playlists for movement.',
              },
              {
                label: 'Chill',
                href: '/music/playlists/moods/chill',
                description: 'Relaxed and laid-back vibes.',
              },
              {
                label: 'Sunday Slow Burn',
                href: '/music/playlists/moods/sunday-slow-burn',
                description: 'Easy listening with soulful pacing.',
              },
            ],
          },
          {
            label: 'Genre Playlists',
            href: '/music/playlists/genres',
            description: 'Genre-based playlist hubs.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'R&B',
                href: '/music/playlists/genres/rnb',
                description: 'Soulful essentials and modern R&B.',
              },
              {
                label: 'Hip-Hop',
                href: '/music/playlists/genres/hip-hop',
                description: 'Culture-shaping hip-hop selections.',
              },
              {
                label: 'Southern Soul',
                href: '/music/playlists/genres/southern-soul',
                description: 'Southern-rooted sounds and deep grooves.',
              },
              {
                label: 'Gospel',
                href: '/music/playlists/genres/gospel',
                description: 'Inspirational and faith-centered music.',
              },
            ],
          },
        ],
      },
      {
        label: 'Charts',
        href: '/charts',
        icon: TrendingUp,
        badge: 'trending',
        description: 'Weekly rankings tracking what is rising and resonating.',
        featured: {
          eyebrow: 'Charts',
          title: 'What’s moving now',
          description:
            'Weekly rankings, genre charts, trending records, and archive history.',
          accent: 'blue',
        },
        children: [
          {
            label: 'Chart Hubs',
            href: '/charts',
            description: 'Explore major chart destinations.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Charts Home',
                href: '/charts',
                description: 'This week’s chart highlights and featured rankings.',
              },
              {
                label: 'Trending',
                href: '/charts/trending',
                badge: 'trending',
                description: 'Fast risers, breakouts, and new entries.',
              },
              {
                label: 'Archive',
                href: '/charts/archive',
                description: 'Past charts and historical rankings.',
              },
              {
                label: 'Methodology',
                href: '/charts/methodology',
                description: 'How WaveNation rankings are calculated.',
              },
            ],
          },
          {
            label: 'Flagship Charts',
            href: '/charts/flagship',
            description: 'WaveNation’s signature ranking products.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Hitlist 20',
                href: '/charts/hitlist-20/current',
                badge: 'editor-pick',
                description: 'WaveNation’s flagship chart.',
              },
            ],
          },
          {
            label: 'Genre Charts',
            href: '/charts/genres',
            description: 'Genre-specific rankings.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'R&B / Soul',
                href: '/charts/genres/rnb/current',
                description: 'Modern and classic R&B movements.',
              },
              {
                label: 'Southern Soul',
                href: '/charts/genres/southern-soul/current',
                description: 'Southern-rooted soul and blues.',
              },
              {
                label: 'Gospel',
                href: '/charts/genres/gospel/current',
                description: 'Faith-driven and inspirational records.',
              },
              {
                label: 'Hip-Hop',
                href: '/charts/genres/hip-hop/current',
                description: 'The pulse of hip-hop culture.',
              },
              {
                label: 'House',
                href: '/charts/genres/house/current',
                description: 'Club-ready dancefloor momentum.',
              },
            ],
          },
        ],
      },
      {
        label: 'Creators',
        href: '/creators',
        icon: Sparkles,
        description: 'Artists, hosts, and cultural voices.',
        children: [
          {
            label: 'Creator Hub',
            href: '/creators',
            icon: Sparkles,
            description: 'Meet WaveNation creators and contributors.',
            subnavMode: 'hidden',
            featured: {
              eyebrow: 'Creator Hub',
              title: 'Meet the voices',
              description:
                'Browse artists, hosts, storytellers, and contributors across the ecosystem.',
              accent: 'neutral',
            },
            children: [
              {
                label: 'All Creators',
                href: '/creators',
                description: 'Browse all creators and contributors.',
              },
              {
                label: 'Featured Creators',
                href: '/creators/featured',
                description: 'Highlighted artists, hosts, and personalities.',
              },
              {
                label: 'Creator Spotlights',
                href: '/creators/spotlights',
                description: 'Profiles and editorial spotlight coverage.',
              },
              {
                label: 'Join as a Creator',
                href: '/creators/join',
                badge: 'new',
                description: 'Apply to become part of the network.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'onair',
    label: 'On-Air',
    icon: Radio,
    badge: 'live',
    description: 'Live radio, scheduled shows, hosts, and what’s playing now.',
    children: [
      {
        label: 'On-Air Home',
        href: '/radio',
        icon: Radio,
        description: 'Listen live and explore WaveNation Radio.',
      },
      {
        label: 'Listen',
        href: '/radio/live',
        icon: Radio,
        badge: 'live',
        description: 'Live stream and real-time radio experience.',
        featured: {
          eyebrow: 'Live now',
          title: 'WaveNation FM',
          description:
            'Jump into the live stream, current shows, and real-time listening.',
          accent: 'blue',
        },
        children: [
          {
            label: 'Live Experience',
            href: '/radio/live',
            description: 'Access the current live stream and metadata.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Listen Live',
                href: '/radio/live',
                badge: 'live',
                description: 'Listen to WaveNation live.',
              },
              {
                label: 'Now Playing',
                href: '/radio/now-playing',
                badge: 'trending',
                description: 'See what is currently in rotation.',
              },
            ],
          },
        ],
      },
      {
        label: 'Schedule',
        href: '/radio/schedule',
        description: 'Daily and weekly programming.',
        children: [
          {
            label: 'Schedule Views',
            href: '/radio/schedule',
            description: 'Browse daily and weekly schedule views.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Today',
                href: '/radio/schedule/today',
                description: 'Today’s on-air lineup.',
              },
              {
                label: 'This Week',
                href: '/radio/schedule',
                description: 'Weekly programming schedule.',
              },
              {
                label: 'Special Programming',
                href: '/radio/specials',
                description: 'Special broadcasts and featured blocks.',
              },
            ],
          },
        ],
      },
      {
        label: 'Shows',
        href: '/radio/shows',
        description: 'Explore all WaveNation radio shows.',
        children: [
          {
            label: 'Show Categories',
            href: '/radio/shows',
            description: 'Featured and signature programming.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'All Shows',
                href: '/radio/shows',
                description: 'Browse the full show directory.',
              },
              {
                label: 'Featured Shows',
                href: '/radio/shows/featured',
                badge: 'editor-pick',
                description: 'Highlighted signature programs.',
              },
              {
                label: 'Morning Shows',
                href: '/radio/shows/mornings',
                description: 'Start the day with flagship programming.',
              },
              {
                label: 'Specialty Shows',
                href: '/radio/shows/specialty',
                description: 'Genre-led and themed programming blocks.',
              },
            ],
          },
        ],
      },
      {
        label: 'Hosts',
        href: '/radio/hosts',
        description: 'Meet the on-air personalities.',
      },
    ],
  },

  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    badge: 'trending',
    description:
      'Culture-led journalism across music, entertainment, business, sports, and community.',
    children: [
      {
        label: 'News Home',
        href: '/news',
        icon: Newspaper,
        description: 'The main newsroom hub.',
      },
      {
        label: 'Music',
        href: '/news/music',
        icon: Music4,
        badge: 'trending',
        description:
          'Music reporting, releases, interviews, charts, and industry coverage.',
        accent: 'news',
        children: [
          {
            label: 'Artist Interviews',
            href: '/news/music/artists',
            description: 'Interviews, artist conversations, and profiles.',
            featured: true,
            subnavMode: 'hidden',
            children: [
              {
                label: 'New Music',
                href: '/news/music/new-music',
                badge: 'new',
                description: 'Fresh singles, albums, EPs, and release coverage.',
              },
              {
                label: 'Artists',
                href: '/news/music/artists',
                description: 'Artist interviews, profiles, and conversations.',
              },
              {
                label: 'Tours',
                href: '/news/music/tours',
                description: 'Tour announcements, live shows, and concert coverage.',
              },
              {
                label: 'Awards',
                href: '/news/music/awards',
                description: 'Award nominations, wins, and ceremony coverage.',
              },
              {
                label: 'WaveNation Originals',
                href: '/news/music/wavenation-originals',
                badge: 'editor-pick',
                description: 'Original music interviews, features, and exclusives.',
              },
            ],
          },
          {
            label: 'Charts & Rankings',
            href: '/news/music/charts',
            description:
              'Chart movement, rankings, genre performance, and legacy context.',
            featured: true,
            subnavMode: 'hidden',
            children: [
              {
                label: 'Charts',
                href: '/news/music/charts',
                badge: 'trending',
                description: 'Chart coverage, rankings, and breakout artists.',
              },
              {
                label: 'Genres',
                href: '/news/music/genres',
                description: 'Genre-specific reporting and movements.',
              },
              {
                label: 'Legacy',
                href: '/news/music/legacy',
                description: 'Legacy artists, catalog impact, and retrospectives.',
              },
            ],
          },
          {
            label: 'Industry News',
            href: '/news/music/industry',
            description: 'Labels, deals, producers, and business shifts.',
            featured: true,
            subnavMode: 'hidden',
            children: [
              {
                label: 'Industry',
                href: '/news/music/industry',
                description: 'Label news, executive changes, and business developments.',
              },
              {
                label: 'Producers',
                href: '/news/music/producers',
                description: 'Producer spotlights and production culture.',
              },
            ],
          },
        ],
      },
      {
        label: 'Film & TV',
        href: '/news/film-tv',
        icon: Tv,
        badge: 'editor-pick',
        description: 'Film, television, streaming, and entertainment coverage.',
        children: [
          {
            label: 'Coverage Areas',
            href: '/news/film-tv',
            description: 'Explore film and TV reporting by topic.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Film News',
                href: '/news/film-tv/film',
                description: 'Movie releases, premieres, and industry updates.',
              },
              {
                label: 'TV News',
                href: '/news/film-tv/tv',
                description: 'Series, renewals, cancellations, and buzz.',
              },
              {
                label: 'Reviews',
                href: '/news/film-tv/reviews',
                description: 'Reviews and cultural takes.',
              },
              {
                label: 'Interviews',
                href: '/news/film-tv/interviews',
                icon: Mic2,
                description: 'Conversations with talent and creators.',
              },
              {
                label: 'Streaming',
                href: '/news/film-tv/streaming',
                description: 'What is landing across major platforms.',
              },
            ],
          },
        ],
      },
      {
        label: 'Culture & Politics',
        href: '/news/culture-politics',
        description: 'Cultural commentary, policy, and community conversations.',
        children: [
          {
            label: 'Coverage Areas',
            href: '/news/culture-politics',
            description: 'Explore culture and politics coverage.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Culture',
                href: '/news/culture-politics/culture',
                description: 'Identity, conversation, and community stories.',
              },
              {
                label: 'Politics',
                href: '/news/culture-politics/politics',
                description: 'Policy, civic issues, and public life.',
              },
              {
                label: 'Opinion & Analysis',
                href: '/news/culture-politics/analysis',
                description: 'Context, commentary, and deeper takes.',
              },
              {
                label: 'Social Justice',
                href: '/news/culture-politics/social-justice',
                description: 'Equity, advocacy, and movement coverage.',
              },
            ],
          },
        ],
      },
      {
        label: 'Business & Technology',
        href: '/news/business-technology',
        description: 'Business, media, creator economy, and technology.',
        children: [
          {
            label: 'Coverage Areas',
            href: '/news/business-technology',
            description: 'Explore business and technology reporting.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Media Business',
                href: '/news/business-technology/media-business',
                description: 'Deals, strategy, and media shifts.',
              },
              {
                label: 'Creator Economy',
                href: '/news/business-technology/creator-economy',
                description: 'Monetization, platforms, and creator growth.',
              },
              {
                label: 'Technology',
                href: '/news/business-technology/technology',
                description: 'Digital tools, platforms, innovation, and product shifts.',
              },
              {
                label: 'Streaming Business',
                href: '/news/business-technology/streaming',
                description: 'Platform moves and streaming economics.',
              },
            ],
          },
        ],
      },
      {
        label: 'Sports',
        href: '/news/sports',
        description: 'Sports culture, headlines, athlete stories, and moments.',
        children: [
          {
            label: 'Coverage Areas',
            href: '/news/sports',
            description: 'Explore sports coverage by topic.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Sports News',
                href: '/news/sports/news',
                description: 'Top sports headlines and updates.',
              },
              {
                label: 'Athlete Culture',
                href: '/news/sports/culture',
                description: 'Athletes, style, impact, and cultural influence.',
              },
              {
                label: 'Interviews',
                href: '/news/sports/interviews',
                description: 'Conversations with athletes and voices in sports.',
              },
              {
                label: 'Highlights & Viral',
                href: '/news/sports/viral',
                badge: 'trending',
                description: 'Big moments, internet reactions, and buzz.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'watch',
    label: 'Watch',
    icon: Tv,
    description: 'Original series, interviews, documentaries, and live TV.',
    children: [
      {
        label: 'Watch Home',
        href: '/tv',
        icon: Tv,
        description: 'Explore live TV, originals, and featured video.',
      },
      {
        label: 'Live TV',
        href: '/tv/live',
        icon: Tv,
        badge: 'live',
        description: 'Watch WaveNation live.',
        featured: {
          eyebrow: 'Now streaming',
          title: 'WaveNation One',
          description: 'Live television, cultural programming, and originals.',
          accent: 'magenta',
        },
      },
      {
        label: 'Series',
        href: '/tv/series',
        icon: Sparkles,
        badge: 'new',
        description: 'Original episodic and documentary programming.',
        children: [
          {
            label: 'Series Library',
            href: '/tv/series',
            description: 'Browse episodic and documentary programming.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'All Series',
                href: '/tv/series',
                description: 'Browse all original and recurring series.',
              },
              {
                label: 'Featured Series',
                href: '/tv/series/featured',
                badge: 'editor-pick',
                description: 'Highlighted programs and signature shows.',
              },
              {
                label: 'Documentaries',
                href: '/tv/documentaries',
                description: 'Long-form documentary storytelling.',
              },
            ],
          },
        ],
      },
      {
        label: 'Interviews',
        href: '/tv/interviews',
        icon: Mic2,
        description: 'Conversations with talent and culture-makers.',
      },
      {
        label: 'Creator Spotlights',
        href: '/tv/creators',
        icon: Sparkles,
        description: 'Featured creators and visual storytelling.',
      },
    ],
  },

  {
    id: 'shop',
    label: 'Shop',
    icon: ShoppingBag,
    description: 'WaveNation apparel, drops, and collections.',
    children: [
      {
        label: 'Shop Home',
        href: '/shop',
        icon: ShoppingBag,
        description: 'Browse all merchandise and featured collections.',
      },
      {
        label: 'Collections',
        href: '/shop/collections',
        description: 'Explore store sections and collections.',
        children: [
          {
            label: 'Browse Store',
            href: '/shop/all',
            description: 'Browse all shop destinations.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Shop All',
                href: '/shop/all',
                description: 'Browse all merchandise.',
              },
              {
                label: 'Limited Drops',
                href: '/shop/drops',
                badge: 'new',
                description: 'Exclusive and time-sensitive releases.',
              },
              {
                label: 'Collections',
                href: '/shop/collections',
                description: 'Curated merch collections and themed drops.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'connect',
    label: 'Connect',
    icon: Users,
    description: 'Community, submissions, creators, and partnerships.',
    children: [
      {
        label: 'Connect Home',
        href: '/connect',
        icon: Users,
        description: 'Discover ways to join, submit, partner, and connect.',
      },
      {
        label: 'Get Involved',
        href: '/connect',
        badge: 'new',
        description: 'Ways to contribute, partner, and reach the team.',
        featured: {
          eyebrow: 'Get involved',
          title: 'Join the network',
          description:
            'Submit music, become a creator, explore partnerships, and connect with the team.',
          accent: 'neutral',
        },
        children: [
          {
            label: 'Opportunities',
            href: '/connect',
            description: 'Submission and partnership pathways.',
            subnavMode: 'hidden',
            children: [
              {
                label: 'Creator Hub',
                href: '/creators/join',
                badge: 'new',
                description: 'Join WaveNation as a creator.',
              },
              {
                label: 'Submit Music',
                href: '/submit',
                description: 'Send your music to WaveNation.',
              },
              {
                label: 'Partnerships',
                href: '/partnerships',
                description: 'Brand, media, and strategic partnerships.',
              },
              {
                label: 'Contact',
                href: '/contact',
                description: 'Get in touch with the team.',
              },
            ],
          },
        ],
      },
    ],
  },
]