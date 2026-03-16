'use client'

import { useEffect, useState } from 'react'

type SiteEvent = {
  id: string
  title: string
  summary: string
  url: string
  status: string
  startLocal: string | null
  endLocal: string | null
  timezone: string | null
  imageUrl: string | null
  isOnline: boolean
  isFree: boolean
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Date TBA'

  const date = new Date(dateString)

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function EventbriteEvents() {
  const [events, setEvents] = useState<SiteEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/eventbrite/events', {
          method: 'GET',
        })

        if (!res.ok) {
          throw new Error('Unable to fetch events')
        }

        const data = await res.json()
        setEvents(data.events ?? [])
      } catch (err) {
        console.error(err)
        setError('Unable to load events right now.')
      } finally {
        setLoading(false)
      }
    }

    void loadEvents()
  }, [])

  if (loading) {
    return <div>Loading events…</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!events.length) {
    return <div>No live events available.</div>
  }

  return (
    <section>
      <h2>Upcoming Events</h2>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {events.map((event) => (
          <article
            key={event.id}
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#111',
            }}
          >
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : null}

            <div style={{ padding: '1rem' }}>
              <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>
                {event.isOnline ? 'Virtual Event' : 'In-Person Event'} ·{' '}
                {event.isFree ? 'Free' : 'Ticketed'}
              </p>

              <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>

              <p style={{ marginBottom: '0.75rem', opacity: 0.85 }}>
                {event.summary}
              </p>

              <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                {formatDate(event.startLocal)}
              </p>

              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  border: '1px solid currentColor',
                }}
              >
                View on Eventbrite
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}