/* ======================================================
   Media & Assets
====================================================== */
export interface MediaSize {
  url: string | null;
  width?: number | null;
  height?: number | null;
  filename?: string | null;
  filesize?: number | null;
  mimeType?: string | null;
}

export interface MediaAsset {
  id: string | number;
  url: string;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  sizes?: {
    hero?: MediaSize;
    card?: MediaSize;
    thumb?: MediaSize;
    square?: MediaSize;
  };
}

/* ======================================================
   Taxonomy (Categories & Tags)
====================================================== */
export interface Category {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: number | string;
  label: string;
  slug: string;
}

/* ======================================================
   Lexical Rich Text
====================================================== */
export interface LexicalNode {
  type: string;
  text?: string;
  format?: number | string;
  style?: string;
  mode?: string;
  detail?: number;
  children?: LexicalNode[];
  direction?: string | null;
  indent?: number;
  version?: number;
}

export interface LexicalRoot {
  root: {
    type: string;
    children: LexicalNode[];
    direction?: string | null;
    format?: string;
    indent?: number;
    version?: number;
  };
}

/* ======================================================
   Content Blocks
====================================================== */
export interface ContentBlock {
  id: string;
  blockType: 'richText' | 'video' | 'image';
  blockName?: string | null;
  
  // For 'richText' blocks
  content?: LexicalRoot;
  dropCap?: boolean;
  
  // For 'video' blocks
  sourceType?: string;
  provider?: string;
  url?: string;
  caption?: string | null;
  autoplay?: boolean;
  loop?: boolean;

  // For 'image' blocks
  image?: MediaAsset;
  layout?: 'standard' | 'wide' | 'full';
}

/* ======================================================
   Author
====================================================== */
export interface AuthorSocial {
  id: string;
  platform: string;
  url: string;
}

export interface Author {
  id: string | number;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email?: string;
  bio?: LexicalRoot;
  avatar?: MediaAsset;
  socialLinks?: AuthorSocial[];
  role?: string;
  slug: string;
}

/* ======================================================
   Main Article Interface
====================================================== */
export interface AIRanking {
  boost: number;
  decay: number;
  freshness: number;
  engagementPotential: number;
  contentDensity: number;
  aiNotes?: string;
}

export interface NewsArticle {
  id: string | number;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  publishDate: string;
  readingTime?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  reviewTier?: string;
  
  hero?: {
    image?: MediaAsset;
    caption?: string | null;
    credit?: string | null;
  };
  
  contentBlocks: ContentBlock[];
  author: Author;
  
  categories?: Category[];
  subcategories?: Category[];
  tags?: Tag[];
  
  aiRanking?: AIRanking;
}