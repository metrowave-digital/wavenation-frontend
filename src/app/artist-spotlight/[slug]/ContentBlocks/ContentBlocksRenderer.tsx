'use client'

import {
  ArtistSpotlightBlock,
  RichTextBlock,
  PullQuoteBlock,
  VideoBlock,
  DividerBlock,
} from './Blocks'

/* ======================================================
   Shared Media Types
====================================================== */

type MediaSize = {
  url: string
  width?: number
  height?: number
}

type MediaImage = {
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
   Block Types (STRICT & ALIGNED WITH COMPONENTS)
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

/* ======================================================
   Props
====================================================== */

interface Props {
  blocks?: unknown[]
}

/* ======================================================
   Type Guard (CMS Boundary)
====================================================== */

function isKnownContentBlock(
  block: unknown
): block is KnownContentBlock {
  if (!block || typeof block !== 'object') return false

  const type = (block as { blockType?: unknown }).blockType

  return (
    type === 'artistSpotlight' ||
    type === 'richText' ||
    type === 'pullQuote' ||
    type === 'divider' ||
    type === 'video'
  )
}

/* ======================================================
   Renderer
====================================================== */

export function ContentBlocksRenderer({ blocks }: Props) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <div className="content-blocks">
      {blocks
        .filter(isKnownContentBlock)
        .map((block, index) => {
          switch (block.blockType) {
            case 'artistSpotlight':
              return (
                <ArtistSpotlightBlock
                  key={index}
                  block={block}
                />
              )

            case 'richText':
              return (
                <RichTextBlock
                  key={index}
                  block={block}
                />
              )

            case 'pullQuote':
              return (
                <PullQuoteBlock
                  key={index}
                  block={block}
                />
              )

            case 'divider':
              return <DividerBlock key={index} />

            case 'video':
              return (
                <VideoBlock
                  key={index}
                  block={block}
                />
              )

            default:
              return null
          }
        })}
    </div>
  )
}
