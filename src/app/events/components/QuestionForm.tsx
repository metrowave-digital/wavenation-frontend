'use client'

import { FormEvent, useState } from 'react'

type QuestionFormProps = {
  slug: string
  prompt?: string | null
}

export function QuestionForm({
  slug,
  prompt,
}: QuestionFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch(`/api/events/${slug}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          question,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit question.')
      }

      setMessage(data?.message || 'Question submitted.')
      setQuestion('')
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p
        style={{
          marginTop: 0,
          color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.6,
        }}
      >
        {prompt ||
          'Submit your question for possible inclusion during the live event.'}
      </p>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={inputStyle}
      />

      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="Type your question here"
        rows={5}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        required
        style={textareaStyle}
      />

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? 'Sending...' : 'Send Question'}
      </button>

      {message ? (
        <p style={{ marginTop: '0.75rem', color: '#86efac' }}>
          {message}
        </p>
      ) : null}

      {error ? (
        <p style={{ marginTop: '0.75rem', color: '#fca5a5' }}>
          {error}
        </p>
      ) : null}
    </form>
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
  minHeight: '120px',
}

const buttonStyle: React.CSSProperties = {
  marginTop: '0.25rem',
  width: '100%',
  border: 0,
  borderRadius: '999px',
  padding: '0.85rem 1rem',
  cursor: 'pointer',
  fontWeight: 700,
}