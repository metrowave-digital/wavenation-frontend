import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // --- LOCAL DEVELOPMENT ---
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      
      // --- PRODUCTION CMS & CLOUD STORAGE ---
      {
        protocol: 'https',
        hostname: 'wavenation.media',
        pathname: '/**', // Broadened to ensure all CMS images pass through
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },

      // --- SPOTIFY IMAGE CDNS ---
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**', // Broadened from /image/** to catch all routes
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
        pathname: '/**',
      },
    ],
  },

  /* ======================================================
     Redirect legacy article URLs → /news
  ====================================================== */
  async redirects() {
    return [
      // /articles → /news
      {
        source: '/articles',
        destination: '/news',
        permanent: true,
      },

      // /articles/foo → /news/foo
      {
        source: '/articles/:slug',
        destination: '/news/:slug',
        permanent: true,
      },

      // (optional but recommended)
      // /articles/...anything → /news/...anything
      {
        source: '/articles/:path*',
        destination: '/news/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig