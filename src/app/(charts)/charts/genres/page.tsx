// src/app/(charts)/charts/genres/page.tsx

import Link from 'next/link'
import styles from './GenresLandingPage.module.css'
import { ALL_GENRES } from './components/genre.config'
import { GenreSectionHeader } from './components/GenreSectionHeader'

export const metadata = {
  title: 'Genre Charts | WaveNation',
  description:
    'Explore WaveNation genre charts across R&B / Soul, Hip-Hop, Southern Soul, Gospel, and House.',
}

export default function GenresLandingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <GenreSectionHeader
          eyebrow="WaveNation charts"
          title="Genre charts"
          description="Explore weekly genre-focused chart ecosystems across R&B / Soul, Hip-Hop, Southern Soul, Gospel, and House."
        />

        <div className={styles.grid}>
          {ALL_GENRES.map((genre) => (
            <Link
              key={genre.slug}
              href={`/charts/genres/${genre.slug}`}
              className={styles.card}
            >
              <span className={styles.eyebrow}>{genre.eyebrow}</span>
              <strong className={styles.title}>{genre.title}</strong>
              <p className={styles.description}>{genre.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}