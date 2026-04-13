import Link from 'next/link'
import Image from 'next/image'
import { getPlaylists } from '@/services/playlists.api'
import { Disc3, ArrowRight } from 'lucide-react'
import styles from './HomePlaylists.module.css'

export default async function HomePlaylists() {
  const playlists = await getPlaylists(4);
  if (!playlists || playlists.length === 0) return null;

  return (
    <section className={styles.wrapper} aria-labelledby="playlists-title">
      <div className={styles.container}>
        <div className={styles.sectionHeaderRow}>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>Curated Audio</p>
            <h2 id="playlists-title" className={styles.sectionTitle}>
              THE SOUND OF WAVENATION
            </h2>
          </div>
          <Link href="/playlists" className={styles.sectionLink}>
            BROWSE ALL <ArrowRight size={16} className={styles.linkIcon} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {playlists.map((playlist) => {
            const coverUrl = playlist.coverImage?.sizes?.thumb?.url || playlist.coverImage?.url || '/images/fallback-square.jpg';
            return (
              <Link key={playlist.id} href={`/playlists/${playlist.slug}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image src={coverUrl} alt={playlist.title} fill className={styles.coverImg} sizes="(max-width: 768px) 100vw, 25vw" />
                  <div className={styles.overlay} aria-hidden="true"><Disc3 size={36} className={styles.playIcon} /></div>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.tag}>{playlist.playlistType || 'PLAYLIST'}</span>
                  <h3 className={styles.cardTitle}>{playlist.title}</h3>
                  <p className={styles.cardDescription}>{playlist.shortDescription}</p>
                </div>
                <div className={styles.accentBar} aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}