// No API keys needed for MusicBrainz!

// 1. A simple queue to respect MusicBrainz's strict 1 request/second limit
const requestQueue: (() => void)[] = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) nextRequest();
    // Wait 1.1 seconds between requests to guarantee we don't get blocked
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  isProcessingQueue = false;
}

// Helper to pause execution until it's this request's turn
async function rateLimitDelay(): Promise<void> {
  return new Promise(resolve => {
    requestQueue.push(() => resolve());
    processQueue();
  });
}

export function cleanSearchString(str: string): string {
  return str.split(/\(|\-|feat\.|with\./i)[0].trim();
}

// Note: Kept the function name the same so your ChartsHubPage doesn't break
export async function getSpotifyArtwork(trackTitle: string, artist: string): Promise<string | null> {
  if (!trackTitle || !artist) return null;

  try {
    const cleanTrack = cleanSearchString(trackTitle);
    const cleanArtist = cleanSearchString(artist);

    // Wait in line to respect the 1-second limit
    await rateLimitDelay();

    // 1. Search MusicBrainz for the Recording to get a Release ID
    const query = encodeURIComponent(`recording:"${cleanTrack}" AND artist:"${cleanArtist}"`);
    const MB_SEARCH_URL = `https://musicbrainz.org/ws/2/recording/?query=${query}&fmt=json&limit=1`;

    const mbResponse = await fetch(MB_SEARCH_URL, {
      headers: {
        // MUSICBRAINZ REQUIREMENT: You MUST put your app name and email here
        'User-Agent': 'WaveNationCharts/1.0.0 ( contact@wavenation.online )',
        'Accept': 'application/json'
      },
      // Cache this search for 24 hours so we don't spam MusicBrainz for the same track
      next: { revalidate: 86400 } 
    });

    if (!mbResponse.ok) {
      console.error(`🚨 [MUSICBRAINZ] Search Failed (${mbResponse.status}) for ${trackTitle}`);
      return null;
    }

    const mbData = await mbResponse.json();
    
    // Extract the first Release ID (MBID) attached to this recording
    const recordings = mbData.recordings || [];
    if (recordings.length === 0) return null;

    const releases = recordings[0].releases || [];
    if (releases.length === 0) return null;

    const releaseId = releases[0].id; // We need this specific ID for the Cover Art Archive

    // 2. Build the Cover Art Archive URL
    const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front`;

    // 3. Ping the Cover Art Archive to make sure an image actually exists (prevents broken images)
    const caaResponse = await fetch(coverArtUrl, {
      method: 'HEAD',
      // The CAA redirects to archive.org, we want to follow it
      redirect: 'follow', 
      next: { revalidate: 86400 }
    });

    if (caaResponse.ok) {
      console.log(`✅ [CAA] Found artwork for: ${trackTitle}`);
      return coverArtUrl;
    } else {
      console.log(`❌ [CAA] No artwork found for: ${trackTitle}`);
      return null;
    }

  } catch (error) {
    console.error('🚨 [MUSICBRAINZ] Service Error:', error);
    return null;
  }
}