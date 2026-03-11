import Link from 'next/link'
import styles from './FeaturedEditorialCategories.module.css'

type CategoryLink = {
  label: string
  href: string
  description: string
  eyebrow: string
  glyph: string
  tone: 'music' | 'film' | 'culture' | 'business' | 'sports'
}

const categoryLinks: CategoryLink[] = [
  {
    label: 'Music',
    href: '/news/music',
    description: 'The latest in artist news, charts, exclusive interviews, releases, and the records that move culture.',
    eyebrow: 'Sound & Culture',
    glyph: '♪',
    tone: 'music',
  },
  {
    label: 'Film & TV',
    href: '/news/film-tv',
    description: 'Premieres, streaming updates, industry trends, talent spotlights, and visual storytelling highlights.',
    eyebrow: 'Screen & Story',
    glyph: '◉',
    tone: 'film',
  },
  {
    label: 'Culture & Politics',
    href: '/news/culture-politics',
    description: 'Engaging public conversations, civic impact, identity narratives, thoughtful commentary, and people-centered reporting.',
    eyebrow: 'Society & Power',
    glyph: '◆',
    tone: 'culture',
  },
  {
    label: 'Business & Technology',
    href: '/news/business-technology',
    description: 'Insights on platforms, strategy, innovation, the creator economy, and the business driving media forward.',
    eyebrow: 'Growth & Innovation',
    glyph: '⬢',
    tone: 'business',
  },
  {
    label: 'Sports',
    href: '/news/sports',
    description: 'Behind-the-scenes of athlete culture, thrilling competition, major performances, and stories beyond the scoreboard.',
    eyebrow: 'Competition & Impact',
    glyph: '▲',
    tone: 'sports',
  },
]

function getToneClasses(tone: CategoryLink['tone']) {
  switch (tone) {
    case 'music':
      return {
        cardTone: styles.musicTone,
        chipTone: styles.musicChip,
      }
    case 'film':
      return {
        cardTone: styles.filmTone,
        chipTone: styles.filmChip,
      }
    case 'culture':
      return {
        cardTone: styles.cultureTone,
        chipTone: styles.cultureChip,
      }
    case 'business':
      return {
        cardTone: styles.businessTone,
        chipTone: styles.businessChip,
      }
    case 'sports':
      return {
        cardTone: styles.sportsTone,
        chipTone: styles.sportsChip,
      }
    default:
      return {
        cardTone: styles.defaultTone,
        chipTone: styles.defaultChip,
      }
  }
}

export default function FeaturedEditorialCategories() {
  return (
    <section className={styles.section} aria-labelledby="featured-categories-title">
      <div className={styles.panel}>
        <div className={styles.headerRow}>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>Editorial Lanes</p>
            <h2 id="featured-categories-title" className={styles.title}>
              Explore Stories by Category
            </h2>
            <p className={styles.description}>
              Navigate the newsroom by desk and dive straight into the stories shaping the conversation across WaveNation.
            </p>
          </div>

          <div className={styles.headerMeta} aria-label="Editorial category summary">
            <div className={styles.metaPill}>
              <span className={styles.metaValue}>5</span>
              <span className={styles.metaLabel}>Desks</span>
            </div>
            <div className={styles.metaPill}>
              <span className={styles.metaValue}>Daily</span>
              <span className={styles.metaLabel}>Flow</span>
            </div>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {categoryLinks.map((item) => {
            const tone = getToneClasses(item.tone)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.categoryCard} ${tone.cardTone}`}
                aria-label={`${item.label}: ${item.description}`}
              >
                <span className={styles.activeBar} aria-hidden="true" />

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={`${styles.cardChip} ${tone.chipTone}`}>{item.eyebrow}</span>
                    <span className={styles.cardGlyph} aria-hidden="true">
                      {item.glyph}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{item.label}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardCta}>Explore Coverage</span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}