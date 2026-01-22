'use client'

import styles from './RichTextBlock.module.css'

/* ======================================================
   Types
====================================================== */

export interface RichTextBlockData {
  blockType: 'richText'
  blockName?: string | null
  content: unknown
}

interface Props {
  block: RichTextBlockData
}

/* ======================================================
   Component
====================================================== */

export function RichTextBlock({ block }: Props) {
  const html = serializeLexicalToHtml(block.content)

  if (!html) return null

  return (
    <section className={styles.richText}>
      {block.blockName && (
        <h2 className={styles.heading}>
          {block.blockName}
        </h2>
      )}

      <div
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

/* ======================================================
   Lexical → HTML (SAFE, NO any)
====================================================== */

type LexicalTextNode = {
  type: 'text'
  text: string
}

type LexicalParagraphNode = {
  type: 'paragraph'
  children?: LexicalTextNode[]
}

type LexicalRoot = {
  root?: {
    children?: LexicalParagraphNode[]
  }
}

function serializeLexicalToHtml(
  content: unknown
): string {
  // Case 1: Already HTML
  if (typeof content === 'string') {
    return content
  }

  // Case 2: Lexical JSON
  if (
    typeof content === 'object' &&
    content !== null &&
    'root' in content
  ) {
    const root = (content as LexicalRoot).root
    if (!root?.children) return ''

    return root.children
      .map((node) => {
        if (node.type !== 'paragraph' || !node.children) {
          return ''
        }

        const text = node.children
          .filter(
            (child): child is LexicalTextNode =>
              child.type === 'text' &&
              typeof child.text === 'string'
          )
          .map((child) => escapeHtml(child.text))
          .join('')

        return text ? `<p>${text}</p>` : ''
      })
      .join('')
  }

  return ''
}

/* ======================================================
   Utils
====================================================== */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
