/* ======================================================
   Lexical (read-only)
====================================================== */

export interface LexicalTextNode {
  text: string
}

export interface LexicalParagraphNode {
  type: 'paragraph'
  children: LexicalTextNode[]
}

export interface LexicalRoot {
  children: LexicalParagraphNode[]
}

/* ======================================================
   Base Block (shared)
====================================================== */

interface BaseBlock {
  id: string
  blockType: string
  blockName?: string | null
}

/* ======================================================
   Blocks
====================================================== */

export interface RichTextBlockData extends BaseBlock {
  blockType: 'richText'
  content: {
    root: {
      children: Array<{
        type: string
        children: Array<{
          text: string
        }>
      }>
    }
  }
}

export interface ImageBlockData extends BaseBlock {
  blockType: 'image'
  image: {
    url: string
    alt?: string | null
  }
  caption?: string | null
  credit?: string | null
  fullWidth?: boolean | null
}

export interface PullQuoteBlockData extends BaseBlock {
  blockType: 'pullQuote'
  quote: string
  attribution?: string | null
}

export interface DividerBlockData extends BaseBlock {
  blockType: 'divider'
}

export interface TimelineItem {
  date?: string | null
  headline: string
  description?: string | null
  highlight?: boolean | null
}

export interface TimelineBlockData extends BaseBlock {
  blockType: 'timeline'
  title?: string | null
  style?: 'vertical' | 'horizontal' | 'compact'
  items: TimelineItem[]
}

export interface VideoBlockData extends BaseBlock {
  blockType: 'video'

  provider?: 'youtube' | 'vimeo' | 'native' | null
  url?: string | null

  file?: {
    url: string
    mimeType?: string | null
  } | null

  caption?: string | null

  aspectRatio?: '16:9' | '4:5' | '1:1' | null
  autoplay?: boolean | null
  muted?: boolean | null
  controls?: boolean | null
}

export interface ArtistSpotlightLink {
  id: string
  label: string
  url: string
}

export interface ArtistSpotlightBlockData extends BaseBlock {
  blockType: 'artistSpotlight'

  artistName: string

  image?: {
    url: string
    alt?: string | null
  } | null

  description?: string | null

  links?: ArtistSpotlightLink[] | null
}

/* ======================================================
   Union
====================================================== */

export type ContentBlock =
  | RichTextBlockData
  | ImageBlockData
  | PullQuoteBlockData
  | DividerBlockData
  | TimelineBlockData
  | VideoBlockData
  | ArtistSpotlightBlockData
