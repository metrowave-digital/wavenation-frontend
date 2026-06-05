import { NextResponse } from "next/server";
import { getSpotifyArtwork } from "@/lib/spotify/getSpotifyArtwork";

/* ----------------------------------------
   Route Configuration
----------------------------------------- */

export const revalidate = 15;

const STATION_ID =
  process.env.RADIOCO_STATION_ID ??
  process.env.NEXT_PUBLIC_RADIO_STATION_ID ??
  "s70d96b137";

const STATUS_URL =
  process.env.RADIOCO_STATUS_URL ??
  `https://public.radio.co/stations/${STATION_ID}/status`;

const CURRENT_TRACK_URL =
  process.env.RADIOCO_CURRENT_TRACK_URL ??
  `https://public.radio.co/api/v2/${STATION_ID}/track/current`;

/* ----------------------------------------
   Radio.co Types
----------------------------------------- */

type RadioCoSource = {
  type?: string;
  collaborator?: {
    id?: string;
    name?: string;
  } | null;
  relay?: unknown | null;
};

type RadioCoStatusTrack = {
  title?: string;
  start_time?: string;
  artwork_url?: string | null;
  artwork_url_large?: string | null;
};

type RadioCoStatusResponse = {
  status?: string;
  source?: RadioCoSource;
  current_track?: RadioCoStatusTrack | null;
  history?: RadioCoStatusTrack[];
  logo_url?: string | null;
};

type RadioCoArtworkUrls = {
  standard?: string | null;
  large?: string | null;
};

type RadioCoCurrentTrack = {
  title?: string;
  start_time?: string;
  artwork_urls?: RadioCoArtworkUrls | null;
  track_artist?: string | null;
  track_title?: string | null;
  track_album?: string | null;
};

type RadioCoCurrentTrackResponse = {
  data?: RadioCoCurrentTrack | null;
};

/* ----------------------------------------
   Helpers
----------------------------------------- */

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 15,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Radio.co request failed with status ${response.status}: ${url}`,
    );
  }

  return response.json() as Promise<T>;
}

function splitRadioCoTrackTitle(value?: string | null): {
  artist: string;
  title: string;
} {
  const text = value?.trim() ?? "";

  if (!text) {
    return {
      artist: "",
      title: "",
    };
  }

  /*
   * Radio.co status history commonly returns:
   * "Artist Name - Track Title"
   */
  const match = text.match(/^(.+?)\s[-–—]\s(.+)$/);

  if (!match) {
    return {
      artist: "",
      title: text,
    };
  }

  return {
    artist: match[1].trim(),
    title: match[2].trim(),
  };
}

function normalizeTrack(artist: string, title: string) {
  const cleanTitle = title
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\s*-\s*clean$/i, "")
    .replace(/\s*-\s*radio edit$/i, "")
    .replace(/\s+(feat|ft)\.?.*$/i, "")
    .trim();

  const cleanArtist = artist
    .replace(/\s+(feat|ft)\.?.*$/i, "")
    .trim();

  return {
    artist: cleanArtist,
    title: cleanTitle,
  };
}

function toUnixSeconds(value?: string | null): number {
  if (!value) return 0;

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return Math.floor(timestamp / 1000);
}

/* ----------------------------------------
   In-Memory Artwork Cache
----------------------------------------- */

type ArtworkCacheEntry = {
  artwork: string | null;
  updatedAt: number;
};

const ARTWORK_CACHE_TTL = 1000 * 60 * 60 * 6;
const artworkCache = new Map<string, ArtworkCacheEntry>();

function getCachedArtwork(
  key: string,
): string | null | undefined {
  const entry = artworkCache.get(key);

  if (!entry) {
    return undefined;
  }

  if (Date.now() - entry.updatedAt > ARTWORK_CACHE_TTL) {
    artworkCache.delete(key);
    return undefined;
  }

  return entry.artwork;
}

function setCachedArtwork(
  key: string,
  artwork: string | null,
) {
  artworkCache.set(key, {
    artwork,
    updatedAt: Date.now(),
  });
}

/* ----------------------------------------
   Route
----------------------------------------- */

export async function GET() {
  try {
    /*
     * Status endpoint provides:
     * - online/offline status
     * - source type
     * - history
     *
     * Current-track endpoint provides:
     * - separate artist/title fields
     * - improved artwork fields
     */
    const [statusData, currentTrackData] = await Promise.all([
      fetchJson<RadioCoStatusResponse>(STATUS_URL),

      fetchJson<RadioCoCurrentTrackResponse>(
        CURRENT_TRACK_URL,
      ).catch((error) => {
        console.warn(
          "Radio.co current-track endpoint unavailable:",
          error,
        );

        return null;
      }),
    ]);

    const currentTrack = currentTrackData?.data;

    const fallbackTrack = splitRadioCoTrackTitle(
      statusData.current_track?.title,
    );

    const artist =
      currentTrack?.track_artist?.trim() ||
      fallbackTrack.artist;

    const title =
      currentTrack?.track_title?.trim() ||
      fallbackTrack.title;

    const isOnline =
      statusData.status?.toLowerCase() === "online";

    const sourceType =
      statusData.source?.type?.toLowerCase() ?? "";

    const isLive =
      isOnline &&
      (sourceType === "live" ||
        statusData.source?.collaborator != null);

    /* ----------------------------------------
       Artwork Resolution Order
       1. Radio.co track artwork
       2. Spotify artwork
       3. Default artwork
    ----------------------------------------- */

    let artwork: string | null =
      currentTrack?.artwork_urls?.large ??
      currentTrack?.artwork_urls?.standard ??
      statusData.current_track?.artwork_url_large ??
      statusData.current_track?.artwork_url ??
      null;

    /*
     * Radio.co may return the station logo when track
     * artwork is unavailable. Ignore it so Spotify can
     * attempt to find the actual album artwork.
     */
    if (
      artwork &&
      statusData.logo_url &&
      artwork === statusData.logo_url
    ) {
      artwork = null;
    }

    if (!artwork && artist && title) {
      const normalized = normalizeTrack(artist, title);

      const cacheKey =
        `${normalized.artist}|${normalized.title}`.toLowerCase();

      const cachedArtwork = getCachedArtwork(cacheKey);

      if (cachedArtwork !== undefined) {
        artwork = cachedArtwork;
      } else {
        try {
          const spotifyArtwork = await getSpotifyArtwork(
            normalized.artist,
            normalized.title,
          );

          setCachedArtwork(cacheKey, spotifyArtwork);
          artwork = spotifyArtwork;
        } catch (error) {
          console.warn(
            "Spotify artwork lookup failed:",
            error,
          );
        }
      }
    }

    if (!artwork) {
      artwork = "/images/player/default-artwork.jpg";
    }

    const history =
      statusData.history?.slice(0, 5).map((item) => {
        const track = splitRadioCoTrackTitle(item.title);

        return {
          artist: track.artist,
          title: track.title,
          playedAt: toUnixSeconds(item.start_time),
        };
      }) ?? [];

    return NextResponse.json(
      {
        nowPlaying: {
          artist,
          title,
          artwork,
          isLive,
          mode: isLive ? "LIVE" : isOnline ? "AUTO" : "OFFLINE",
        },

        /*
         * Radio.co's documented public status response does not
         * include the current listener count.
         */
        listeners: 0,

        history,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=15, stale-while-revalidate=45",
        },
      },
    );
  } catch (error) {
    console.error("Radio now-playing route failed:", error);

    return NextResponse.json(
      {
        nowPlaying: {
          artist: "",
          title: "",
          artwork: "/images/player/default-artwork.jpg",
          isLive: false,
          mode: "OFFLINE",
        },
        listeners: 0,
        history: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}