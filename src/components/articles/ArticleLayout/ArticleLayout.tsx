import type { ReactNode } from 'react'
import styles from './ArticleLayout.module.css'

type Author = {
  name: string
  href?: string
}

interface ArticleLayoutProps {
  hero: ReactNode
  children: ReactNode

  author?: Author
  publishedAt?: string
  readTime?: string

  sidebar?: ReactNode
  sidebarAd?: ReactNode
  newsletterCta?: ReactNode
  footerAd?: ReactNode
}

export function ArticleLayout({
  hero,
  children,
  author,
  publishedAt,
  readTime,
  sidebar,
  sidebarAd,
  newsletterCta,
  footerAd,
}: ArticleLayoutProps) {
  const hasMeta = Boolean(author || publishedAt || readTime)

  return (
    <article className={styles.article}>
      {/* ================= HERO ================= */}
      {hero}

      {/* ================= META (Sticky Glass) ================= */}
      {hasMeta && (
        <div className={styles.metaWrap}>
          <div className={styles.metaBar} aria-label="Article metadata">
            {author && (
              <span className={styles.author}>
                <span className={styles.by}>By</span>{' '}
                {author.href ? (
                  <a href={author.href} className={styles.authorLink}>
                    {author.name}
                  </a>
                ) : (
                  <span className={styles.authorName}>{author.name}</span>
                )}
              </span>
            )}

            {(publishedAt || readTime) && (
              <span className={styles.dot} aria-hidden="true">
                •
              </span>
            )}

            {publishedAt && (
              <time className={styles.date}>{publishedAt}</time>
            )}

            {readTime && (
              <>
                <span className={styles.dot} aria-hidden="true">
                  •
                </span>
                <span className={styles.readTime}>{readTime}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= GRID ================= */}
      <div className={styles.shell}>
        <div className={styles.grid}>
          {/* ===== CONTENT ===== */}
          <main className={styles.content}>
            <div className={styles.prose}>{children}</div>

            {newsletterCta && (
              <section className={styles.wideBlock}>
                {newsletterCta}
              </section>
            )}

            {footerAd && (
              <section className={styles.footerAd}>
                {footerAd}
              </section>
            )}
          </main>

          {/* ===== SIDEBAR ===== */}
          {(sidebar || sidebarAd) && (
            <aside className={styles.sidebar} aria-label="Sidebar">
              <div className={styles.sidebarInner}>
                {sidebar}

                {sidebarAd && (
                  <div className={styles.sidebarAd}>
                    {sidebarAd}
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  )
}