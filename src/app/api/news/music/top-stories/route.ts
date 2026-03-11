import { getMusicTopStories, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET() {
  const items = await getMusicTopStories(5)
  return jsonResponse(items)
}