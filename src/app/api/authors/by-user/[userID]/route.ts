import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ userID: string }>
  }
) {
  const { userID } = await context.params

  // your logic here
  return NextResponse.json({
    userID,
  })
}
