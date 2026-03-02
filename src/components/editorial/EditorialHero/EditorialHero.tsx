import Link from 'next/link'
import styles from './EditorialHero.module.css'

type HeroVariant = 'charts' | 'article' | 'tv'

type HeroAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

interface EditorialHeroProps {
  variant?: HeroVariant
  eyebrow: string
  title: React.ReactNode
  lede?: string
  weekStamp?: string
  pills?: string[]
  actions?: HeroAction[]
}

export function EditorialHero({
  variant = 'charts',
  eyebrow,
  title,
  lede,
  weekStamp,
  pills = [],
  actions = [],
}: EditorialHeroProps) {
  const hasMeta = Boolean(weekStamp) || pills.length > 0

  return (
    <header className={`${styles.hero} ${styles[variant]}`}>
      {/* Decorative layers */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.kickerRow}>
            <span className={styles.eyebrow}>{eyebrow}</span>

            {weekStamp && (
              <span className={styles.weekStamp} aria-label="Week">
                {weekStamp}
              </span>
            )}
          </div>

          {hasMeta && pills.length > 0 && (
            <ul className={styles.pills} aria-label="Editorial attributes">
              {pills.map((pill) => (
                <li key={pill} className={styles.pill}>
                  {pill}
                </li>
              ))}
            </ul>
          )}

          <h1 className={styles.title}>{title}</h1>

          {lede && <p className={styles.lede}>{lede}</p>}

          {actions.length > 0 && (
            <div className={styles.actions} aria-label="Hero actions">
              {actions.map((action) => {
                const isSecondary = action.variant === 'secondary'
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`${styles.cta} ${
                      isSecondary ? styles.ctaSecondary : styles.ctaPrimary
                    }`}
                  >
                    <span className={styles.ctaLabel}>{action.label}</span>
                    <span className={styles.ctaIcon} aria-hidden="true">
                      →
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}