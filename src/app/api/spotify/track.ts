// /api/spotify/track.ts
import { getSpotifyToken } from "@/lib/spotify/spotify";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({});

  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const track = await res.json();

  return Response.json({
    title: track.name,
    artist: track.artists[0]?.name,
    artwork: track.album.images[0]?.url,
    previewUrl: track.preview_url,
  });
}
