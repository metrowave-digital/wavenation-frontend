import Link from 'next/link'
import styles from './DiscoverPage.module.css'

export const metadata = {
  title: 'Discover | WaveNation',
  description:
    'Discover trending music, playlists, creators, podcasts, videos, genres, moods, and editorial picks across WaveNation.',
}

export const revalidate = 60

type QuickLink = {
  title: string
  href: string
  description: string
}

type FeatureCard = {
  eyebrow: string
  title: string
  href: string
  description: string
  meta?: string
}

type GenreItem = {
  name: string
  href: string
}

type MoodItem = {
  name: string
  href: string
}

const quickLinks: QuickLink[] = [
  {
    title: 'Trending',
    href: '/discover/trending',
    description: 'What listeners are playing, watching, and sharing right now.',
  },
  {
    title: 'New Releases',
    href: '/discover/new',
    description: 'Fresh drops across music, playlists, podcasts, and video.',
  },
  {
    title: 'Playlists',
    href: '/discover/playlists',
    description: 'Editorial, creator, seasonal, and sponsored playlists.',
  },
  {
    title: 'Creators',
    href: '/discover/creators',
    description: 'Artists, DJs, podcasters, and featured voices shaping the vibe.',
  },
  {
    title: 'Podcasts',
    href: '/discover/podcasts',
    description: 'Culture, music, interviews, faith, and commentary.',
  },
  {
    title: 'Videos',
    href: '/discover/videos',
    description: 'Music videos, interviews, live sessions, docs, and originals.',
  },
]

const spotlightCards: FeatureCard[] = [
  {
    eyebrow: 'Featured Playlist',
    title: 'Midnight Silk',
    href: '/discover/playlists/midnight-silk',
    description:
      'Smooth late-night R&B, slow-burn soul, and mood-setting records for after dark.',
    meta: 'R&B • Late Night • Updated Weekly',
  },
  {
    eyebrow: 'Chart Watch',
    title: 'The Hitlist 20',
    href: '/discover/charts/hitlist',
    description:
      'WaveNation’s flagship chart tracking the records driving culture right now.',
    meta: 'Charts • Weekly',
  },
  {
    eyebrow: 'Creator Spotlight',
    title: 'Fresh Voices, Real Stories',
    href: '/discover/creators/featured',
    description:
      'Explore standout creators, rising talent, and community-rooted storytellers.',
    meta: 'Creators • Featured',
  },
]

const trendingCards: FeatureCard[] = [
  {
    eyebrow: 'Trending Music',
    title: 'Tracks Moving Fast This Week',
    href: '/discover/trending/music',
    description:
      'The records catching heat across radio, playlists, and community conversation.',
  },
  {
    eyebrow: 'Trending Playlists',
    title: 'Most-Played Curations',
    href: '/discover/trending/playlists',
    description:
      'Top playlist destinations for R&B, Southern Soul, Gospel, Hip-Hop, and vibe-based listening.',
  },
  {
    eyebrow: 'Trending Videos',
    title: 'What Viewers Are Watching',
    href: '/discover/trending/videos',
    description:
      'Performance clips, interviews, music visuals, and WaveNation video favorites.',
  },
]

const genreItems: GenreItem[] = [
  { name: 'R&B', href: '/discover/genres/rnb' },
  { name: 'Hip-Hop', href: '/discover/genres/hip-hop' },
  { name: 'Southern Soul', href: '/discover/genres/southern-soul' },
  { name: 'Gospel', href: '/discover/genres/gospel' },
  { name: 'Neo-Soul', href: '/discover/genres/neo-soul' },
  { name: 'Afrobeats', href: '/discover/genres/afrobeats' },
  { name: 'Urban AC', href: '/discover/genres/urban-ac' },
]

const moodItems: MoodItem[] = [
  { name: 'Chill', href: '/discover/moods/chill' },
  { name: 'Workout', href: '/discover/moods/workout' },
  { name: 'Late Night', href: '/discover/moods/late-night' },
  { name: 'Grown Folk', href: '/discover/moods/grown-folk' },
  { name: 'Romance', href: '/discover/moods/romance' },
  { name: 'Party', href: '/discover/moods/party' },
  { name: 'Sunday Vibes', href: '/discover/moods/sunday-vibes' },
]

const podcastCards: FeatureCard[] = [
  {
    eyebrow: 'Podcast Pick',
    title: 'Culture Conversations',
    href: '/discover/podcasts/culture',
    description:
      'Sharp, thoughtful, and culturally fluent shows covering music, identity, trends, and community.',
  },
  {
    eyebrow: 'Interviews',
    title: 'Artist & Creator Talks',
    href: '/discover/podcasts/interviews',
    description:
      'Long-form conversations with artists, producers, podcasters, and emerging voices.',
  },
]

const videoCards: FeatureCard[] = [
  {
    eyebrow: 'Video Pick',
    title: 'Live Sessions',
    href: '/discover/videos/live-sessions',
    description:
      'Performance-driven content, stripped moments, and intimate sessions from WaveNation talent.',
  },
  {
    eyebrow: 'Originals',
    title: 'Docs, Interviews & Features',
    href: '/discover/videos/documentaries',
    description:
      'Music storytelling, culture-forward visuals, and creator-led video experiences.',
  },
]

const editorialCards: FeatureCard[] = [
  {
    eyebrow: 'Editorial',
    title: 'Editor’s Picks',
    href: '/discover/editorial',
    description:
      'Thoughtful reads and standout stories across music, culture, interviews, and commentary.',
  },
  {
    eyebrow: 'Music Editorial',
    title: 'Features, Reviews & Deep Dives',
    href: '/discover/editorial/music',
    description:
      'Where curation meets analysis, with strong point of view and cultural context.',
  },
]

export default function DiscoverPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>WaveNation Discover</p>
          <h1 className={styles.title}>Find your next vibe.</h1>
          <p className={styles.lede}>
            Explore the best of WaveNation across music, playlists, creators,
            podcasts, video, charts, genres, moods, and editorial culture.
          </p>

          <div className={styles.heroActions}>
            <Link href="/discover/trending" className={styles.primaryCta}>
              Explore Trending
            </Link>
            <Link href="/discover/playlists" className={styles.secondaryCta}>
              Browse Playlists
            </Link>
          </div>

          <div className={styles.quickGrid}>
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.quickCard}>
                <span className={styles.quickTitle}>{item.title}</span>
                <span className={styles.quickDescription}>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Featured</p>
            <h2 className={styles.sectionTitle}>Start here</h2>
          </div>
          <Link href="/discover/trending" className={styles.sectionLink}>
            View all
          </Link>
        </div>

        <div className={styles.featureGrid}>
          {spotlightCards.map((card) => (
            <Link key={card.href} href={card.href} className={styles.featureCard}>
              <span className={styles.cardEyebrow}>{card.eyebrow}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
              {card.meta ? <span className={styles.cardMeta}>{card.meta}</span> : null}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Hot right now</p>
            <h2 className={styles.sectionTitle}>Trending now</h2>
          </div>
          <Link href="/discover/trending" className={styles.sectionLink}>
            See trending
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {trendingCards.map((card) => (
            <Link key={card.href} href={card.href} className={styles.panelCard}>
              <span className={styles.cardEyebrow}>{card.eyebrow}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.splitPanel}>
          <div className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionEyebrow}>Browse by sound</p>
              <h2 className={styles.sectionTitle}>Genres</h2>
            </div>
            <Link href="/discover/genres" className={styles.sectionLink}>
              All genres
            </Link>
          </div>

          <div className={styles.tagGrid}>
            {genreItems.map((genre) => (
              <Link key={genre.href} href={genre.href} className={styles.tagPill}>
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.splitPanel}>
          <div className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionEyebrow}>Browse by feeling</p>
              <h2 className={styles.sectionTitle}>Moods & vibes</h2>
            </div>
            <Link href="/discover/moods" className={styles.sectionLink}>
              All moods
            </Link>
          </div>

          <div className={styles.tagGrid}>
            {moodItems.map((mood) => (
              <Link key={mood.href} href={mood.href} className={styles.tagPillAlt}>
                {mood.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Playlist culture</p>
            <h2 className={styles.sectionTitle}>Playlists that move with the moment</h2>
          </div>
          <Link href="/discover/playlists" className={styles.sectionLink}>
            Browse playlists
          </Link>
        </div>

        <div className={styles.highlightBand}>
          <div className={styles.highlightContent}>
            <p className={styles.highlightEyebrow}>Editorial & creator curation</p>
            <h3 className={styles.highlightTitle}>From The Hitlist 20 to Midnight Silk</h3>
            <p className={styles.highlightDescription}>
              Discover flagship editorial playlists, creator-curated collections,
              seasonal drops, and fresh additions built for every mood and format.
            </p>
            <div className={styles.inlineActions}>
              <Link href="/discover/playlists/editorial" className={styles.inlinePrimary}>
                Editorial Playlists
              </Link>
              <Link href="/discover/playlists/creator" className={styles.inlineSecondary}>
                Creator Playlists
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.multiColumnSection}>
        <div className={styles.column}>
          <div className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionEyebrow}>Voices</p>
              <h2 className={styles.sectionTitle}>Podcasts</h2>
            </div>
            <Link href="/discover/podcasts" className={styles.sectionLink}>
              Explore podcasts
            </Link>
          </div>

          <div className={styles.stack}>
            {podcastCards.map((card) => (
              <Link key={card.href} href={card.href} className={styles.stackCard}>
                <span className={styles.cardEyebrow}>{card.eyebrow}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionEyebrow}>Visual culture</p>
              <h2 className={styles.sectionTitle}>Videos</h2>
            </div>
            <Link href="/discover/videos" className={styles.sectionLink}>
              Watch videos
            </Link>
          </div>

          <div className={styles.stack}>
            {videoCards.map((card) => (
              <Link key={card.href} href={card.href} className={styles.stackCard}>
                <span className={styles.cardEyebrow}>{card.eyebrow}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionEyebrow}>Read deeper</p>
              <h2 className={styles.sectionTitle}>Editorial picks</h2>
            </div>
            <Link href="/discover/editorial" className={styles.sectionLink}>
              Read more
            </Link>
          </div>

          <div className={styles.stack}>
            {editorialCards.map((card) => (
              <Link key={card.href} href={card.href} className={styles.stackCard}>
                <span className={styles.cardEyebrow}>{card.eyebrow}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bottomSection}>
        <div className={styles.bottomPanel}>
          <div className={styles.bottomCopy}>
            <p className={styles.sectionEyebrow}>Discover more</p>
            <h2 className={styles.sectionTitle}>Charts, creators, and what’s next</h2>
            <p className={styles.bottomDescription}>
              Move from discovery to deeper engagement across WaveNation’s charts,
              creator ecosystem, and latest releases.
            </p>
          </div>

          <div className={styles.bottomActions}>
            <Link href="/discover/charts" className={styles.primaryCta}>
              Explore Charts
            </Link>
            <Link href="/discover/creators" className={styles.secondaryCta}>
              Meet Creators
            </Link>
            <Link href="/discover/new" className={styles.tertiaryCta}>
              See New Releases
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}