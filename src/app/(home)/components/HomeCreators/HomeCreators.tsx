import Link from 'next/link'
import { Zap, UploadCloud, ArrowRight } from 'lucide-react'
import styles from './HomeCreators.module.css'

const creatorFeatures = [
  { 
    title: 'CREATOR HUB', 
    icon: <Zap size={24} />,
    description: 'A growing space for podcasters, artists, filmmakers, DJs, and culture builders to distribute their signals.', 
    href: '/creator-hub', 
    label: 'ENTER THE HUB' 
  },
  { 
    title: 'SUBMIT AUDIO', 
    icon: <UploadCloud size={24} />,
    description: 'Independent artists can submit music directly to our programming team for editorial and playlist consideration.', 
    href: '/submit', 
    label: 'UPLOAD NOW' 
  },
]

export default function HomeCreators() {
  return (
    <section className={styles.section} aria-labelledby="creator-title">
      <div className={styles.creatorPanel}>
        {/* Decorative Backgrounds */}
        <div className={styles.panelOverlay} aria-hidden="true" />
        <div className={styles.techGrid} aria-hidden="true" />
        
        <div className={styles.grid}>
          {/* Left Side Copy */}
          <div className={styles.creatorCopy}>
            <p className={styles.eyebrow}>PLATFORM INFRASTRUCTURE</p>
            <h2 id="creator-title" className={styles.sectionTitle}>BUILT TO ELEVATE</h2>
            <div className={styles.divider} aria-hidden="true" />
            <p className={styles.sectionDescription}>
              WaveNation is more than a station. It is a growing ecosystem for independent artists, podcasters, DJs, filmmakers, and culture-forward voices. Connect to the grid.
            </p>
          </div>

          {/* Right Side Action Cards */}
          <div className={styles.creatorActions}>
            {creatorFeatures.map((item) => (
              <Link key={item.title} href={item.href} className={styles.creatorCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconBox}>{item.icon}</div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
                <p className={styles.cardDescription}>{item.description}</p>
                <div className={styles.cardFooter}>
                  {item.label} <ArrowRight size={18} className={styles.arrowIcon} />
                </div>
                <div className={styles.accentBar} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}