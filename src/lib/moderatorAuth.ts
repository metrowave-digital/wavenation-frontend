import { cookies } from 'next/headers'

export const MODERATOR_COOKIE = 'wn_moderator_session'
export const MODERATOR_PASSWORD =
  process.env.WN_MODERATOR_PASSWORD || 'wavenation2026'

export async function isModeratorAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(MODERATOR_COOKIE)?.value
  return token === MODERATOR_PASSWORD
}

export function getCMSBaseUrl() {
  const cmsUrl =
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL

  if (!cmsUrl) {
    throw new Error(
      'Missing CMS URL. Set NEXT_PUBLIC_CMS_URL, CMS_URL, or PAYLOAD_PUBLIC_SERVER_URL.',
    )
  }

  return cmsUrl.replace(/\/$/, '')
}

export function getCMSHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(process.env.PAYLOAD_API_KEY
      ? { Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}` }
      : {}),
  }
}