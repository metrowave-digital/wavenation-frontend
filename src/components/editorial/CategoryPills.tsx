import styles from './CategoryPills.module.css'

interface Category {
  id: number | string
  name: string
  slug: string
}

export function CategoryPills({
  categories,
}: {
  categories?: Category[] | null
}) {
  if (!categories?.length) return null

  return (
    <div className={styles.root}>
      {categories.map(cat => (
        <span key={cat.id} className={styles.pill}>
          {cat.name}
        </span>
      ))}
    </div>
  )
}
