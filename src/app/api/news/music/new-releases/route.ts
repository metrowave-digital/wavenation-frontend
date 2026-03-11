import { getMusicNewReleases, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET() {
  const items = await getMusicNewReleases(6)
  return jsonResponse(items)
}