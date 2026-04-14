import type { Metadata } from 'next'
import Script from 'next/script'
import styles from './page.module.css'
import type { NewsArticle } from '@/app/news/news.types'

// UI Components
import HomeHero from './(home)/components/HomepageHero/HomeHero/HomeHero.server'
import QuickAccess from './(home)/components/QuickAccess/QuickAccess'
import ArtistSpotlightRow from './(home)/components/ArtistSpotlightRow/ArtistSpotlightRow'
import FeaturedEditorialCategories from './(home)/components/FeaturedEditorialCategories/FeaturedEditorialCategories'
import FeaturedEditorial from './(home)/components/FeaturedEditorialSlider/FeaturedEditorialSlider'
import EventHomeFeature from './(home)/components/EventHomeFeature/EventHomeFeature'

// Modular Components
import HomePlaylists from './(home)/components/HomePlaylists/HomePlaylists'
import HomeCharts from './(home)/components/HomeCharts/HomeCharts'
import HomeShows from './(home)/components/HomeShows/HomeShows'
import HomeTalent from './(home)/components/HomeTalent/HomeTalent'
import HomeCreators from './(home)/components/HomeCreators/HomeCreators'

/* ======================================================
   LOCAL INTERFACES (Replaces 'any')
====================================================== */

/** * Represents a generic block module from the Payload Homepage Global 
 */
interface HomePageModule {
  id: string
  blockType: string
  blockName?: string | null
  [key: string]: unknown 
}

/** * Specifically defines the Spotlight Articles block structure 
 */
interface SpotlightArticlesBlock extends HomePageModule {
  blockType: 'spotlightArticles'
  articles: (NewsArticle | string | number)[]
}

/** * The root response from the Payload /api/globals/homepage endpoint 
 */
interface HomepageData {
  id: number | string
  modules?: HomePageModule[]
  updatedAt: string
  createdAt: string
}

/* ======================================================
   SEO METADATA
====================================================== */
export const metadata: Metadata = {
  title: 'WaveNation - Amplifying Urban Culture with 24/7 Radio, Playlists, and News',
  description: 'WaveNation is a digital media network streaming 24/7 urban radio, culture news, playlists, and video content.',
  metadataBase: new URL('https://wavenation.media'),
  openGraph: {
    title: 'WaveNation — Amplify Your Vibe',
    description: 'Listen live to WaveNation FM and explore urban culture news.',
    url: 'https://wavenation.media',
    siteName: 'WaveNation',
    images: [{ url: '/images/og/wavenation-og.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
}

/* ======================================================
   SERVER COMPONENT: PAGE
====================================================== */
export default async function Home() {
  // Use environment variable for the backend URL
  const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://wavenation.media'

  // 1. Fetch the Homepage Global via REST API
  // Using 'depth=2' to populate article relationships (images/categories)
  const res = await fetch(`${API_URL}/api/globals/homepage?depth=2`, {
    next: { revalidate: 60 }, // Cache on the edge for 60 seconds
  })

  if (!res.ok) {
    console.error('WaveNation Error: Could not fetch homepage global.')
    // Return a basic layout or fallback if the API is down
  }

  const homepageData: HomepageData = await res.json()

  // 2. Extract the manually selected 'Spotlight Articles' block
  const spotlightBlock = homepageData.modules?.find(
    (m): m is SpotlightArticlesBlock => m.blockType === 'spotlightArticles'
  )
  
  const spotlightArticles = spotlightBlock?.articles || []

  return (
    <>
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-YWB08LCGHY" 
        strategy="afterInteractive" 
      />
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
          
          {/* Main Hero: Includes Charts, Slider, and Spotlight Cards */}
          <HomeHero spotlightArticles={spotlightArticles} />
          
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

          <HomePlaylists />
          
          <HomeCharts />

          <HomeShows />

          <HomeTalent />

          <HomeCreators />

        </main>
      </div>
    </>
  )
}