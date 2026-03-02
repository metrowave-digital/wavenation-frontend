'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './ReadingProgressRail.module.css'

interface Section {
  id: string
  label: string
}

export function ReadingProgressRail({
  sections,
}: {
  sections: Section[]
}) {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState<string | null>(null)
  const rafRef = useRef<number | null>(null)

  const ids = useMemo(() => sections.map((s) => s.id), [sections])

  useEffect(() => {
    function compute() {
      rafRef.current = null

      const scrollY = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      setProgress(docHeight > 0 ? scrollY / docHeight : 0)

      // “reading line” — adjust if your header height changes
      const readingLine = 140

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        if (rect.top <= readingLine && rect.bottom > readingLine) {
          setActive(id)
          return
        }
      }

      setActive(null)
    }

    function onScroll() {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(compute)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    compute()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [ids])

  return (
    <aside className={styles.rail} aria-label="Reading progress">
      <div className={styles.track} aria-hidden="true">
        <div
          className={styles.progress}
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>

      <nav className={styles.markers} aria-label="Jump to section">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`${styles.marker} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.label}>{s.label}</span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}