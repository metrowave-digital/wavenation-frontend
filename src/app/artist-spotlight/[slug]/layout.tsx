import type { Metadata } from 'next'
import Script from 'next/script'

/* ======================================================
   Metadata (Head Injection for This Route Group)
====================================================== */

export const metadata: Metadata = {
  other: {
    'google-adsense-account': 'ca-pub-6631983121456407',
  },
}

/* ======================================================
   Artist Spotlight Layout
====================================================== */

export default function ArtistSpotlightLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* ================= Google AdSense (Scoped) ================= */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6631983121456407"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <main
        style={{
          background: '#0b0b0d',
          color: '#f5f5f7',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </>
  )
}
