import type { Metadata } from 'next'
import styles from './ArtistSpotlight.module.css'

export const metadata: Metadata = {
  title: 'Artist Spotlight | WaveNation',
  description: 'In-depth cinematic profiles of the artists shaping the culture.',
}

export default function ArtistSpotlightLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.spotlightWrapper}>
      <div className={styles.textureOverlay} />
      {children}
    </div>
  )
}