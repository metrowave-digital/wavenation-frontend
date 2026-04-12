import Link from 'next/link'
import styles from './FeaturedEditorialCategories.module.css'

const desks = [
  { slug: 'music', name: 'SOUND', color: '#00F0FF', desc: 'The sonic blueprint of urban culture.' },
  { slug: 'culture-and-politics', name: 'PULSE', color: '#FF0055', desc: 'Social commentary and political shifts.' },
  { slug: 'film-and-tv', name: 'VISION', color: '#B200FF', desc: 'Cinematic storytelling and visual arts.' },
  { slug: 'sports', name: 'ARENA', color: '#FF6600', desc: 'The intersection of competition and style.' },
  { slug: 'business-tech', name: 'CAPITAL', color: '#39FF14', desc: 'The industry engine and digital future.' },
]

export default function FeaturedEditorialCategories() {
  return (
    <section className={styles.section} aria-label="Editorial Desks">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>EDITORIAL TERMINALS</h2>
          <p className={styles.subtitle}>Select a category to filter the global feed.</p>
        </header>

        <div className={styles.deskGrid}>
          {desks.map((desk) => (
            <Link 
              key={desk.slug} 
              href={`/news/category/${desk.slug}`} 
              className={styles.deskCard}
              style={{ '--accent': desk.color } as React.CSSProperties}
            >
              <div className={styles.scanlines} />
              
              <div className={styles.cardContent}>
                <div className={styles.topRow}>
                  <span className={styles.deskIndex}>TERMINAL_{desk.name}</span>
                  <div className={styles.statusDot} />
                </div>
                <h3 className={styles.deskName}>{desk.name}</h3>
                <p className={styles.deskDesc}>{desk.desc}</p>
                <div className={styles.footerRow}>
                  <span className={styles.accessLink}>ENTER DESK &rarr;</span>
                </div>
              </div>
              
              <div className={styles.glow} />
              <div className={styles.accentBar} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}