import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, preferences } = await req.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // 1. Add User to Resend Audience
    await resend.contacts.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      unsubscribed: false,
      audienceId: RESEND_AUDIENCE_ID,
    });

    // 2. Send Welcome Email
    await resend.emails.send({
      from: 'WaveNation <newsletter@wavenation.media>',
      to: [email],
      subject: 'SIGNAL RECEIVED: Welcome to WaveNation',
      html: `
        <div style="font-family: sans-serif; background: #0B0D0F; color: #fff; padding: 40px; border: 1px solid #1A1C20;">
          <h2 style="color: #39FF14; text-transform: uppercase;">Signal Received</h2>
          <p>Peace ${firstName},</p>
          <p>You are now connected to the WaveNation Dispatch. You've opted in for: <strong>${preferences.join(', ')}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #1A1C20; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">AMPLIFY YOUR VIBE. <br /> © 2026 WAVENATION MEDIA</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    // FIX: ESLint Error (Line 45)
    // We treat the error as 'unknown' and then check if it's an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown transmission error';
    
    console.error('Resend Dispatch Error:', errorMessage);

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}