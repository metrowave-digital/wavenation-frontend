import { redirect } from 'next/navigation'
import { isModeratorAuthenticated } from '@/lib/moderatorAuth'
import { ModeratorDashboard } from './ModeratorDashboard'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ModeratorPage({
  params,
}: PageProps) {
  const { slug } = await params
  const authed = await isModeratorAuthenticated()

  return <ModeratorDashboard slug={slug} authed={authed} />
}