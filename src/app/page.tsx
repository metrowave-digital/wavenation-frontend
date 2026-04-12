import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import styles from './page.module.css'

import HomeHero from './(home)/components/HomepageHero/HomeHero/HomeHero.server'
import QuickAccess from './(home)/components/QuickAccess/QuickAccess'
import ArtistSpotlightRow from './(home)/components/ArtistSpotlightRow/ArtistSpotlightRow'
import FeaturedEditorialCategories from './(home)/components/FeaturedEditorialCategories/FeaturedEditorialCategories'
import FeaturedEditorial from './(home)/components/FeaturedEditorialSlider/FeaturedEditorialSlider'
import EventHomeFeature from './(home)/components/EventHomeFeature/EventHomeFeature'

/* ======================================================
   SEO METADATA
====================================================== */
export const metadata: Metadata = {
  title: 'WaveNation - Amplifying Urban Culture with 24/7 Radio, Playlists, and News',
  description:
    'WaveNation is a digital media network streaming 24/7 urban radio, culture news, playlists, podcasts, and video content across web, mobile, and TV.',
  keywords: [
    'urban radio', 'R&B radio', 'hip hop radio', 'southern soul', 'gospel radio', 
    'urban culture news', 'music playlists', 'digital radio station', 'WaveNation',
  ],
  metadataBase: new URL('https://wavenation.media'),
  openGraph: {
    title: 'WaveNation — Amplify Your Vibe',
    description: 'Listen live to WaveNation FM, discover playlists, watch WaveNation TV, and explore urban culture news.',
    url: 'https://wavenation.media',
    siteName: 'WaveNation',
    images: [{ url: '/images/og/wavenation-og.jpg', width: 1200, height: 630, alt: 'WaveNation — Urban Radio & Culture Platform' }],
    locale: 'en_US',
    type: 'website',
  },
}

/* ======================================================
   STATIC DATA ARRAYS
====================================================== */
const playlists = [
  { title: 'Hitlist 20', description: 'The records driving culture right now across radio, streets, and digital.', href: '/charts/hitlist' },
  { title: 'Midnight Silk', description: 'Late-night R&B, slow burn grooves, and smooth soul energy.', href: '/playlists/midnight-silk' },
  { title: 'Southern Soul Saturdays', description: 'A home for Southern Soul staples, deep cuts, and grown-folks favorites.', href: '/playlists/southern-soul-saturdays' },
  { title: 'Morning Praise Essentials', description: 'Faith-forward inspiration and gospel selections to start the day strong.', href: '/playlists/morning-praise-essentials' },
]

const watchItems = [
  { title: 'WaveNation TV', description: 'Watch interviews, visual stories, performances, and live digital programming.', href: '/watch' },
  { title: 'Culture Clips', description: 'Catch short-form video moments, behind-the-scenes highlights, and featured cuts.', href: '/watch/clips' },
]

const shows = [
  { title: 'The Morning Vibe', description: 'Music, energy, trending culture, and daily conversation starters.', href: '/radio/shows/the-morning-vibe' },
  { title: 'Commute Connect', description: 'Afternoon drive built for conversation, discovery, and momentum.', href: '/radio/shows/commute-connect' },
  { title: 'Nighttime Mix', description: 'After-dark listening with elevated vibes and seamless flow.', href: '/radio/shows/nighttime-mix' },
]

const creatorFeatures = [
  { title: 'Creator Hub', description: 'A growing space for podcasters, artists, filmmakers, DJs, and culture builders.', href: '/creator-hub', label: 'Enter Creator Hub' },
  { title: 'Submit Your Music', description: 'Independent artists can submit music for editorial consideration.', href: '/submit', label: 'Submit Now' },
]

/* ======================================================
   PAGE COMPONENT
====================================================== */
export default function Home() {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YWB08LCGHY" strategy="afterInteractive" />
      <Script id="ga4-home-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YWB08LCGHY', { page_path: '/' });
        `}
      </Script>

      <div className={styles.page}>
        <main className={styles.main}>
          <HomeHero />
          
          <QuickAccess />

          {/* NEW DYNAMIC EVENT SPOTLIGHT */}
          <EventHomeFeature />

          <ArtistSpotlightRow />

          <section className={styles.editorialCategoriesBand} aria-label="Editorial categories">
            <FeaturedEditorialCategories />
          </section>

          <section className={styles.featuredEditorialBlock} aria-label="Featured editorial">
            <FeaturedEditorial />
          </section>

          <div className={styles.editorialSeparator} aria-hidden="true">
            <div className={styles.editorialSeparatorLine} />
            <div className={styles.editorialSeparatorGlow} />
          </div>

          <section className={styles.section} aria-labelledby="playlists-title">
            <div className={styles.sectionHeaderRow}>
              <div>
                <p className={styles.eyebrow}>Playlists</p>
                <h2 id="playlists-title" className={styles.sectionTitle}>
                  Curated for every lane of the culture
                </h2>
              </div>
              <Link href="/playlists" className={styles.sectionLink}>Browse all playlists</Link>
            </div>
            <div className={styles.cardGrid}>
              {playlists.map((item) => (
                <article key={item.title} className={styles.contentCard}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                  <Link href={item.href} className={styles.cardLink}>Open playlist</Link>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="charts-title">
            <div className={styles.chartPanel}>
              <div className={styles.chartContent}>
                <p className={styles.eyebrow}>Charts</p>
                <h2 id="charts-title" className={styles.sectionTitle}>The Hitlist 20</h2>
                <p className={styles.sectionDescription}>
                  WaveNation’s flagship chart tracks the records moving culture right now.
                </p>
                <div className={styles.buttonRow}>
                  <Link href="/charts/hitlist" className={styles.primaryButton}>View the chart</Link>
                  <Link href="/charts" className={styles.secondaryButton}>Explore all charts</Link>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="watch-title">
            <div className={styles.sectionHeaderRow}>
              <div>
                <p className={styles.eyebrow}>Watch</p>
                <h2 id="watch-title" className={styles.sectionTitle}>Visual storytelling</h2>
              </div>
              <Link href="/watch" className={styles.sectionLink}>Go to watch</Link>
            </div>
            <div className={styles.cardGrid}>
              {watchItems.map((item) => (
                <article key={item.title} className={styles.contentCard}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                  <Link href={item.href} className={styles.cardLink}>Start watching</Link>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="shows-title">
            <div className={styles.sectionHeaderRow}>
              <div>
                <p className={styles.eyebrow}>Shows</p>
                <h2 id="shows-title" className={styles.sectionTitle}>Station Personalities</h2>
              </div>
              <Link href="/radio" className={styles.sectionLink}>View all shows</Link>
            </div>
            <div className={styles.cardGrid}>
              {shows.map((item) => (
                <article key={item.title} className={styles.contentCard}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                  <Link href={item.href} className={styles.cardLink}>Learn more</Link>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="creator-title">
            <div className={styles.creatorPanel}>
              <div className={styles.creatorCopy}>
                <p className={styles.eyebrow}>Creators</p>
                <h2 id="creator-title" className={styles.sectionTitle}>Built to elevate</h2>
                <p className={styles.sectionDescription}>
                  A growing ecosystem for artists, podcasters, DJs, and culture-forward voices.
                </p>
              </div>
              <div className={styles.creatorActions}>
                {creatorFeatures.map((item) => (
                  <article key={item.title} className={styles.creatorCard}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDescription}>{item.description}</p>
                    <Link href={item.href} className={styles.cardLink}>{item.label}</Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}