import { getMusicFeaturedInterviews, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET() {
  const items = await getMusicFeaturedInterviews(4)
  return jsonResponse(items)
}