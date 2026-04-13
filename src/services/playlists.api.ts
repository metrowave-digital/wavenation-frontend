import { WNPlaylist } from '@/types/playlist';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

// --- CMS Fetchers ---

export async function getPlaylists(limit: number = 20): Promise<WNPlaylist[]> {
  try {
    const url = `${CMS_URL}/api/playlists?limit=${limit}&depth=2&where[_status][equals]=published`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("❌ getPlaylists Error:", error);
    return [];
  }
}

export async function getPlaylistBySlug(slug: string): Promise<WNPlaylist | null> {
  if (!slug) return null;
  try {
    const url = `${CMS_URL}/api/playlists?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    // Resilient check for Payload CMS structure
    return (data.docs && data.docs.length > 0) ? data.docs[0] : null;
  } catch (error) {
    console.error("❌ getPlaylistBySlug Error:", error);
    return null;
  }
}

// --- Spotify API Sync Utility ---
// Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local

export async function getSpotifyPlaylistData(playlistId: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("⚠️ Spotify Credentials missing. Skipping raw sync.");
    return null;
  }

  try {
    // 1. Get Access Token
    const authRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      body: 'grant_type=client_credentials',
      next: { revalidate: 3600 } // Token valid for 1 hour
    });
    
    const authData = await authRes.json();
    const token = authData.access_token;

    // 2. Fetch Playlist Data
    const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      next: { revalidate: 300 } // Revalidate every 5 mins
    });

    return await playlistRes.json();
  } catch (error) {
    console.error("❌ Spotify API Error:", error);
    return null;
  }
}