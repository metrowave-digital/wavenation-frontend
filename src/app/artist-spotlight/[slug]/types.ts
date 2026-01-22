/* ======================================================
   Shared Types (Server + Client)
   WaveNation Media
====================================================== */

/* ======================================================
   AUTHORS
====================================================== */

/**
 * Article Author
 * ----------------
 * This is the CMS USER attached directly to an article.
 * It is NOT the public-facing contributor profile.
 */
export interface ArticleAuthor {
  id: number
  displayName: string
  roles?: string[]
  avatar?: {
    url: string
    sizes?: {
      square?: { url?: string }
    }
  }
}

/**
 * Contributor Author
 * ------------------
 * Normalized author used by Byline + UI components
 */
export interface ContributorAuthor {
  id: string
  slug?: string
  displayName: string
  role?: string | null
  bio?: string | null
  verified?: boolean
  avatar?: {
    url: string
    alt?: string | null
  }
  socials?: {
    platform: string
    url: string
  }[]
}

/* ======================================================
   TAXONOMY
====================================================== */

export interface Category {
  name: string
  slug: string
}

export interface Tag {
  label: string
  slug: string
}

/* ======================================================
   MEDIA
====================================================== */

export interface MediaImage {
  url: string
  alt?: string | null
  caption?: string | null
  credit?: string | null
  sizes?: {
    hero?: { url?: string | null }
    card?: { url?: string | null }
    thumb?: { url?: string | null }
    square?: { url?: string | null }
  }
}

/* ======================================================
   RELATED ENTITIES
====================================================== */

export interface Album {
  slug: string
  title: string
  primaryArtist: string
  releaseDate?: string | null
  coverArt?: MediaImage | null
  tracks?: {
    id: string
    title: string
    artist?: string | null
  }[] | null
}

export interface Show {
  title: string
  slug: string
  isPodcast?: boolean
  coverArt?: MediaImage | null
}

/* ======================================================
   CONTENT BLOCKS
====================================================== */

/**
 * Base shape for all content blocks coming from Payload.
 * This avoids `any` while keeping flexibility.
 */
export interface ContentBlockBase {
  id: string
  blockType: string
  blockName?: string | null
}

/* ======================================================
   HERO
====================================================== */

export interface HeroImage {
  url: string
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null }
  }
}

/* ======================================================
   ARTIST SPOTLIGHT ARTICLE
====================================================== */

export interface ArtistSpotlightArticle {
  slug: string
  title: string
  subtitle?: string | null
  publishDate?: string | null
  readingTime?: string | null

  author?: ArticleAuthor

  hero?: {
    image?: HeroImage
  }

  categories?: Category[] | null
  tags?: Tag[] | null

  relatedAlbum?: Album | null
  relatedShow?: Show | null

  contentBlocks?: ContentBlockBase[] | null
}
