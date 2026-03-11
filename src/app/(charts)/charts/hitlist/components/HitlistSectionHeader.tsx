// app/(charts)/charts/hitlist/components/HitlistSectionHeader.tsx

import styles from './HitlistSectionHeader.module.css'

type Props = {
  eyebrow?: string
  title: string
  description?: string
}

export function HitlistSectionHeader({ eyebrow, title, description }: Props) {
  return (
    <div className={styles.header}>
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  )
}