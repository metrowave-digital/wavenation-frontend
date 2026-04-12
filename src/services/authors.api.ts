import type { Author, NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

export async function getAuthors(): Promise<Author[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/authors?limit=50&sort=fullName`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch { return []; }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${CMS_URL}/api/authors?where[slug][equals]=${slug}&depth=1`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch { return null; }
}

export async function getArticlesByAuthor(authorId: string | number, limit: number = 20): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?where[author][equals]=${authorId}&limit=${limit}&depth=2&sort=-publishDate`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch { return []; }
}