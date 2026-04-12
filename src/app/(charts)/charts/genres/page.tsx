import Link from 'next/link'
import styles from './GenresLandingPage.module.css'
import { ALL_GENRES } from './components/genre.config'
import { Cpu, Music4, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Genre Charts | WaveNation',
  description:
    'Explore WaveNation genre charts across R&B / Soul, Hip-Hop, Southern Soul, Gospel, and House.',
}

export default function GenresLandingPage() {
  return (
    <main className={styles.page}>
      {/* =========================================
          COMMAND DECK HERO
      ========================================= */}
      <header className={styles.hero}>
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.sysBreadcrumb}>
            <Cpu size={12} className={styles.sysIcon} />
            <span>WN.SYSTEM {'//'} CHARTS {'//'} GENRE_DIRECTORIES</span>
          </div>
          
          <h1 className={styles.title}>GENRE_CHARTS</h1>
          <p className={styles.description}>
            Explore weekly genre-focused chart ecosystems. Initialize regional, cultural, and stylistic tracking nodes across the WaveNation network.
          </p>
        </div>
      </header>

      {/* =========================================
          DATA NODE GRID
      ========================================= */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {ALL_GENRES.map((genre) => (
            <Link
              key={genre.slug}
              href={`/charts/genres/${genre.slug}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <span className={styles.eyebrow}>{genre.eyebrow.toUpperCase()}</span>
                <Music4 size={16} className={styles.cardIcon} />
              </div>
              
              <div className={styles.cardBody}>
                <strong className={styles.cardTitle}>{genre.title}</strong>
                <p className={styles.cardDescription}>{genre.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.footerText}>INITIALIZE_INDEX</span>
                <ArrowRight size={14} className={styles.footerIcon} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}