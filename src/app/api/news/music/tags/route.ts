import { getMusicTags, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET() {
  const items = await getMusicTags(10)
  return jsonResponse(items)
}