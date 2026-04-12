import { NextResponse } from 'next/server'
import { getSpotlightArticles } from '@/services/homepagearticles.api'

export async function GET() {
  const articles = await getSpotlightArticles()
  return NextResponse.json(articles)
}