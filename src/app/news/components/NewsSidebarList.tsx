import styles from './NewsSidebarList.module.css'

interface SidebarItem {
  title: string
  href: string
  meta?: string
}

interface NewsSidebarListProps {
  title: string
  description?: string
  items: SidebarItem[]
}

export function NewsSidebarList({ title, description, items }: NewsSidebarListProps) {
  return (
    <section className={styles.panel} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      <div className={styles.list}>
        {items.map((item, index) => (
          <article key={item.href} className={styles.item}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <div className={styles.body}>
              {item.meta ? <span className={styles.meta}>{item.meta}</span> : null}
              <h3 className={styles.itemTitle}>
                <a href={item.href}>{item.title}</a>
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}