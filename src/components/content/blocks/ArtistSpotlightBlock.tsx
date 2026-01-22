'use client'

import Image from 'next/image'
import styles from './ArtistSpotlightBlock.module.css'
import type { ArtistSpotlightBlockData } from '../types'

export function ArtistSpotlightBlock({
  block,
}: {
  block: ArtistSpotlightBlockData
}) {
  const { artistName, image, description, links } = block

  return (
    <section className={styles.block}>
      {/* ===============================
         ARTIST HEADER
      =============================== */}
      <div className={styles.header}>
        {image?.url && (
          <div className={styles.image}>
            <Image
              src={image.url}
              alt={image.alt ?? artistName}
              fill
              unoptimized
            />
          </div>
        )}

        <div className={styles.meta}>
          <span className={styles.kicker}>
            Artist Spotlight
          </span>
          <h3 className={styles.name}>
            {artistName}
          </h3>
        </div>
      </div>

      {/* ===============================
         DESCRIPTION
      =============================== */}
      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      {/* ===============================
         LINKS
      =============================== */}
      {links?.length ? (
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.id}>
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
      ) : null}
    </section>
  )
}
