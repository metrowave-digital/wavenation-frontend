import type { ReactNode } from 'react'
import Link from 'next/link'
import styles from './NewsSection.module.css'

interface NewsSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function NewsSection({ title, description, children }: NewsSectionProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>

        <Link className={styles.link} href="/news">
          View all
        </Link>
      </div>

      <div className={styles.content}>{children}</div>
    </section>
  )
}