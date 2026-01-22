/* ======================================================
   Shared Media Types
====================================================== */

export type MediaSize = {
  url: string
  width?: number
  height?: number
}

export type MediaImage = {
  url?: string
  alt?: string
  caption?: string
  credit?: string
  sizes?: {
    hero?: MediaSize
    card?: MediaSize
    square?: MediaSize
    thumb?: MediaSize
  }
}

/* ======================================================
   Block Types
====================================================== */

export type ArtistSpotlightBlockData = {
  blockType: 'artistSpotlight'
  artistName: string
  image?: MediaImage
  description?: string
  links?: {
    label: string
    url: string
  }[]
}

export type RichTextBlockData = {
  blockType: 'richText'
  blockName?: string | null
  content: unknown
}

export type PullQuoteBlockData = {
  blockType: 'pullQuote'
  quote: string
  attribution?: string
}

export type DividerBlockData = {
  blockType: 'divider'
}

export type VideoBlockData = {
  blockType: 'video'
  provider?: 'youtube'
  url?: string
  caption?: string
  blockName?: string | null
}

export type KnownContentBlock =
  | ArtistSpotlightBlockData
  | RichTextBlockData
  | PullQuoteBlockData
  | DividerBlockData
  | VideoBlockData
