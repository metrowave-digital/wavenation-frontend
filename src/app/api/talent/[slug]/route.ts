import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set in environment variables')
}

/**
 * GET /api/talent/[slug]
 * Proxies the Payload CMS to fetch a single talent profile by slug
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

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

    // Return the first matching talent document
    return NextResponse.json(data.docs[0])

  } catch (error) {
    // 1. Log the error to your server console so you can see WHAT failed
    console.error(`[Talent API Error for ${slug}]:`, error)

    // 2. Return a clean message to the frontend
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}