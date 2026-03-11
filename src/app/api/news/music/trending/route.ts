import { getMusicTrending, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET() {
  const items = await getMusicTrending(8)
  return jsonResponse(items)
}