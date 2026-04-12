import type { Metadata } from 'next'
import styles from './ArtistSpotlight.module.css'

export const metadata: Metadata = {
  title: 'Artist Spotlight | WaveNation',
  description: 'In-depth cinematic profiles of the artists shaping the culture.',
}

export default function ArtistSpotlightLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.spotlightWrapper}>
      {/* Texture remains consistent across the desk */}
      <div className={styles.textureOverlay} />
      
      {/* If you have a Global Header component, place it here.
          We keep this layout light so the child page can 
          handle the full-bleed 85vh hero.
      */}
      
      {children}
    </div>
  )
}