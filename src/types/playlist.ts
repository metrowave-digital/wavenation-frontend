import { WNMedia } from './event'; // Assuming you have WNMedia defined from earlier

export interface WNMood {
  id: string | number;
  name: string;
  slug: string;
}

export interface WNDspIntegration {
  id: string;
  provider: 'spotify' | 'apple-music' | string;
  platformId: string;
  publicUrl?: string;
  syncStatus?: string;
}

export interface WNPlaylist {
  id: string | number;
  title: string;
  slug: string;
  playlistType?: string;
  description?: string;
  shortDescription?: string;
  coverImage?: WNMedia | null;
  curator?: {
    displayName: string;
    avatar?: WNMedia | null;
  } | null;
  genres?: string[];
  moods?: WNMood[];
  dspIntegrations?: WNDspIntegration[];
  totalTracks?: number;
  publishDate?: string;
  _status?: 'published' | 'draft';
}