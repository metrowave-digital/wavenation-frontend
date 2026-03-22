import Link from 'next/link'
import { Headphones, PlayCircle, Newspaper, ListMusic } from 'lucide-react'
import type { FeaturedAction } from './mobileMenu.utils'
import styles from './MobileMenuFeatured.module.css'

interface MobileMenuFeaturedProps {
  actions: FeaturedAction[]
}

function getActionIcon(label: string) {
  switch (label) {
    case 'Listen Live':
      return Headphones
    case 'Watch Live':
      return PlayCircle
    case 'Latest News':
      return Newspaper
    case 'Playlists':
      return ListMusic
    default:
      return PlayCircle
  }
}

export function MobileMenuFeatured({ actions }: MobileMenuFeaturedProps) {
  if (!actions.length) return null

  return (
    <section className={styles.section} aria-label="Quick access">
      <div className={styles.grid}>
        {actions.map(action => {
          const Icon = getActionIcon(action.label)

          return (
            <Link key={action.href} href={action.href} className={styles.card}>
              <span className={styles.eyebrow}>{action.eyebrow}</span>

              <div className={styles.row}>
                <span className={styles.iconWrap}>
                  <Icon className={styles.icon} aria-hidden />
                </span>
                <span className={styles.label}>{action.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}