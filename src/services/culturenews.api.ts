import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';
const ENDPOINT = `${CMS_URL}/api/articles`;

export async function getCultureFeed(feedType: string, limit: number = 24): Promise<NewsArticle[]> {
  try {
    const baseParams = `depth=2&sort=-publishDate&status=published`;
    let filter = `where[categories.slug][equals]=culture-and-politics`;
    let fetchLimit = limit;

    switch (feedType) {
      case 'trending':
        fetchLimit = 50;
        filter = `where[categories.slug][equals]=culture-and-politics`;
        break;
      case 'us-news':
        filter = `where[subcategories.slug][equals]=u-s-politics`;
        break;
      case 'travel':
        filter = `where[subcategories.slug][equals]=travel`;
        break;
      case 'education':
        filter = `where[subcategories.slug][equals]=education`;
        break;
      case 'fashion':
        filter = `where[subcategories.slug][equals]=fashion`;
        break;
      case 'all':
      default:
        filter = `where[categories.slug][equals]=culture-and-politics`;
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
    console.error(`Culture Feed API Error:`, err);
    return [];
  }
}