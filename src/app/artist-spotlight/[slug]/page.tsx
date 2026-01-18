import { notFound } from 'next/navigation'

import ArtistSpotlightClient from'./ArtistSpotlight.client'

/* ======================================================
   Types
====================================================== */

interface PageProps {
  params: Promise<{ slug: string }>
}

/* ======================================================
   Config
====================================================== */

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

/* ======================================================
   Page (SERVER)
====================================================== */

export default async function ArtistSpotlightPage({
  params,
}: PageProps) {
  const { slug } = await params

  const res = await fetch(
    `${CMS_URL}/api/articles?where[slug][equals]=${slug}&where[_status][equals]=published&limit=1`,
    { cache: 'no-store' }
  )

  if (!res.ok) notFound()

  const data = await res.json()
  const article = data?.docs?.[0]

  if (!article) notFound()

  return <ArtistSpotlightClient article={article} />
}
