import { NextRequest, NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set in environment variables')
}

/**
 * GET /api/talent/[slug]
 * Proxies the Payload CMS to fetch a single talent profile by slug
 */
export async function GET(
  request: NextRequest, // Using NextRequest for better type compatibility
  { params }: { params: Promise<{ slug: string }> } // 1. Set params as a Promise
) {
  // 2. Await the params before destructuring
  const { slug } = await params

  try {
    const res = await fetch(
      `${CMS_URL}/api/talent?where[slug][equals]=${slug}&depth=2`,
      { 
        next: { revalidate: 300 } // ISR: Cache for 5 minutes
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `CMS responded with status: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 })
    }

    return NextResponse.json(data.docs[0])

  } catch (error) {
    console.error(`[Talent API Error for ${slug}]:`, error)

    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}