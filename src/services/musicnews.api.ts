import type { NewsArticle } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';
const ENDPOINT = `${CMS_URL}/api/articles`;

export async function getMusicFeed(feedType: string, limit: number = 24): Promise<NewsArticle[]> {
  try {
    const baseParams = `depth=2&sort=-publishDate`;
    let filter = `where[categories.slug][equals]=music`; 
    let fetchLimit = limit;

    switch (feedType) {
      case 'trending':
        fetchLimit = 50; 
        filter = `where[categories.slug][equals]=music`;
        break;

      case 'new':
        // STRICTLY: new-music, new-releases, or new-releases-1
        filter = `where[or][0][subcategories.slug][equals]=new-releases` +
                 `&where[or][1][subcategories.slug][equals]=new-music` +
                 `&where[or][2][subcategories.slug][equals]=new-releases-1`;
        break;

      case 'artists':
        filter = `where[subcategories.slug][equals]=artist-profiles`;
        break;

      case 'industry':
        filter = `where[subcategories.slug][in][0]=music-industry` +
                 `&where[subcategories.slug][in][1]=business` +
                 `&where[subcategories.slug][in][2]=label-news`;
        break;

      case 'all':
      case 'latest':
      default:
        filter = `where[categories.slug][equals]=music`;
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
    console.error(`Music Feed Exception (${feedType}):`, err);
    return [];
  }
}