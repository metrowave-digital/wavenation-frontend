'use client'

import { useState } from 'react'
import styles from './MobileContents.module.css'

interface Section {
  id: string
  label: string
}

export function MobileContents({
  sections,
}: {
  sections: Section[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
      >
        Contents
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.sheet}>
            <header>
              <strong>On this page</strong>
              <button
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </header>

            <nav>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
