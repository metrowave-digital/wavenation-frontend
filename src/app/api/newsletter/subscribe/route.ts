import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, preferences } = await req.json()

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WaveNation <newsletter@wavenation.media>',
        to: ['hello@wavenation.media'],
        subject: 'New Newsletter Signup 🌊',
        html: `
          <h2>New Signup</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Preferences:</strong> ${preferences.join(', ')}</p>
        `,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
