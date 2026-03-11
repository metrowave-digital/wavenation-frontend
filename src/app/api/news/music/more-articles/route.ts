import { getMoreMusicArticles, jsonResponse } from '../_lib/musicNews'

export const revalidate = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const limitParam = Number(searchParams.get('limit') ?? '12')
  const offsetParam = Number(searchParams.get('offset') ?? '0')

  const limit = Number.isFinite(limitParam) ? limitParam : 12
  const offset = Number.isFinite(offsetParam) ? offsetParam : 0

  const data = await getMoreMusicArticles(limit, offset)
  return jsonResponse(data)
}