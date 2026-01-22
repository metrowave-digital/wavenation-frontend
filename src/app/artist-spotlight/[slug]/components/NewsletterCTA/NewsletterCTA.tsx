'use client'

import { useId, useState } from 'react'
import styles from './NewsletterCTA.module.css'
import { trackEvent } from '@/lib/analytics'

type FrequencyOption = 'daily' | 'weekly' | 'events'

export function NewsletterCta() {
  const formId = useId()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [options, setOptions] = useState<FrequencyOption[]>(['weekly'])

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ===============================
     VALIDATION
  =============================== */

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const firstNameError =
    firstName.length > 0 && firstName.length < 2
      ? 'First name must be at least 2 characters'
      : null

  const lastNameError =
    lastName.length > 0 && lastName.length < 2
      ? 'Last name must be at least 2 characters'
      : null

  const emailError =
    email.length > 0 && !emailValid
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

      if (!res.ok) throw new Error('Subscription failed')

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
     SUCCESS STATE (Animated)
  =============================== */

  if (submitted) {
    return (
      <section className={styles.root} aria-live="polite">
        <div className={styles.inner}>
          <div className={styles.successCard}>
            <div className={styles.successBadge} aria-hidden>
              <span className={styles.emoji}>🌊</span>
            </div>

            <h3 className={styles.successTitle}>You’re in.</h3>

            <p className={styles.successText}>
              Welcome to WaveNation.
              <br />
              Your first drop is on the way.
            </p>

            <div className={styles.successFinePrint}>
              Tip: Add us to your contacts to avoid spam filters.
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <section className={styles.root} aria-labelledby={`${formId}-title`}>
      <div className={styles.inner}>
        {/* Copy */}
        <div className={styles.copy}>
          <span className={styles.eyebrow}>WaveNation</span>
          <h2 id={`${formId}-title`} className={styles.title}>
            Stay connected to the culture
          </h2>
          <p className={styles.description}>
            Artist spotlights, music drops, charts, and editorial — delivered how you want.
          </p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.nameRow}>
            <label className={styles.visuallyHidden} htmlFor={`${formId}-first`}>
              First name
            </label>
            <input
              id={`${formId}-first`}
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              aria-invalid={!!firstNameError}
            />

            <label className={styles.visuallyHidden} htmlFor={`${formId}-last`}>
              Last name
            </label>
            <input
              id={`${formId}-last`}
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              aria-invalid={!!lastNameError}
            />
          </div>

          {(firstNameError || lastNameError) && (
            <p className={styles.inlineError}>{firstNameError ?? lastNameError}</p>
          )}

          <label className={styles.visuallyHidden} htmlFor={`${formId}-email`}>
            Email address
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-invalid={!!emailError}
          />

          {emailError && <p className={styles.inlineError}>{emailError}</p>}

          <fieldset className={styles.options}>
            <legend>What do you want?</legend>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.includes('daily')}
                onChange={() => toggleOption('daily')}
              />
              <span>Daily culture drops</span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.includes('weekly')}
                onChange={() => toggleOption('weekly')}
              />
              <span>Weekly highlights</span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.includes('events')}
                onChange={() => toggleOption('events')}
              />
              <span>Events & exclusives</span>
            </label>
          </fieldset>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={!canSubmit} aria-disabled={!canSubmit}>
            {loading ? 'Joining…' : 'Join the Wave'}
          </button>
        </form>
      </div>
    </section>
  )
}
