import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';
const ENDPOINT = `${CMS_URL}/api/articles`;

export async function getFilmTVFeed(feedType: string, limit: number = 24): Promise<NewsArticle[]> {
  try {
    const baseParams = `depth=2&sort=-publishDate&status=published`;
    let filter = `where[categories.slug][equals]=film-and-tv`;
    let fetchLimit = limit;

    switch (feedType) {
      case 'trending':
        fetchLimit = 50;
        filter = `where[categories.slug][equals]=film-and-tv`;
        break;
      case 'reviews':
        filter = `where[subcategories.slug][equals]=reviews`;
        break;
      case 'interviews':
        filter = `where[subcategories.slug][equals]=interviews`;
        break;
      case 'streaming':
        filter = `where[subcategories.slug][equals]=streaming`;
        break;
      case 'latest':
      case 'all':
      default:
        filter = `where[categories.slug][equals]=film-and-tv`;
        break;
    }

    const finalUrl = `${ENDPOINT}?${filter}&limit=${fetchLimit}&${baseParams}`;

    const res = await fetch(finalUrl, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

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
    console.error(`Film/TV API Error:`, err);
    return [];
  }
}