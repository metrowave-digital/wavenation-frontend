'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './ModeratorDashboard.module.css'

type ModeratorDashboardProps = {
  slug: string
  authed: boolean
}

type QuestionItem = {
  id: string
  name?: string
  email?: string
  question?: string
  status?: string
  isHighlighted?: boolean
  createdAt?: string
}

type ChatItem = {
  id: string
  name?: string
  role?: string
  message?: string
  status?: string
  isPinned?: boolean
  isAnnouncement?: boolean
  createdAt?: string
}

export function ModeratorDashboard({
  slug,
  authed,
}: ModeratorDashboardProps) {
  const [authenticated, setAuthenticated] = useState(authed)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)

  const [questionStatus, setQuestionStatus] = useState('pending')
  const [chatStatus, setChatStatus] = useState('pending')

  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [chat, setChat] = useState<ChatItem[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const [modMessage, setModMessage] = useState('')
  const [modName, setModName] = useState('Moderator')
  const [modRole, setModRole] = useState('moderator')
  const [modPinned, setModPinned] = useState(false)
  const [modAnnouncement, setModAnnouncement] = useState(false)
  const [postState, setPostState] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)

    const res = await fetch('/api/moderator/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setLoginError(data?.error || 'Login failed.')
      return
    }

    setAuthenticated(true)
    setPassword('')
  }

  async function handleLogout() {
    await fetch('/api/moderator/logout', { method: 'POST' })
    setAuthenticated(false)
    setQuestions([])
    setChat([])
  }

  async function loadQuestions() {
    setLoadingQuestions(true)
    try {
      const res = await fetch(
        `/api/moderator/events/${slug}/questions?status=${questionStatus}`,
        { cache: 'no-store' },
      )
      const data = await res.json()
      if (res.ok) setQuestions(data?.docs || [])
    } finally {
      setLoadingQuestions(false)
    }
  }

  async function loadChat() {
    setLoadingChat(true)
    try {
      const res = await fetch(
        `/api/moderator/events/${slug}/chat?status=${chatStatus}`,
        { cache: 'no-store' },
      )
      const data = await res.json()
      if (res.ok) setChat(data?.docs || [])
    } finally {
      setLoadingChat(false)
    }
  }

  useEffect(() => {
    if (!authenticated) return
    loadQuestions()
  }, [authenticated, questionStatus])

  useEffect(() => {
    if (!authenticated) return
    loadChat()
  }, [authenticated, chatStatus])

  async function updateQuestion(
    id: string,
    payload: Record<string, unknown>,
  ) {
    const res = await fetch(
      `/api/moderator/events/${slug}/questions`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      },
    )

    if (res.ok) {
      loadQuestions()
    }
  }

  async function updateChat(
    id: string,
    payload: Record<string, unknown>,
  ) {
    const res = await fetch(`/api/moderator/events/${slug}/chat`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload }),
    })

    if (res.ok) {
      loadChat()
    }
  }

  async function postModeratorMessage(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()
    setPostState('Posting...')

    const res = await fetch(`/api/moderator/events/${slug}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: modName,
        role: modRole,
        message: modMessage,
        isPinned: modPinned,
        isAnnouncement: modAnnouncement,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setPostState(data?.error || 'Failed to post message.')
      return
    }

    setPostState('Message posted.')
    setModMessage('')
    setModPinned(false)
    setModAnnouncement(false)
    loadChat()
  }

  const pendingQuestionCount = useMemo(
    () =>
      questions.filter(item => item.status === 'pending').length,
    [questions],
  )

  if (!authenticated) {
    return (
      <main className={styles.page}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Moderator Login</h1>
          <p className={styles.subtext}>
            Enter the shared moderator password to manage Q&amp;A and live chat.
          </p>

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.primaryButton}>
              Enter Dashboard
            </button>
          </form>

          {loginError ? (
            <p className={styles.error}>{loginError}</p>
          ) : null}
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Moderator Dashboard</h1>
          <p className={styles.subtext}>
            Event: <strong>{slug}</strong>
          </p>
        </div>

        <button onClick={handleLogout} className={styles.secondaryButton}>
          Log Out
        </button>
      </div>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Questions</h2>
            <div className={styles.controls}>
              <select
                className={styles.select}
                value={questionStatus}
                onChange={e => setQuestionStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="answered">Answered</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                className={styles.smallButton}
                onClick={loadQuestions}
              >
                Refresh
              </button>
            </div>
          </div>

          <p className={styles.metaLine}>
            Pending in current list: {pendingQuestionCount}
          </p>

          <div className={styles.list}>
            {loadingQuestions ? (
              <p className={styles.empty}>Loading questions...</p>
            ) : questions.length === 0 ? (
              <p className={styles.empty}>No questions found.</p>
            ) : (
              questions.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemTop}>
                    <div>
                      <strong>{item.name || 'Guest'}</strong>
                      {item.email ? (
                        <span className={styles.muted}> · {item.email}</span>
                      ) : null}
                    </div>
                    <span className={styles.badge}>
                      {item.status || 'pending'}
                    </span>
                  </div>

                  <p className={styles.itemBody}>{item.question}</p>

                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateQuestion(item.id, { status: 'approved' })
                      }
                    >
                      Approve
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateQuestion(item.id, { status: 'answered' })
                      }
                    >
                      Mark Answered
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateQuestion(item.id, { status: 'rejected' })
                      }
                    >
                      Reject
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateQuestion(item.id, {
                          isHighlighted: !item.isHighlighted,
                        })
                      }
                    >
                      {item.isHighlighted ? 'Unhighlight' : 'Highlight'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Chat Moderation</h2>
            <div className={styles.controls}>
              <select
                className={styles.select}
                value={chatStatus}
                onChange={e => setChatStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="hidden">Hidden</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className={styles.smallButton} onClick={loadChat}>
                Refresh
              </button>
            </div>
          </div>

          <div className={styles.list}>
            {loadingChat ? (
              <p className={styles.empty}>Loading chat...</p>
            ) : chat.length === 0 ? (
              <p className={styles.empty}>No chat messages found.</p>
            ) : (
              chat.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemTop}>
                    <div>
                      <strong>{item.name || 'Guest'}</strong>
                      {item.role ? (
                        <span className={styles.muted}> · {item.role}</span>
                      ) : null}
                    </div>
                    <span className={styles.badge}>
                      {item.status || 'pending'}
                    </span>
                  </div>

                  <p className={styles.itemBody}>{item.message}</p>

                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateChat(item.id, { status: 'approved' })
                      }
                    >
                      Approve
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateChat(item.id, { status: 'hidden' })
                      }
                    >
                      Hide
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateChat(item.id, { status: 'rejected' })
                      }
                    >
                      Reject
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateChat(item.id, {
                          isPinned: !item.isPinned,
                        })
                      }
                    >
                      {item.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        updateChat(item.id, {
                          isAnnouncement: !item.isAnnouncement,
                        })
                      }
                    >
                      {item.isAnnouncement
                        ? 'Remove Announcement'
                        : 'Make Announcement'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Post Moderator Message</h2>
        </div>

        <form className={styles.form} onSubmit={postModeratorMessage}>
          <div className={styles.twoCol}>
            <input
              className={styles.input}
              value={modName}
              onChange={e => setModName(e.target.value)}
              placeholder="Display name"
            />
            <select
              className={styles.select}
              value={modRole}
              onChange={e => setModRole(e.target.value)}
            >
              <option value="moderator">Moderator</option>
              <option value="host">Host</option>
              <option value="producer">Producer</option>
              <option value="system">System</option>
            </select>
          </div>

          <textarea
            className={styles.textarea}
            value={modMessage}
            onChange={e => setModMessage(e.target.value)}
            placeholder="Type a moderator or announcement message"
            rows={4}
            required
          />

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={modPinned}
                onChange={e => setModPinned(e.target.checked)}
              />
              Pin message
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={modAnnouncement}
                onChange={e =>
                  setModAnnouncement(e.target.checked)
                }
              />
              Mark as announcement
            </label>
          </div>

          <button type="submit" className={styles.primaryButton}>
            Post Message
          </button>

          {postState ? (
            <p className={styles.metaLine}>{postState}</p>
          ) : null}
        </form>
      </section>
    </main>
  )
}