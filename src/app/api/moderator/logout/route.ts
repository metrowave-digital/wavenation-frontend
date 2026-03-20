import { NextResponse } from 'next/server'
import { MODERATOR_COOKIE } from '@/lib/moderatorAuth'

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 },
  )

  response.cookies.set({
    name: MODERATOR_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}