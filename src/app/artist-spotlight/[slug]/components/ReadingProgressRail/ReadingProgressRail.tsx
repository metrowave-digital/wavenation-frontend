'use client'

import { useEffect, useRef } from 'react'
import styles from './ReadingProgressRail.module.css'

/* ======================================================
   Types
====================================================== */

export interface SpotlightSection {
  id: string
  label: string
}

interface Props {
  sections: SpotlightSection[]
  activeId: string | null
  onActiveChange: (id: string) => void
  onComplete?: () => void
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const headerOffset = 96 // match your sticky header height
  const elementPosition =
    el.getBoundingClientRect().top + window.scrollY

  const offsetPosition = elementPosition - headerOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}

/* ======================================================
   Component
====================================================== */

export function ReadingProgressRail({
  sections,
  activeId,
  onActiveChange,
  onComplete,
}: Props) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibleIdsRef = useRef<Set<string>>(new Set())
  const completedRef = useRef(false)

  useEffect(() => {
    if (!sections.length) return

    observerRef.current?.disconnect()
    visibleIdsRef.current.clear()
    completedRef.current = false

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.id
          if (entry.isIntersecting) {
            visibleIdsRef.current.add(id)
          } else {
            visibleIdsRef.current.delete(id)
          }
        })

        const nextActive =
          sections.find(section =>
            visibleIdsRef.current.has(section.id)
          )?.id ?? sections[0].id

        if (nextActive !== activeId) {
          onActiveChange(nextActive)
        }

        // ✅ Reading complete detection
        const lastId = sections[sections.length - 1]?.id
        if (
          lastId &&
          visibleIdsRef.current.has(lastId) &&
          !completedRef.current
        ) {
          completedRef.current = true
          onComplete?.()
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0,
      }
    )

    observerRef.current = observer

    sections.forEach(section => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [sections, activeId, onActiveChange, onComplete])

  if (!sections.length) return null

  return (
    <nav
      className={styles.rail}
      aria-label="Article contents"
    >
      <span className={styles.label}>Contents</span>

      <ul className={styles.list}>
        {sections.map(section => {
          const isActive = section.id === activeId

          return (
            <li key={section.id}>
              <a
  href={`#${section.id}`}
  className={isActive ? styles.active : undefined}
  aria-current={isActive ? 'true' : undefined}
  onClick={(e) => {
    e.preventDefault()
    onActiveChange(section.id)
    scrollToSection(section.id)
  }}
>
                <span className={styles.dot} />
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
