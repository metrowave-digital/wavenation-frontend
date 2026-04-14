import Link from 'next/link'
import styles from './QuickAccess.module.css'

const quickAccessItems = [
  {
    href: '/listen-live',
    index: '01',
    label: 'LIVE RADIO',
    title: 'The Frequency',
    description: '24/7 live transmission. Streaming R&B, Hip-Hop, and Southern Soul straight from the studio.',
    color: '#00F0FF', // Cyan
  },
  {
    href: '/watch',
    index: '02',
    label: 'VISUALS',
    title: 'WN One (TV)',
    description: 'Cinematic programming, in-depth artist interviews, and exclusive live performances.',
    color: '#FF0055', // Magenta
  },
  {
    href: '/playlists',
    index: '03',
    label: 'CURATION',
    title: 'Sound Selection',
    description: 'Sonic architecture for every mood and lane. Hand-picked tracks defining the culture.',
    color: '#B026FF', // Purple
  },
  {
    href: '/news',
    index: '04',
    label: 'EDITORIAL',
    title: 'The Pulse',
    description: 'Breaking updates, cultural commentary, and deep-dive reporting on the voices shaping the movement.',
    color: '#39FF14', // Neon Green
  },
]

export default function QuickAccess() {
  return (
    <section className={styles.section} aria-labelledby="quick-access-title">
      {/* Background Texture */}
      <div className={styles.textureOverlay} />

      <div className={styles.container}>
        
        <div className={styles.sectionHeader}>
          <div className={styles.kickerRow}>
            <span className={styles.livePulse} />
            <p className={styles.eyebrow}>NETWORK ACCESS</p>
          </div>
          <h2 id="quick-access-title" className={styles.sectionTitle}>
            ENTER THE <span className={styles.outlineText}>ECOSYSTEM</span>
          </h2>
          <p className={styles.sectionDescription}>
            Tap into the WaveNation network. Live broadcasting, cinematic visuals, 
            and the pulse of urban culture—streaming worldwide.
          </p>
        </div>

        <div className={styles.quickGrid}>
          {quickAccessItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={styles.quickCard}
              style={{ '--hover-color': item.color } as React.CSSProperties}
            >
              {/* Studio Monitor Scanlines */}
              <div className={styles.scanlines} />
              
              <div className={styles.cardHeader}>
                <span className={styles.quickLabel}>{item.label}</span>
                <span className={styles.itemIndex}>{item.index}</span>
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
              
              <div className={styles.cardFooter}>
                <span className={styles.actionText}>INITIALIZE &rarr;</span>
              </div>
              
              {/* Animated Accent Bar */}
              <div className={styles.accentBar} />
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}