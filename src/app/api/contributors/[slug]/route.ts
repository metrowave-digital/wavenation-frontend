import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const url = new URL('/api/contributors', CMS_URL)

    url.searchParams.set('where[slug][equals]', params.slug)
    url.searchParams.set('depth', '2')
    url.searchParams.set('limit', '1')

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch contributor')
    }

    const data = await res.json()
    const doc = data?.docs?.[0]

    if (!doc) {
      return NextResponse.json(null)
    }

    /* =========================================
       NORMALIZE CONTRIBUTOR → AUTHOR
    ========================================= */

    const avatarImage =
      doc.photo?.sizes?.square?.url ||
      doc.photo?.sizes?.thumb?.url ||
      doc.photo?.url ||
      doc.user?.avatar?.sizes?.square?.url ||
      doc.user?.avatar?.url

    const author = {
      id: doc.id?.toString(),
      slug: doc.slug,
      displayName:
        doc.displayName ||
        doc.user?.displayName ||
        'Staff Writer',
      role: doc.role ?? 'Contributor',
      bio: doc.bio ?? doc.creatorProfile?.bio ?? null,
      verified: doc.user?.roles?.includes('admin') ||
        doc.user?.roles?.includes('editor'),
      avatar: avatarImage
        ? {
            url: avatarImage,
            alt: doc.displayName,
          }
        : undefined,
      socials: Object.entries(doc.socials || {})
        .filter(([, url]) => Boolean(url))
        .map(([platform, url]) => ({
          platform,
          url,
        })),
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error('[contributors:slug]', error)
    return NextResponse.json(null)
  }
}
