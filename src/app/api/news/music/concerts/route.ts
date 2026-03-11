import { getMusicConcerts, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? '4')

  const items = await getMusicConcerts(Number.isFinite(limit) ? limit : 4)
  return jsonResponse(items)
}