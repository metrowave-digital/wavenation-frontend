import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await context.params

  // Example payload (replace with real CMS fetch)
  const contributor = {
    id: '123',
    slug,
    displayName: 'Contributor Name',
    role: 'Editor',
    bio: 'Contributor bio',
    verified: true,
    avatar: {
      url: '/avatar.jpg',
      alt: 'Avatar',
    },
    socials: [],
  }

  if (!contributor) {
    return NextResponse.json(null)
  }

  return NextResponse.json(contributor)
}
