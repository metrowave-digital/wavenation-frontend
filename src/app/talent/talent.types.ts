export interface Talent {
  id: string | number;
  displayName: string;
  slug: string;
  role?: string;
  shortBio: string;
  isFeatured?: boolean;
  mediaAssets?: {
    headshot?: {
      url: string;
      alt?: string;
    };
  };
}