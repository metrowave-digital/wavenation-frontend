import type { Metadata } from 'next'
import Script from 'next/script'
import styles from './page.module.css'

// Base UI & Features
import HomeHero from './(home)/components/HomepageHero/HomeHero/HomeHero.server'
import QuickAccess from './(home)/components/QuickAccess/QuickAccess'
import ArtistSpotlightRow from './(home)/components/ArtistSpotlightRow/ArtistSpotlightRow'
import FeaturedEditorialCategories from './(home)/components/FeaturedEditorialCategories/FeaturedEditorialCategories'
import FeaturedEditorial from './(home)/components/FeaturedEditorialSlider/FeaturedEditorialSlider'
import EventHomeFeature from './(home)/components/EventHomeFeature/EventHomeFeature'

// Newly Designed Modular Components
import HomePlaylists from './(home)/components/HomePlaylists/HomePlaylists'
import HomeCharts from './(home)/components/HomeCharts/HomeCharts'
import HomeShows from './(home)/components/HomeShows/HomeShows'
import HomeTalent from './(home)/components/HomeTalent/HomeTalent'
import HomeCreators from './(home)/components/HomeCreators/HomeCreators'

/* ======================================================
   SEO METADATA
====================================================== */
export const metadata: Metadata = {
  title: 'WaveNation - Amplifying Urban Culture with 24/7 Radio, Playlists, and News',
  description: 'WaveNation is a digital media network streaming 24/7 urban radio, culture news, playlists, podcasts, and video content across web, mobile, and TV.',
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

          {/* DYNAMIC AUDIO & DATA BLOCKS */}
          <HomePlaylists />
          
          <HomeCharts />

          {/* DYNAMIC STATION & ROSTER BLOCKS */}
          <HomeShows />

          <HomeTalent />

          {/* CREATOR PLATFORM CTA */}
          <HomeCreators />

        </main>
      </div>
    </>
  )
}