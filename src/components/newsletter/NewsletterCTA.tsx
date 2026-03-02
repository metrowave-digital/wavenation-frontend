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

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const firstNameError =
    firstName && firstName.length < 2 ? 'First name is too short' : null

  const lastNameError =
    lastName && lastName.length < 2 ? 'Last name is too short' : null

  const emailError = email && !emailValid ? 'Enter a valid email address' : null

  const canSubmit =
    !loading &&
    firstName.length >= 2 &&
    lastName.length >= 2 &&
    emailValid &&
    options.length > 0

  function toggleOption(option: FrequencyOption) {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
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

  if (submitted) {
    return (
      <section className={styles.root} aria-label="Newsletter signup success">
        <div className={styles.card}>
          <div className={styles.success}>
            <span className={styles.badge} aria-hidden="true">
              🌊
            </span>
            <h3 className={styles.successTitle}>You’re in.</h3>
            <p className={styles.successText}>
              Welcome to WaveNation. Your first drop is on the way.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.root} aria-label="Newsletter signup">
      <div className={styles.card}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.inner}>
          {/* Copy */}
          <div className={styles.copy}>
            <span className={styles.eyebrow}>WaveNation</span>
            <h2 className={styles.title}>Stay connected to the culture</h2>
            <p className={styles.description}>
              Artist spotlights, music drops, charts, and editorial — delivered how you want.
            </p>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>No spam.</span>
              <span className={styles.trustDot} aria-hidden="true">
                •
              </span>
              <span className={styles.trustItem}>Unsubscribe anytime.</span>
            </div>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldRow}>
              <label className={styles.label}>
                <span className={styles.labelText}>First name</span>
                <input
                  className={`${styles.input} ${firstNameError ? styles.inputError : ''}`}
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Last name</span>
                <input
                  className={`${styles.input} ${lastNameError ? styles.inputError : ''}`}
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </label>
            </div>

            {(firstNameError || lastNameError) && (
              <p className={styles.inlineError} role="status">
                {firstNameError ?? lastNameError}
              </p>
            )}

            <label className={styles.label}>
              <span className={styles.labelText}>Email</span>
              <input
                className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            {emailError && (
              <p className={styles.inlineError} role="status">
                {emailError}
              </p>
            )}

            <fieldset className={styles.options}>
              <legend className={styles.legend}>What do you want?</legend>

              <div className={styles.optionGrid}>
                <label className={styles.option}>
                  <input
                    className={styles.optionInput}
                    type="checkbox"
                    checked={options.includes('daily')}
                    onChange={() => toggleOption('daily')}
                  />
                  <span className={styles.optionPill}>Daily culture drops</span>
                </label>

                <label className={styles.option}>
                  <input
                    className={styles.optionInput}
                    type="checkbox"
                    checked={options.includes('weekly')}
                    onChange={() => toggleOption('weekly')}
                  />
                  <span className={styles.optionPill}>Weekly highlights</span>
                </label>

                <label className={styles.option}>
                  <input
                    className={styles.optionInput}
                    type="checkbox"
                    checked={options.includes('events')}
                    onChange={() => toggleOption('events')}
                  />
                  <span className={styles.optionPill}>Events & exclusives</span>
                </label>
              </div>

              {options.length === 0 && (
                <p className={styles.inlineError} role="status">
                  Choose at least one option.
                </p>
              )}
            </fieldset>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button className={styles.submit} type="submit" disabled={!canSubmit}>
              {loading ? 'Joining…' : 'Join the Wave'}
              <span className={styles.submitArrow} aria-hidden="true">
                →
              </span>
            </button>

            <p className={styles.finePrint}>
              By subscribing, you agree to receive emails from WaveNation.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}