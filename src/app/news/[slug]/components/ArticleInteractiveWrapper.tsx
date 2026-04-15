'use client'

import React, { useState, useEffect, useRef } from 'react'
import styles from '../NewsDetail.module.css' // Adjust path to your CSS module

export function ArticleInteractiveWrapper({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; src: string; caption: string }>({
    isOpen: false,
    src: '',
    caption: ''
  })

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement
        
        // Attempt to find a caption if the image is wrapped in a <figure>
        const figure = img.closest('figure')
        const figcaption = figure?.querySelector('figcaption')
        const captionText = figcaption?.textContent || img.alt || ''

        setLightbox({ isOpen: true, src: img.src, caption: captionText })
      }
    }

    container.addEventListener('click', handleImageClick)
    return () => container.removeEventListener('click', handleImageClick)
  }, [])

  return (
    <>
      <div ref={contentRef} className={styles.interactiveBody}>
        {children}
      </div>

      {lightbox.isOpen && (
        <div className={styles.lightboxOverlay} onClick={() => setLightbox({ ...lightbox, isOpen: false })}>
          <button 
            className={styles.lightboxClose} 
            onClick={() => setLightbox({ ...lightbox, isOpen: false })}
            aria-label="Close image"
          >
            &times;
          </button>
          
          <div className={styles.lightboxContent}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.src} alt={lightbox.caption} className={styles.lightboxImg} />
            {lightbox.caption && (
              <p className={styles.lightboxCaption}>{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}