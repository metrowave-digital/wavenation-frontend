import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';
const ENDPOINT = `${CMS_URL}/api/articles`;

export async function getBusinessTechFeed(feedType: string, limit: number = 24): Promise<NewsArticle[]> {
  try {
    const baseParams = `depth=2&sort=-publishDate&status=published`;
    let filter = `where[categories.slug][equals]=business-tech`; 
    let fetchLimit = limit;

    switch (feedType) {
      case 'trending':
        fetchLimit = 50;
        filter = `where[categories.slug][equals]=business-tech`;
        break;
      case 'music-biz':
        // Intersection of Music and Business
        filter = `where[subcategories.slug][in][0]=music-industry&where[subcategories.slug][in][1]=label-news`;
        break;
      case 'creator-tips':
        filter = `where[subcategories.slug][equals]=creator-tips`;
        break;
      case 'digital-media':
        filter = `where[subcategories.slug][equals]=digital-media`;
        break;
      case 'legal':
        filter = `where[subcategories.slug][equals]=legal-and-finance`;
        break;
      case 'all':
      default:
        filter = `where[categories.slug][equals]=business-tech`;
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
    console.error(`Business Tech API Error:`, err);
    return [];
  }
}