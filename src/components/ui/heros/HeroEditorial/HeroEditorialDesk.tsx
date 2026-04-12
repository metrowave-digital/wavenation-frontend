import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Activity } from 'lucide-react'
import styles from './HeroEditorialDesk.module.css'

export interface EditorialStory {
  title: string
  href: string
  category: string
  image: string
  imageAlt?: string
}

export interface EditorialLeadStory extends EditorialStory {
  author?: string
  readTime?: string
  isBreaking?: boolean
}

interface HeroEditorialDeskProps {
  leadStory: EditorialLeadStory
  subStories: EditorialStory[]
}

export function HeroEditorialDesk({ leadStory, subStories }: HeroEditorialDeskProps) {
  // Ensure we only render up to 2 sub-stories to maintain the bento grid integrity
  const displaySubStories = subStories.slice(0, 2)

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        {/* Header Console */}
        <div className={styles.deskHeader}>
          <div className={styles.sysRow}>
            <span className={styles.sysLabel}>WN.SYSTEM {'//'} EDITORIAL_DESK</span>
            <div className={styles.sysStatus}>
              <Activity size={12} className={styles.pulse} /> SYNDICATE_ACTIVE
            </div>
          </div>
          <h1 className={styles.titleMain}>THE BLUEPRINT.</h1>
        </div>

        {/* Bento Grid */}
        <div className={styles.bentoGrid}>
          {/* Main Lead Story */}
          <Link href={leadStory.href} className={styles.leadCard}>
            <Image 
              src={leadStory.image} 
              alt={leadStory.imageAlt ?? leadStory.title} 
              fill 
              className={styles.cardBg} 
              priority
            />
            <div className={styles.cardGradient} />
            <div className={styles.cardContent}>
              <span className={leadStory.isBreaking ? styles.tagBreaking : styles.tagStandard}>
                {leadStory.isBreaking ? 'BREAKING' : leadStory.category.toUpperCase()}
              </span>
              <h2 className={styles.leadTitle}>{leadStory.title}</h2>
              <div className={styles.metaRow}>
                <span>BY {leadStory.author?.toUpperCase() ?? 'WAVENATION STAFF'}</span>
                <span className={styles.separator}>{'//'}</span>
                <span>{leadStory.readTime?.toUpperCase() ?? '4 MIN READ'}</span>
              </div>
            </div>
          </Link>

          {/* Sub Stories */}
          {displaySubStories.length > 0 && (
            <div className={styles.subGrid}>
              {displaySubStories.map((story, idx) => (
                <Link key={idx} href={story.href} className={styles.subCard}>
                  <Image 
                    src={story.image} 
                    alt={story.imageAlt ?? story.title} 
                    fill 
                    className={styles.cardBg} 
                  />
                  <div className={styles.cardGradient} />
                  <div className={styles.cardContent}>
                    <span className={styles.tagStandard}>{story.category.toUpperCase()}</span>
                    <h3 className={styles.subTitle}>{story.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}