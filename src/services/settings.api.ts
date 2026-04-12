export interface Media {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  defaultSeoDescription: string;
  address: string;
  phone: string;
  email: string;
  logoLight?: Media;
  logoDark?: Media;
  // --- Added missing icon fields ---
  favicon?: Media;
  appleTouchIcon?: Media;
  // ---------------------------------
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
}

/**
 * Fetches global site settings from Payload CMS.
 * Uses Next.js Cache Tags for on-demand revalidation.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch('https://wavenation.media/api/globals/site-settings', {
      next: { revalidate: 600, tags: ['site-settings'] },
    })
    
    if (!res.ok) {
      console.warn(`⚠️ Settings API returned ${res.status}`);
      return null;
    }
    
    return await res.json()
  } catch (error) {
    console.error('❌ Settings Fetch Error:', error)
    return null;
  }
}