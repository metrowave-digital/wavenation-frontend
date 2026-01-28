import Script from 'next/script'
import styles from './page.module.css'

import HomeHero from './(home)/componenets/HomeHero/HomeHero.server'
import { ArtistSpotlightHero }  from './(home)/componenets/ArtistSpotlight/ArtistSpotlightHero'

export default function Home() {
  return (
    <>
      {/* ================= GA4 (Home Page) ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YWB08LCGHY"
        strategy="afterInteractive"
      />

      <Script id="ga4-home-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-YWB08LCGHY', {
            page_path: '/',
          });
        `}
      </Script>

      <div className={styles.page}>
        <main className={styles.main}>
          {/* Homepage Hero System */}
          <HomeHero />
        </main>
      </div>
    </>
  )
}
