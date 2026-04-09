'use client'

import { LiveChat } from './LiveChat'
import { QuestionForm } from './QuestionForm'

type EventSidebarProps = {
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
}

function statusLabel(
  status:
    | 'unknown'
    | 'ready'
    | 'testing'
    | 'live'
    | 'issue'
    | 'offline' = 'unknown',
) {
  switch (status) {
    case 'ready':
      return 'Ready'
    case 'testing':
      return 'Testing'
    case 'live':
      return 'Live'
    case 'issue':
      return 'Issue'
    case 'offline':
      return 'Offline'
    default:
      return 'Unknown'
  }
}

export function EventSidebar({
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
}: EventSidebarProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        position: 'sticky',
        top: '1rem',
      }}
    >
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
          Event Room
        </h3>
        <p
          style={{
            marginTop: 0,
            marginBottom: '0.75rem',
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.6,
          }}
        >
          {isLive
            ? `${title} is live now.`
            : 'This room updates as the stream status changes.'}
        </p>

        <div
          style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.72)',
          }}
        >
          Stream status: {statusLabel(streamHealthStatus)}
        </div>
      </div>

      {(ctaUrl || eventbriteUrl) && (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Event Links</h3>

          {ctaUrl ? (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noreferrer"
              style={primaryLinkStyle}
            >
              {ctaLabel || 'Open Event'}
            </a>
          ) : null}

          {eventbriteUrl ? (
            <a
              href={eventbriteUrl}
              target="_blank"
              rel="noreferrer"
              style={secondaryLinkStyle}
            >
              View on Eventbrite
            </a>
          ) : null}
        </div>
      )}

      {chatEnabled && chatMode === 'external' && chatEmbedUrl ? (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Live Chat</h3>
          <div
            style={{
              overflow: 'hidden',
              borderRadius: '16px',
              background: '#0b0b0b',
              minHeight: '320px',
            }}
          >
            <iframe
              src={chatEmbedUrl}
              title="Live Chat"
              style={{
                width: '100%',
                height: '360px',
                border: 0,
              }}
            />
          </div>
        </div>
      ) : null}

      {chatEnabled && chatMode === 'native' ? (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Live Chat</h3>
          <LiveChat slug={slug} />
        </div>
      ) : null}

      {qaEnabled ? (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Submit a Question</h3>
          <QuestionForm slug={slug} prompt={qaPrompt} />
        </div>
      ) : null}

      {(producerName || moderatorName || technicalDirectorName) && (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Production</h3>
          <div
            style={{
              display: 'grid',
              gap: '0.5rem',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.55,
            }}
          >
            {producerName ? <div>Producer: {producerName}</div> : null}
            {moderatorName ? <div>Moderator: {moderatorName}</div> : null}
            {technicalDirectorName ? (
              <div>Technical Director: {technicalDirectorName}</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px',
  padding: '1rem',
  background: 'rgba(255,255,255,0.035)',
  backdropFilter: 'blur(18px)',
}

const primaryLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '999px',
  textDecoration: 'none',
  color: '#050505',
  background: '#fff',
  fontWeight: 700,
  marginBottom: '0.75rem',
}

const secondaryLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '999px',
  textDecoration: 'none',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'transparent',
  fontWeight: 700,
}