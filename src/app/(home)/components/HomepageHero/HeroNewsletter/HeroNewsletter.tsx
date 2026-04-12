'use client'

import { useState } from 'react'
import styles from './HeroNewsletter.module.css'
// Removed analytics import as requested

type FrequencyOption = 'daily' | 'weekly' | 'events'

export function HeroNewsletter() {
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
    firstName && firstName.length < 2 ? 'First name is too short' : null

  const lastNameError =
    lastName && lastName.length < 2 ? 'Last name is too short' : null

  const emailError =
    email && !emailValid ? 'Enter a valid email address' : null

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

      if (!res.ok) throw new Error('Subscription failed')

      // Analytics tracking removed here
      setSubmitted(true)
    } catch {
      setError('CONNECTION FAILED. RETRY TRANSMISSION.')
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     SUCCESS STATE
  =============================== */
  if (submitted) {
    return (
      <section className={`${styles.newsletterCard} ${styles.successCard}`}>
        <div className={styles.scanlines} />
        <div className={styles.vignette} />
        
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <div className={styles.pulseRing} />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className={styles.successTitle}>SIGNAL RECEIVED</h3>
          <p className={styles.successText}>
            Welcome to the network. <br/> Check your inbox for the first drop.
          </p>
        </div>
      </section>
    )
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <section className={styles.newsletterCard}>
      {/* Studio Monitor Effects */}
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.liveDot} />
            <span className={styles.kicker}>STAY CONNECTED</span>
          </div>
          <h3 className={styles.title}>THE DISPATCH</h3>
          <p className={styles.subtext}>
            Culture. Music. Exclusives. Straight to your inbox.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="FIRST NAME"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={`${styles.input} ${firstNameError ? styles.inputError : ''}`}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="LAST NAME"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={`${styles.input} ${lastNameError ? styles.inputError : ''}`}
              />
            </div>
          </div>
          
          {/* Validation Errors */}
          {(firstNameError || lastNameError) && (
            <p className={styles.inlineError}>
              {firstNameError || lastNameError}
            </p>
          )}

          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            />
          </div>
          {emailError && <p className={styles.inlineError}>{emailError}</p>}

          <fieldset className={styles.options}>
            <legend className={styles.legend}>SELECT YOUR FREQUENCY</legend>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.includes('daily')}
                onChange={() => toggleOption('daily')}
                className={styles.hiddenCheckbox}
              />
              <div className={styles.customCheckbox} />
              <span className={styles.optionText}>Daily Culture Drops</span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.includes('weekly')}
                onChange={() => toggleOption('weekly')}
                className={styles.hiddenCheckbox}
              />
              <div className={styles.customCheckbox} />
              <span className={styles.optionText}>Weekly Highlights</span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.includes('events')}
                onChange={() => toggleOption('events')}
                className={styles.hiddenCheckbox}
              />
              <div className={styles.customCheckbox} />
              <span className={styles.optionText}>Events & Exclusives</span>
            </label>
          </fieldset>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.button}
            disabled={!canSubmit}
          >
            {loading ? 'TRANSMITTING...' : 'JOIN THE WAVE'}
          </button>
        </form>
      </div>
    </section>
  )
}