import React from 'react'
import styles from './RichTextBlock.module.css'
import type { RichTextBlockData } from '../types'

/* ======================================================
   Lexical Node Types (Payload Rich Text)
====================================================== */

type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
}

type LexicalLineBreakNode = {
  type: 'linebreak'
}

type LexicalParagraphNode = {
  type: 'paragraph'
  children: LexicalInlineNode[]
}

type LexicalHeadingNode = {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4'
  children: LexicalInlineNode[]
}

type LexicalListItemNode = {
  type: 'listitem'
  children: LexicalInlineNode[]
}

type LexicalListNode = {
  type: 'list'
  listType: 'bullet' | 'number'
  children: LexicalListItemNode[]
}

type LexicalInlineNode =
  | LexicalTextNode
  | LexicalLineBreakNode

type LexicalBlockNode =
  | LexicalParagraphNode
  | LexicalHeadingNode
  | LexicalListNode
  | LexicalListItemNode

/* ======================================================
   Utils
====================================================== */

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/* ======================================================
   Renderers
====================================================== */

function renderText(
  node: LexicalInlineNode,
  key: number
): React.ReactElement {
  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  const text = node.text

  // Italic (film titles)
  if (node.format === 2) {
    return <em key={key}>{text}</em>
  }

  // Bold
  if (node.format === 1) {
    return <strong key={key}>{text}</strong>
  }

  return <span key={key}>{text}</span>
}

function renderNode(
  node: LexicalBlockNode,
  key: number
): React.ReactElement | null {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key}>
          {node.children.map(renderText)}
        </p>
      )

    case 'heading': {
      const Tag = node.tag
      return (
        <Tag key={key}>
          {node.children.map(renderText)}
        </Tag>
      )
    }

    case 'list': {
      const ListTag =
        node.listType === 'number' ? 'ol' : 'ul'

      return (
        <ListTag key={key}>
          {node.children.map((item, i) =>
            renderNode(item, i)
          )}
        </ListTag>
      )
    }

    case 'listitem':
      return (
        <li key={key}>
          {node.children.map(renderText)}
        </li>
      )

    default:
      return null
  }
}

/* ======================================================
   Component
====================================================== */

export function RichTextBlock({
  block,
}: {
  block: RichTextBlockData
}) {
  const anchorId = block.blockName
    ? slugify(block.blockName)
    : null

  // Payload JSON is structurally correct but loosely typed
  const nodes =
    block.content.root.children as unknown as LexicalBlockNode[]

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

      {nodes.map((node, i) =>
        renderNode(node, i)
      )}
    </section>
  )
}
