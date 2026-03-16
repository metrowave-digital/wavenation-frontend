import styles from './EventMeta.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'

type Props = {
  event: PayloadEvent
  compact?: boolean
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return null

  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  const startLabel = start.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  if (!end) return startLabel

  const sameDay = start.toDateString() === end.toDateString()

  if (sameDay) {
    const endTime = end.toLocaleString('en-US', {
      timeStyle: 'short',
    })

    return `${startLabel} – ${endTime}`
  }

  const endLabel = end.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `${startLabel} – ${endLabel}`
}

export function EventMeta({ event, compact = false }: Props) {
  const dateRange = formatDateRange(event.startDate, event.endDate)

  return (
    <div className={compact ? styles.compact : styles.meta}>
      {dateRange ? (
        <div className={styles.item}>
          <span className={styles.label}>When</span>
          <span className={styles.value}>{dateRange}</span>
        </div>
      ) : null}

      {event.timezone ? (
        <div className={styles.item}>
          <span className={styles.label}>Timezone</span>
          <span className={styles.value}>{event.timezone}</span>
        </div>
      ) : null}

      {event.hostName ? (
        <div className={styles.item}>
          <span className={styles.label}>Host</span>
          <span className={styles.value}>{event.hostName}</span>
        </div>
      ) : null}

      {event.guestName?.length ? (
        <div className={styles.item}>
          <span className={styles.label}>Guests</span>
          <span className={styles.value}>{event.guestName.join(', ')}</span>
        </div>
      ) : null}
    </div>
  )
}