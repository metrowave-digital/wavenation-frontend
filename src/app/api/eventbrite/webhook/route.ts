import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('Eventbrite webhook received:', body)

    return NextResponse.json({
      success: true,
      received: true,
    })
  } catch (error) {
    console.error('Eventbrite webhook error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
      },
      { status: 500 },
    )
  }
}