import { NextRequest, NextResponse } from 'next/server'
import {
  MODERATOR_COOKIE,
  MODERATOR_PASSWORD,
} from '@/lib/moderatorAuth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password =
      typeof body?.password === 'string' ? body.password : ''

    if (password !== MODERATOR_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password.' },
        { status: 401 },
      )
    }

    const response = NextResponse.json(
      { success: true },
      { status: 200 },
    )

    response.cookies.set({
      name: MODERATOR_COOKIE,
      value: MODERATOR_PASSWORD,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Login failed.' },
      { status: 500 },
    )
  }
}