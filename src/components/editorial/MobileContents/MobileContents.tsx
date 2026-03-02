'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './MobileContents.module.css'

interface Section {
  id: string
  label: string
}

export function MobileContents({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const lastActiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    // Save focus + lock scroll
    lastActiveRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    // Focus close button
    closeBtnRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = prevOverflow
      lastActiveRef.current?.focus?.()
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-contents-sheet"
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          ≡
        </span>
        Contents
      </button>

      {open && (
        <div className={styles.overlay} role="presentation">
          {/* Backdrop */}
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close contents"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <section
            id="mobile-contents-sheet"
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="On this page"
          >
            <div className={styles.handle} aria-hidden="true" />

            <header className={styles.header}>
              <div className={styles.titleWrap}>
                <strong className={styles.title}>On this page</strong>
                <span className={styles.sub}>
                  Jump to a section
                </span>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </header>

            <nav className={styles.nav} aria-label="Contents">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={styles.link}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.bullet} aria-hidden="true" />
                  <span className={styles.label}>{s.label}</span>
                  <span className={styles.chev} aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
            </nav>
          </section>
        </div>
      )}
    </>
  )
}