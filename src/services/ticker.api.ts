export interface NewsTickerItem {
  id: string;
  label: string;
  href: string;
  isBreaking: boolean;
}

export interface NewsTickerSettings {
  id: number;
  defaultLabel: string;
  isCrisisMode: boolean;
  manualInjects: NewsTickerItem[];
}

export async function getTickerSettings(): Promise<NewsTickerSettings | null> {
  try {
    const res = await fetch('https://wavenation.media/api/globals/news-ticker-settings', {
      next: { revalidate: 60, tags: ['ticker-settings'] },
    });
    if (!res.ok) throw new Error('Failed to fetch ticker settings');
    return await res.json();
  } catch (error) {
    console.error('Ticker Settings Error:', error);
    return null;
  }
}