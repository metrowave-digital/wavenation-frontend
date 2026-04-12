import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';
const ENDPOINT = `${CMS_URL}/api/articles`;

/* ======================================================
   1. WORKING REST API SECTION (DO NOT CHANGE)
====================================================== */

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${ENDPOINT}?where[slug][equals]=${slug}&depth=2`, {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (err) {
    console.error("News API Service Error (Slug):", err);
    return null;
  }
}

export async function getLatestNews(limit: number = 20): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${ENDPOINT}?limit=${limit}&depth=2&sort=-publishDate`, {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    console.error("News API Service Error (Latest):", err);
    return [];
  }
}

export async function getEditorsPicks(limit: number = 5): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${ENDPOINT}?where[isFeatured][equals]=true&limit=${limit}&depth=2&sort=-publishDate`, {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    console.error("News API Service Error (Editors Picks):", err);
    return [];
  }
}

export async function getNewsByCategory(categorySlug: string, limit: number = 4): Promise<NewsArticle[]> {
  if (!categorySlug) return [];
  try {
    const res = await fetch(`${ENDPOINT}?where[categories.slug][equals]=${categorySlug}&limit=${limit}&depth=2&sort=-publishDate`, {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    console.error(`News API Service Error (Category: ${categorySlug}):`, err);
    return [];
  }
}