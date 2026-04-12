import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  // Next.js 16 requires the second "profile" argument
  revalidateTag('nav-config', 'max')
  
  return NextResponse.json({ revalidated: true, now: Date.now() })
}