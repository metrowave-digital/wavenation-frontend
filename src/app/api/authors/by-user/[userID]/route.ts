import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const url = new URL('/api/authors', CMS_URL)

    // Payload relationship filter
    url.searchParams.set(
      'where[user][equals]',
      params.userId
    )
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '2')

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json(null)
    }

    const data = await res.json()

    return NextResponse.json(data?.docs?.[0] ?? null)
  } catch (err) {
    console.error('[author-by-user]', err)
    return NextResponse.json(null)
  }
}
