import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

import { NewsTicker } from '@/components/system/Header/NewsTicker/NewsTicker'
import { Header } from '@/components/system/Header/Header'
import { Footer } from '@/components/system/Footer/Footer'

import { Player } from '@/components/system/Player/Player'
import { TapToUnmuteToast } from '@/components/system/Player/TapToUnmuteToast/TapToUnmuteToast'

import { PostHogProvider } from './providers/PostHogProvider'
import { AnalyticsListener } from './providers/AnalyticsListener'
import { AudioProvider } from '@/components/system/Player/audio/AudioContext'

/* ======================================================
   Metadata
====================================================== */

export const metadata: Metadata = {
  title: 'WaveNation',
  description:
    'Culture-forward radio, TV, and storytelling — live and on demand.',
}

/* ======================================================
   Root Layout
====================================================== */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ================= Google AdSense ================= */}
        <meta
          name="google-adsense-account"
          content="ca-pub-6631983121456407"
        />

        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6631983121456407"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* ================= GA4 ================= */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YWB08LCGHY"
          strategy="afterInteractive"
        />

        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YWB08LCGHY', {
              send_page_view: false
            });
          `}
        </Script>
      </head>

      <body>
        {/* ================= Providers ================= */}
        <PostHogProvider>
          <AnalyticsListener />

          {/* ================= Global Audio ================= */}
          <AudioProvider
            streamUrl={process.env.NEXT_PUBLIC_RADIO_STREAM_URL!}
          >
            {/* ================= Global System UI ================= */}
            <NewsTicker />
            <Header />

            {/* ================= Page Content ================= */}
            <main id="content">{children}</main>

            {/* ================= Persistent Player ================= */}
            <Player />

            {/* 🔔 Autoplay unblock toast */}
            <TapToUnmuteToast />

            {/* ================= System Footer ================= */}
            <Footer />
          </AudioProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
