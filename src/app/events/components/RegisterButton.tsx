import styles from './RegisterButton.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'

type Props = {
  event: PayloadEvent
}

export function RegisterButton({ event }: Props) {
  const href = event.ctaUrl || event.eventbriteUrl || event.replayUrl || '#'
  const label =
    event.ctaLabel ||
    (event.status === 'ended' && event.replayUrl ? 'Watch Replay' : 'Register Now')

  const isDisabled = href === '#'

  if (isDisabled) {
    return (
      <span className={styles.disabled} aria-disabled="true">
        Registration Details Coming Soon
      </span>
    )
  }

  return (
    <a
      href={href}
      className={styles.button}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  )
}