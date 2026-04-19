const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export function cleanSearchString(str: string): string {
  return str.split(/\(|\-|feat\.|with\./i)[0].trim();
}

export async function getAccessToken() {
  if (!client_id || !client_secret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET');
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  
  // FIXED: The REAL Spotify Token URL
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    next: { revalidate: 3600 }, 
  });

  if (!response.ok) throw new Error('Failed to fetch Spotify access token');
  return response.json();
}

export async function getSpotifyArtwork(trackTitle: string, artist: string): Promise<string | null> {
  if (!trackTitle || !artist) return null;

  try {
    const { access_token } = await getAccessToken();
    
    const cleanTrack = cleanSearchString(trackTitle);
    const cleanArtist = cleanSearchString(artist);

    const query = encodeURIComponent(`track:${cleanTrack} artist:${cleanArtist}`);
    
    // FIXED: The REAL Spotify Search URL
    const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

    const res = await fetch(SEARCH_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      next: { revalidate: 86400 }, 
    });

    if (!res.ok) {
      if (res.status === 429) console.error(`Spotify API: Rate Limited on ${trackTitle}`);
      return null;
    }

    const data = await res.json();
    return data.tracks?.items?.[0]?.album?.images?.[0]?.url || null;

  } catch (error) {
    console.error('Spotify Service Error:', error);
    return null;
  }
}