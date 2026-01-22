'use client'

import { useEffect, useState } from 'react'
import styles from './MobileContents.module.css'
import type { SpotlightSection } from '../ReadingProgressRail/ReadingProgressRail'

/* ======================================================
   Props
====================================================== */

interface Props {
  sections: SpotlightSection[]
  activeId: string | null
  onNavigate: (id: string) => void
}

/* ======================================================
   Component
====================================================== */

export function MobileContents({
  sections,
  activeId,
  onNavigate,
}: Props) {
  const [open, setOpen] = useState(false)

  /* --------------------------------------------------
     Lock body scroll when open
  -------------------------------------------------- */
  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!sections.length) return null

  function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const headerOffset = 96
  const elementPosition =
    el.getBoundingClientRect().top + window.scrollY

  window.scrollTo({
    top: elementPosition - headerOffset,
    behavior: 'smooth',
  })
}
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggle}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-contents-sheet"
      >
        Article Contents
      </button>

      {open && (
        <div className={styles.overlay}>
          <div
            id="mobile-contents-sheet"
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Article contents"
          >
            <header className={styles.header}>
              <span className={styles.title}>
                Contents
              </span>

              <button
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close contents"
              >
                ✕
              </button>
            </header>

            <ul className={styles.list}>
              {sections.map((section) => {
                const isActive = section.id === activeId

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={
                        isActive ? styles.active : undefined
                      }
                      aria-current={
                        isActive ? 'true' : undefined
                      }
                      onClick={(e) => {
  e.preventDefault()
  onNavigate(section.id)
  scrollToSection(section.id)
  setOpen(false)
}}
                    >
                      {section.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
