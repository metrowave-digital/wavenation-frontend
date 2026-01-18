import { NextResponse } from 'next/server'

/* ======================================================
   Types
====================================================== */

type AzuraCastSong = {
  id?: string
  artist: string
  title: string
  art?: string
}

type AzuraCastResponse = {
  is_online: boolean
  now_playing?: {
    is_live?: boolean
    song?: AzuraCastSong
  }
}

/* ======================================================
   Route
====================================================== */

export async function GET() {
  try {
    const res = await fetch(
      'https://a12.asurahosting.com/api/nowplaying/307',
      { cache: 'no-store' }
    )

    if (!res.ok) {
      throw new Error('AzuraCast unavailable')
    }

    const data: AzuraCastResponse = await res.json()
    const song = data?.now_playing?.song

    if (!song) {
      return NextResponse.json(null)
    }

    const artwork =
      song.art && !song.art.includes('generic_song')
        ? song.art
        : null

    return NextResponse.json({
      track: song.title ?? '',
      artist: song.artist ?? '',
      artwork,
    })
  } catch {
    return NextResponse.json(null)
  }
}
