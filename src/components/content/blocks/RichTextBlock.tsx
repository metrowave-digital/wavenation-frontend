import styles from './RichTextBlock.module.css'
import type { RichTextBlockData } from '../types'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function RichTextBlock({
  block,
}: {
  block: RichTextBlockData
}) {
  const anchorId = block.blockName
    ? slugify(block.blockName)
    : null

  return (
    <section
      className={styles.root}
      id={anchorId ?? undefined}
    >
      {block.blockName && (
        <h2 className={styles.sectionHeader}>
          {block.blockName}
        </h2>
      )}

      {block.content.root.children.map((p, i) => (
        <p key={i}>
          {p.children.map((c) => c.text).join('')}
        </p>
      ))}
    </section>
  )
}
