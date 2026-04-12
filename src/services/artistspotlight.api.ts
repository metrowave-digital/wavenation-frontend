import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

/**
 * Fetch the latest Artist Profiles
 */
export async function getLatestSpotlights(limit: number = 5): Promise<NewsArticle[]> {
  try {
    const url = `${CMS_URL}/api/articles?where[subcategories.slug][equals]=artist-profiles&limit=${limit}&depth=2&sort=-publishDate`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    console.error("Spotlight API Error:", err);
    return [];
  }
}

/**
 * Fetch a single spotlight by ID (for Homepage relations)
 */
export async function getSpotlightById(id: string | number): Promise<NewsArticle | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/articles/${id}?depth=2`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}