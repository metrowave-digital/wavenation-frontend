'use client'

import styles from './WatchSidebar.module.css'
import { LiveChat } from '../../../components/LiveChat'
import { QuestionForm } from '../../../components/QuestionForm'
import { WatchRoomCard } from '../WatchRoomCard/WatchRoomCard'
import { WatchActionsCard } from '../WatchActionsCard/WatchActionsCard'
import { WatchProductionCard } from '../WatchProductionCard/WatchProductionCard'

type WatchSidebarProps = {
  slug: string
  title: string
  isLive: boolean
  chatEnabled: boolean
  qaEnabled: boolean
  chatMode: 'disabled' | 'native' | 'qa-only' | 'external'
  chatEmbedUrl?: string | null
  qaPrompt?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  eventbriteUrl?: string | null
  streamHealthStatus?:
    | 'unknown'
    | 'ready'
    | 'testing'
    | 'live'
    | 'issue'
    | 'offline'
  producerName?: string | null
  moderatorName?: string | null
  technicalDirectorName?: string | null
  startAt?: string | null
  timezone?: string | null
}

export function WatchSidebar({
  slug,
  title,
  isLive,
  chatEnabled,
  qaEnabled,
  chatMode,
  chatEmbedUrl,
  qaPrompt,
  ctaLabel,
  ctaUrl,
  eventbriteUrl,
  streamHealthStatus = 'unknown',
  producerName,
  moderatorName,
  technicalDirectorName,
  startAt,
  timezone,
}: WatchSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <WatchRoomCard
        title={title}
        isLive={isLive}
        streamHealthStatus={streamHealthStatus}
        startAt={startAt}
        timezone={timezone}
      />

      {(ctaUrl || eventbriteUrl) && (
        <WatchActionsCard
          ctaLabel={ctaLabel}
          ctaUrl={ctaUrl}
          eventbriteUrl={eventbriteUrl}
        />
      )}

      {chatEnabled && chatMode === 'external' && chatEmbedUrl ? (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Live Chat</h3>
          <div className={styles.embedShell}>
            <iframe
              src={chatEmbedUrl}
              title="Live Chat"
              className={styles.iframe}
            />
          </div>
        </section>
      ) : null}

      {chatEnabled && chatMode === 'native' ? (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Live Chat</h3>
          <LiveChat slug={slug} />
        </section>
      ) : null}

      {qaEnabled ? (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Submit a Question</h3>
          <QuestionForm slug={slug} prompt={qaPrompt} />
        </section>
      ) : null}

      <WatchProductionCard
        producerName={producerName}
        moderatorName={moderatorName}
        technicalDirectorName={technicalDirectorName}
      />
    </div>
  )
}