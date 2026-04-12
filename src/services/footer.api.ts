import { FooterConfigResponse } from '@/components/layout/Footer/footer.types';

export async function getFooterData(): Promise<FooterConfigResponse | null> {
  try {
    const res = await fetch('https://wavenation.media/api/globals/footer-config', {
      next: { revalidate: 300, tags: ['footer-config'] },
    });

    if (!res.ok) throw new Error('Failed to fetch footer');

    return await res.json();
  } catch (error) {
    console.error('Footer Fetch Error:', error);
    return null;
  }
}