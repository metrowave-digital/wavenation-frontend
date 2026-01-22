'use client'

import { useState } from 'react'
import styles from './NewsletterCTA.module.css'
import { trackEvent } from '@/lib/analytics'

type FrequencyOption = 'daily' | 'weekly' | 'events'

export function NewsletterCta() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [options, setOptions] = useState<FrequencyOption[]>(['weekly'])

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ===============================
     VALIDATION (same as homepage)
  =============================== */

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const firstNameError =
    firstName && firstName.length < 2
      ? 'First name is too short'
      : null

  const lastNameError =
    lastName && lastName.length < 2
      ? 'Last name is too short'
      : null

  const emailError =
    email && !emailValid
      ? 'Enter a valid email address'
      : null

  const canSubmit =
    !loading &&
    firstName.length >= 2 &&
    lastName.length >= 2 &&
    emailValid &&
    options.length > 0

  /* ===============================
     HELPERS
  =============================== */

  function toggleOption(option: FrequencyOption) {
    setOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          preferences: options,
        }),
      })

      if (!res.ok) {
        throw new Error('Subscription failed')
      }

      trackEvent('newsletter_signup', {
        location: 'editorial_cta',
        preferences: options,
      })

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     SUCCESS STATE
  =============================== */

  if (submitted) {
    return (
      <section className={styles.root}>
        <div className={styles.success}>
          <span className={styles.emoji}>🌊</span>
          <h3>You’re in.</h3>
          <p>
            Welcome to WaveNation.
            <br />
            Your first drop is on the way.
          </p>
        </div>
      </section>
    )
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>WaveNation</span>
          <h2 className={styles.title}>
            Stay connected to the culture
          </h2>
          <p className={styles.description}>
            Artist spotlights, music drops, charts, and editorial — delivered
            how you want.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.nameRow}>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>

          {firstNameError && (
            <p className={styles.inlineError}>{firstNameError}</p>
          )}
          {lastNameError && (
            <p className={styles.inlineError}>{lastNameError}</p>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {emailError && (
            <p className={styles.inlineError}>{emailError}</p>
          )}

          <fieldset className={styles.options}>
            <legend>What do you want?</legend>

            <label>
              <input
                type="checkbox"
                checked={options.includes('daily')}
                onChange={() => toggleOption('daily')}
              />
              <span>Daily culture drops</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.includes('weekly')}
                onChange={() => toggleOption('weekly')}
              />
              <span>Weekly highlights</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.includes('events')}
                onChange={() => toggleOption('events')}
              />
              <span>Events & exclusives</span>
            </label>
          </fieldset>

          {error && (
            <p className={styles.error}>{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
          >
            {loading ? 'Joining…' : 'Join the Wave'}
          </button>
        </form>
      </div>
    </section>
  )
}
