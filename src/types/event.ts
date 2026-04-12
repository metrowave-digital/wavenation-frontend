/**
 * Shared Type Definitions for WaveNation Events
 */

export interface WNRichText {
  root: {
    type: string;
    children: Array<{
      type: string;
      version: number;
      [key: string]: unknown;
    }>;
    direction: ('ltr' | 'rtl') | null;
    format: string;
    indent: number;
    version: number;
  };
}

export interface WNMedia {
  id?: string | number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sizes?: {
    hero?: { url: string };
    card?: { url: string };
    thumb?: { url: string };
    square?: { url: string };
    [key: string]: { url: string } | undefined;
  };
}

export interface WNEvent {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string | null;
  description?: WNRichText | null; // Typed for Lexical/Slate
  startDate?: string | null;
  endDate?: string | null;
  timezone?: string | null;
  eventType?: 'virtual' | 'live' | 'hybrid' | string | null;
  promotionTier?: 'featured' | 'standard' | string | null;
  
  heroImage?: WNMedia | null;
  thumbnail?: WNMedia | null;

  venue?: {
    name?: string;
    address?: string;
  } | null;

  contentVertical?: string | null;
  status?: string | null;
  _status?: 'draft' | 'published' | null;

  ctaLabel?: string | null;
  ctaUrl?: string | null;

  hostName?: string | null;
  guestName?: string | string[] | null;
  sponsorNames?: string[] | null;

  streamEmbedUrl?: string | null;
  chatEmbedUrl?: string | null; // Added to fix TS Error
  livestreamAccessInstructions?: string | null;
  virtualEventLabel?: string | null;

  // Added Replay structure to fix TS Error
  replay?: {
    replayEnabled?: boolean;
    replayUrl?: string | null;
    replayAvailableImmediately?: boolean;
    replayAvailableAt?: string | null;
    replayExpiresAt?: string | null;
  } | null;
  
  agenda?: Array<{
    time?: string | null;
    title?: string | null;
    description?: string | null;
  }> | null;
  
  faq?: Array<{
    question?: string | null;
    answer?: string | null;
  }> | null;

  seoTitle?: string | null;
  seoDescription?: string | null;
}

/**
 * Helper to ensure an event from the CMS is compatible with WNEvent
 */
export function normalizeWNEvent(data: Record<string, unknown>): WNEvent {
  return {
    ...(data as unknown as WNEvent),
    id: String(data.id),
    // Ensure heroImage/thumbnail are objects, not just string IDs from the CMS
    heroImage: data.heroImage && typeof data.heroImage === 'object' ? (data.heroImage as WNMedia) : null,
    thumbnail: data.thumbnail && typeof data.thumbnail === 'object' ? (data.thumbnail as WNMedia) : null,
  };
}