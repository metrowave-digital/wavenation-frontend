import type { Tag, NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/tags?limit=100&sort=label`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch { return []; }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${CMS_URL}/api/tags?where[slug][equals]=${slug}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch { return null; }
}

export async function getArticlesByTag(tagId: string | number, limit: number = 20): Promise<NewsArticle[]> {
  try {
    // Payload uses 'contains' or 'in' for relationship arrays
    const res = await fetch(
      `${CMS_URL}/api/articles?where[tags][in]=${tagId}&limit=${limit}&depth=2&sort=-publishDate`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch { return []; }
}