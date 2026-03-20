'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type ChatMessage = {
  id: string
  name: string
  role: string
  message: string
  isPinned: boolean
  isAnnouncement: boolean
  createdAt: string | null
}

type LiveChatProps = {
  slug: string
}

export function LiveChat({ slug }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/events/${slug}/chat`, {
        cache: 'no-store',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load chat.')
      }

      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setError(null)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load chat.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const timer = window.setInterval(fetchMessages, 5000)
    return () => window.clearInterval(timer)
  }, [slug])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setSubmitMessage(null)

    try {
      const res = await fetch(`/api/events/${slug}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message.')
      }

      setSubmitMessage(data?.message || 'Message sent.')
      setMessage('')
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to send message.'
      setSubmitMessage(msg)
    } finally {
      setSending(false)
    }
  }

  const orderedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    })
  }, [messages])

  return (
    <div>
      <div
        style={{
          maxHeight: '340px',
          overflowY: 'auto',
          borderRadius: '16px',
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '0.75rem',
          marginBottom: '0.85rem',
        }}
      >
        {loading ? (
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
            Loading chat...
          </p>
        ) : error ? (
          <p style={{ margin: 0, color: '#fca5a5' }}>{error}</p>
        ) : orderedMessages.length === 0 ? (
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
            No approved messages yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {orderedMessages.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '0.75rem',
                  borderRadius: '14px',
                  background: item.isPinned
                    ? 'rgba(59,130,246,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border: item.isPinned
                    ? '1px solid rgba(59,130,246,0.26)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    marginBottom: '0.35rem',
                  }}
                >
                  <strong>{item.name}</strong>
                  {item.role !== 'viewer' ? (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {item.role}
                    </span>
                  ) : null}
                  {item.isPinned ? (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px',
                        background: 'rgba(59,130,246,0.18)',
                      }}
                    >
                      pinned
                    </span>
                  ) : null}
                </div>
                <p
                  style={{
                    margin: 0,
                    color: 'rgba(255,255,255,0.84)',
                    lineHeight: 1.55,
                  }}
                >
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Type your message"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          style={textareaStyle}
        />

        <button
          type="submit"
          disabled={sending}
          style={buttonStyle}
        >
          {sending ? 'Sending...' : 'Send Message'}
        </button>

        {submitMessage ? (
          <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.78)' }}>
            {submitMessage}
          </p>
        ) : null}
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '14px',
  padding: '0.875rem',
  background: '#101010',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.12)',
  font: 'inherit',
  boxSizing: 'border-box',
  marginBottom: '0.75rem',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '100px',
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  border: 0,
  borderRadius: '999px',
  padding: '0.85rem 1rem',
  cursor: 'pointer',
  fontWeight: 700,
}