export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  label: string;
  links: FooterLink[];
}

export interface FooterConfigResponse {
  id: number;
  columns: FooterColumn[];
  legalLinks: FooterLink[];
  updatedAt: string;
  createdAt: string;
  globalType: string;
}