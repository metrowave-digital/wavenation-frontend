import { WNEvent, WNMedia } from '@/types/event';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

// --- Types for Raw CMS Data (Bypasses ESLint 'any' errors) ---

interface RawMedia extends Omit<WNMedia, 'url' | 'sizes'> {
  url: string;
  sizes?: {
    hero?: { url: string };
    card?: { url: string };
    thumb?: { url: string };
    square?: { url: string };
    [key: string]: { url: string } | undefined;
  };
}

interface RawEvent extends Omit<WNEvent, 'id' | 'heroImage'> {
  id: number | string;
  heroImage?: RawMedia | null;
}

// --- Normalization Helpers ---

/**
 * Ensures media URLs are absolute.
 */
function absoluteMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${CMS_URL.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Transforms raw CMS data into the WNEvent format the frontend expects.
 * Maps nested image sizes and ensures IDs are strings.
 */
function normalizeEvent(event: RawEvent): WNEvent {
  if (!event) return {} as WNEvent;

  return {
    ...event,
    id: String(event.id),
    heroImage: event.heroImage
      ? {
          ...event.heroImage,
          url: absoluteMediaUrl(event.heroImage.url),
          sizes: {
            hero: { url: absoluteMediaUrl(event.heroImage.sizes?.hero?.url) },
            card: { url: absoluteMediaUrl(event.heroImage.sizes?.card?.url) },
            thumb: { url: absoluteMediaUrl(event.heroImage.sizes?.thumb?.url) },
            square: { url: absoluteMediaUrl(event.heroImage.sizes?.square?.url) },
          },
        }
      : null,
  } as WNEvent;
}

// --- API Functions ---

/**
 * Core Fetcher: Used for specific queries like finding LIVE events.
 */
export async function getEvents(params: {
  limit?: number;
  where?: Record<string, unknown>;
  sort?: string;
} = {}) {
  const { limit = 12, where = {}, sort = '-startDate' } = params;
  const url = new URL(`${CMS_URL}/api/events`);
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sort', sort);
  url.searchParams.set('depth', '2');

  Object.entries(where).forEach(([key, value]) => {
    url.searchParams.set(`where[${key}][equals]`, String(value));
  });

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`getEvents failed: ${res.status}`);
    const data = await res.json();
    return {
      docs: (data.docs || []).map((doc: RawEvent) => normalizeEvent(doc)),
      totalDocs: data.totalDocs || 0
    };
  } catch (error) {
    console.error("❌ getEvents Error:", error);
    return { docs: [], totalDocs: 0 };
  }
}

/**
 * Fetches events based on category/feed type.
 */
export async function getEventsByFeed(feed: string = 'all') {
  try {
    const url = new URL(`${CMS_URL}/api/events`);
    url.searchParams.set('depth', '2');
    url.searchParams.set('limit', '100');
    url.searchParams.set('where[_status][equals]', 'published');
    
    if (feed !== 'all') {
      if (feed === 'virtual' || feed === 'live') {
        url.searchParams.set('where[eventType][equals]', feed === 'live' ? 'in-person' : feed);
      } else {
        url.searchParams.set('where[contentVertical][equals]', feed);
      }
    }

    const res = await fetch(url.toString(), { 
      next: { revalidate: 30 },
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);

    const data = await res.json();
    const rawDocs = (data.docs || []) as RawEvent[];
    
    return {
      docs: rawDocs.map(normalizeEvent)
    };
  } catch (error) {
    console.error("❌ getEventsByFeed Error:", error);
    return { docs: [] };
  }
}

/**
 * Fetches a single event by its slug.
 */
export async function getEventBySlug(slug: string): Promise<WNEvent | null> {
  if (!slug) return null;

  try {
    const url = new URL('/api/events', CMS_URL);
    url.searchParams.set('where[slug][equals]', slug);
    url.searchParams.set('limit', '1');
    url.searchParams.set('depth', '2');

    const res = await fetch(url.toString(), {
      next: { revalidate: 30 },
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.PAYLOAD_API_KEY ? { Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}` } : {}),
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    let rawDoc: RawEvent | null = null;
    
    if (data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
      rawDoc = data.docs[0] as RawEvent;
    } else if (data && data.slug === slug) {
      rawDoc = data as RawEvent;
    }

    if (!rawDoc) return null;

    return normalizeEvent(rawDoc);
  } catch (error) {
    console.error("❌ getEventBySlug Catch Error:", error);
    return null;
  }
}

/**
 * Fetches event by ID directly.
 */
export async function getEventById(id: string | number): Promise<WNEvent | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/events/${id}?depth=2`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as RawEvent;
    return normalizeEvent(data);
  } catch (error) {
    console.error(`❌ getEventById Error ${id}:`, error);
    return null;
  }
}