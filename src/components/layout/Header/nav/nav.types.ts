export type NavBadge = 'none' | 'new' | 'live' | 'trending' | 'editor-pick';
export type NavAccent = 'blue' | 'magenta' | 'news' | 'brand';

export interface NavLink {
  id: string;
  label: string;
  href: string;
  badge?: NavBadge | null;
}

export interface NavColumn {
  id: string;
  label: string;
  icon?: string | null;
  links: NavLink[];
}

export interface FeaturedNav {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  href?: string | null;
  accent?: NavAccent | null;
}

export interface MainNavItem {
  id: string;
  label: string;
  href: string;
  featured?: FeaturedNav;
  columns?: NavColumn[];
}

export interface NavConfigResponse {
  id: number;
  mainNav: MainNavItem[];
  updatedAt: string;
  createdAt: string;
  globalType: string;
}