import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL!

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  const url = new URL('/api/contributors', CMS_URL)

  url.searchParams.set('where[user][equals]', params.userId)
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
}
