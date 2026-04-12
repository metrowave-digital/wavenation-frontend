import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';
const ENDPOINT = `${CMS_URL}/api/articles`;

export async function getSportsFeed(feedType: string, limit: number = 24): Promise<NewsArticle[]> {
  try {
    const baseParams = `depth=2&sort=-publishDate&status=published`;
    let filter = `where[categories.slug][equals]=sports`; 
    let fetchLimit = limit;

    switch (feedType) {
      case 'trending':
        fetchLimit = 50;
        filter = `where[categories.slug][equals]=sports`;
        break;
      case 'nba':
        filter = `where[subcategories.slug][equals]=nba`;
        break;
      case 'nfl':
        filter = `where[subcategories.slug][equals]=nfl`;
        break;
      case 'college':
        filter = `where[subcategories.slug][equals]=college-sports`;
        break;
      case 'culture':
        // Specifically for the intersection of sports, fashion, and lifestyle
        filter = `where[subcategories.slug][equals]=sports-culture`;
        break;
      case 'all':
      default:
        filter = `where[categories.slug][equals]=sports`;
        break;
    }

    const finalUrl = `${ENDPOINT}?${filter}&limit=${fetchLimit}&${baseParams}`;
    const res = await fetch(finalUrl, { cache: 'no-store' });

    if (!res.ok) return [];
    const data = await res.json();
    let articles = data.docs || [];

    if (feedType === 'trending') {
      articles = [...articles].sort((a, b) => 
        (b.aiRanking?.boost || 0) - (a.aiRanking?.boost || 0)
      ).slice(0, 10);
    }

    return articles;
  } catch (err) {
    console.error(`Sports Feed API Error:`, err);
    return [];
  }
}