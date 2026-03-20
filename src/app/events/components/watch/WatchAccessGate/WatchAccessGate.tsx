import Link from 'next/link'
import styles from './WatchAccessGate.module.css'

type WatchAccessGateProps = {
  title: string
  message: string
  accessType?: 'open' | 'ticketed' | 'invite-only' | 'members-only' | null
  eventUrl: string
  loginRequired?: boolean
  ticketVerificationRequired?: boolean
  memberTierRequired?: string | null
  accessCodeLabel?: string | null
  eventbriteUrl?: string | null
}

export function WatchAccessGate({
  title,
  message,
  accessType,
  eventUrl,
  loginRequired,
  ticketVerificationRequired,
  memberTierRequired,
  accessCodeLabel,
  eventbriteUrl,
}: WatchAccessGateProps) {
  return (
    <section className={styles.card} aria-label="Watch access required">
      <div className={styles.eyebrow}>ACCESS REQUIRED</div>
      <h2 className={styles.title}>You can’t watch {title} yet</h2>
      <p className={styles.message}>{message}</p>

      <div className={styles.meta}>
        {accessType ? <span>Access: {accessType}</span> : null}
        {memberTierRequired ? (
          <span>Tier: {memberTierRequired}</span>
        ) : null}
        {accessCodeLabel ? (
          <span>Code: {accessCodeLabel}</span>
        ) : null}
      </div>

      <div className={styles.actions}>
        <Link href={eventUrl} className={styles.primaryButton}>
          Go to event page
        </Link>

        {eventbriteUrl && ticketVerificationRequired ? (
          <a
            href={eventbriteUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
          >
            View ticket details
          </a>
        ) : null}

        {loginRequired ? (
          <button
            type="button"
            className={styles.ghostButton}
            disabled
            aria-disabled="true"
          >
            Sign in flow coming next
          </button>
        ) : null}
      </div>
    </section>
  )
}