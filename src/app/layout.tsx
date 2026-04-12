import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

import { NewsTicker } from '@/components/layout/NewsTicker/NewsTicker'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import { Player } from '@/components/player/Player'
import { TapToUnmuteToast } from '@/components/player/shared/TapToUnmuteToast/TapToUnmuteToast'
import { PostHogProvider } from './providers/PostHogProvider'
import { AnalyticsListener } from './providers/AnalyticsListener'
import { AudioProvider } from '@/components/player/audio/AudioProvider'

import { getMainNav } from '@/services/nav.api'
import { getFooterData } from '@/services/footer.api'
import { getSiteSettings } from '@/services/settings.api'
import { SiteSettings } from '@/services/settings.api' // Ensure this is exported

/* ======================================================
   Dynamic Metadata (Connects Favicons & SEO)
====================================================== */
export async function generateMetadata(): Promise<Metadata> {
  const settings: SiteSettings | null = await getSiteSettings()
  
  return {
    title: {
      default: settings?.siteTitle || 'WaveNation',
      template: `%s | ${settings?.siteTitle || 'WaveNation'}`,
    },
    description: settings?.defaultSeoDescription || 'Culture-forward radio and storytelling.',
    icons: {
      // Use optional chaining and nullish coalescing to satisfy TS
      icon: settings?.favicon?.url || '/favicon.ico',
      apple: settings?.appleTouchIcon?.url || '/apple-touch-icon.png',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Parallel fetch for speed
  const [navData, footerData, settings] = await Promise.all([
    getMainNav(),
    getFooterData(),
    getSiteSettings()
  ])

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6631983121456407" />
        <Script 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6631983121456407" 
          strategy="afterInteractive" 
          crossOrigin="anonymous" 
        />
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-YWB08LCGHY" 
          strategy="afterInteractive" 
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-YWB08LCGHY', { send_page_view: false });`}
        </Script>
      </head>

      <body>
        <PostHogProvider>
          <AnalyticsListener />
          <AudioProvider streamUrl={process.env.NEXT_PUBLIC_RADIO_STREAM_URL!}>
            
            {/* Sticky Stack Container */}
            <div style={{ position: 'sticky', top: 0, zIndex: 1100 }}>
              <NewsTicker />
              <Header navData={navData} settings={settings} />
            </div>

            <main id="content">{children}</main>

            <Player />
            <TapToUnmuteToast />
            <Footer data={footerData} settings={settings} />
          </AudioProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}