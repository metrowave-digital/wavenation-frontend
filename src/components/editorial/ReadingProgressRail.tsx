'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight -
        window.innerHeight

      setProgress(docHeight > 0 ? scrollY / docHeight : 0)

      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        if (rect.top <= 140 && rect.bottom > 140) {
          setActive(s.id)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () =>
      window.removeEventListener('scroll', onScroll)
  }, [sections])

  return (
    <aside className={styles.rail}>
      <div className={styles.track}>
        <div
          className={styles.progress}
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>

      <nav className={styles.markers}>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            className={`${styles.marker} ${
              active === s.id ? styles.active : ''
            }`}
          />
        ))}
      </nav>
    </aside>
  )
}
