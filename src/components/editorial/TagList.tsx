import styles from './TagList.module.css'

interface Tag {
  id: number | string
  label: string
  slug: string
}

export function TagList({
  tags,
}: {
  tags?: Tag[] | null
}) {
  if (!tags?.length) return null

  return (
    <div className={styles.root}>
      {tags.map(tag => (
        <span key={tag.id} className={styles.tag}>
          #{tag.label}
        </span>
      ))}
    </div>
  )
}
