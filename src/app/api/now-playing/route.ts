import { NextResponse } from "next/server";
import { getSpotifyArtwork } from "@/lib/spotify/getSpotifyArtwork";

/* ----------------------------------------
   Types
----------------------------------------- */

type AzuraCastSong = {
  id?: string;
  artist: string;
  title: string;
  art?: string;
};

type AzuraCastHistoryItem = {
  played_at: number;
  song: AzuraCastSong;
};

type AzuraCastResponse = {
  is_online: boolean;
  now_playing?: {
    is_live?: boolean;
    song?: AzuraCastSong;
  };
  live?: {
    is_live?: boolean;
  };
  listeners?: {
    current?: number;
  };
  song_history?: AzuraCastHistoryItem[];
};

/* ----------------------------------------
   Helpers
----------------------------------------- */

function normalizeTrack(artist: string, title: string) {
  const cleanTitle = title
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/- clean/i, "")
    .replace(/- radio edit/i, "")
    .replace(/feat\.?.*/i, "")
    .replace(/ft\.?.*/i, "")
    .trim();

  const cleanArtist = artist
    .replace(/feat\.?.*/i, "")
    .replace(/ft\.?.*/i, "")
    .trim();

  return {
    artist: cleanArtist,
    title: cleanTitle,
  };
}

/* ----------------------------------------
   In-Memory Artwork Cache
----------------------------------------- */

type ArtworkCacheEntry = {
  artwork: string | null;
  updatedAt: number;
};

const ARTWORK_CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
const artworkCache = new Map<string, ArtworkCacheEntry>();

function getCachedArtwork(key: string): string | null {
  const entry = artworkCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.updatedAt > ARTWORK_CACHE_TTL) {
    artworkCache.delete(key);
    return null;
  }

  return entry.artwork;
}

function setCachedArtwork(
  key: string,
  artwork: string | null
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
    const res = await fetch(
      "https://a12.asurahosting.com/api/nowplaying/307",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("AzuraCast unavailable");
    }

    const data: AzuraCastResponse = await res.json();
    const now = data.now_playing?.song;

    const isLive =
      data.is_online === true &&
      (data.live?.is_live === true ||
        data.now_playing?.is_live === true);

    /* ----------------------------------------
       Artwork Resolution Order
       1. AzuraCast real art
       2. Spotify (normalized + cached)
       3. Default
    ----------------------------------------- */

    let artwork: string | null =
      now?.art &&
      !now.art.includes("generic_song")
        ? now.art
        : null;

    if (!artwork && now?.artist && now?.title) {
      const normalized = normalizeTrack(
        now.artist,
        now.title
      );

      const cacheKey = `${normalized.artist}|${normalized.title}`;

      const cached = getCachedArtwork(cacheKey);
      if (cached !== null) {
        artwork = cached;
      } else {
        const spotifyArt = await getSpotifyArtwork(
          normalized.artist,
          normalized.title
        );

        setCachedArtwork(cacheKey, spotifyArt);
        artwork = spotifyArt;
      }
    }

    if (!artwork) {
      artwork = "/images/player/default-artwork.jpg";
    }

    return NextResponse.json({
      nowPlaying: {
        artist: now?.artist ?? "",
        title: now?.title ?? "",
        artwork,
        isLive,
        mode: isLive ? "LIVE" : "AUTO",
      },
      listeners: data.listeners?.current ?? 0,
      history:
        data.song_history?.slice(0, 5).map((h) => ({
          artist: h.song.artist,
          title: h.song.title,
          playedAt: h.played_at,
        })) ?? [],
    });
  } catch {
    return NextResponse.json({
      nowPlaying: {
        artist: "",
        title: "",
        artwork: "/images/player/default-artwork.jpg",
        isLive: false,
        mode: "OFFLINE",
      },
      listeners: 0,
      history: [],
    });
  }
}
