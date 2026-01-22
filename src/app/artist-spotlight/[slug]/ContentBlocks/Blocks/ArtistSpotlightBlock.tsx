'use client'

import Image from 'next/image'
import styles from './ArtistSpotlightBlock.module.css'

/* ======================================================
   Types (API-aligned)
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
    square?: MediaSize
    card?: MediaSize
    hero?: MediaSize
    thumb?: MediaSize
  }
}

export interface ArtistSpotlightBlockData {
  blockType: 'artistSpotlight'
  artistName: string
  image?: MediaImage
  description?: string
  links?: {
    label: string
    url: string
  }[]
}

/* ======================================================
   Component
====================================================== */

interface Props {
  block: ArtistSpotlightBlockData
}

export function ArtistSpotlightBlock({ block }: Props) {
  const imageUrl =
    block.image?.sizes?.square?.url ||
    block.image?.sizes?.card?.url ||
    block.image?.url

  return (
    <section className={styles.spotlight}>
      {imageUrl && (
        <div className={styles.imageWrap}>
          <Image
            src={imageUrl}
            alt={block.image?.alt || block.artistName}
            width={600}
            height={600}
            className={styles.image}
            priority
          />
        </div>
      )}

      <div className={styles.content}>
        <h2 className={styles.name}>{block.artistName}</h2>

        {block.description && (
          <p className={styles.description}>
            {block.description}
          </p>
        )}

        {Array.isArray(block.links) && block.links.length > 0 && (
          <ul className={styles.links}>
            {block.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {(block.image?.caption || block.image?.credit) && (
          <div className={styles.meta}>
            {block.image.caption && (
              <span>{block.image.caption}</span>
            )}
            {block.image.credit && (
              <span className={styles.credit}>
                {block.image.credit}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
