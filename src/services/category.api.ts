import type { Category, NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/categories?where[slug][equals]=${slug}`, {
      next: { revalidate: 600 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch {
    return null;
  }
}

export async function getArticlesByCategory(categoryId: string | number, limit: number = 24): Promise<NewsArticle[]> {
  try {
    // We use the ID because relationship filtering in REST is fastest via ID
    const res = await fetch(
      `${CMS_URL}/api/articles?where[categories][in][0]=${categoryId}&limit=${limit}&depth=2&sort=-publishDate`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch {
    return [];
  }
}