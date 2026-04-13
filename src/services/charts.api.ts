const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

export interface WNChartEntry {
  id: string;
  rank: number;
  previousRank: number | null;
  peakRank: number | null;
  weeksOnChart: number;
  movement: 'up' | 'down' | 'same' | 'new' | 're-entry' | null;
  trackTitle: string;
  artist: string;
  manualTrack?: {
    title: string;
    artist: string;
    artwork?: { 
      url: string; 
      sizes?: Record<string, { url: string } | undefined>; 
    };
  };
}

export interface WNChart {
  id: number | string;
  title: string;
  slug: string;
  chartKey: string;
  week: string;
  previousChart?: string | { id: string; slug: string }; // Payload can return ID or Object
  weekRange?: { startDate: string; endDate: string };
  playlist?: { slug: string | null };
  entries: WNChartEntry[];
  _status: 'draft' | 'published';
  status?: 'draft' | 'published' | 'review' | 'archived'; 
}

export async function getCharts(params: { limit?: number; where?: string } = {}) {
  const { limit = 50, where = '' } = params;
  try {
    const url = `${CMS_URL}/api/charts?limit=${limit}&depth=2&sort=-weekRange.startDate${where}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { docs: [] };
    return await res.json();
  } catch (error) {
    console.error("❌ getCharts Error:", error);
    return { docs: [] };
  }
}

export async function getChartBySlug(slug: string): Promise<WNChart | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${CMS_URL}/api/charts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.docs && data.docs.length > 0) ? data.docs[0] : null;
  } catch (error) {
    console.error(`❌ getChartBySlug Error (${slug}):`, error);
    return null;
  }
}

// NEW: Added to fetch the previous week to find dropped tracks
export async function getChartById(id: string | number): Promise<WNChart | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/charts/${id}?depth=2`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`❌ getChartById Error (${id}):`, error);
    return null;
  }
}