import styles from './WatchRoomCard.module.css'

type StreamHealthStatus =
  | 'unknown'
  | 'ready'
  | 'testing'
  | 'live'
  | 'issue'
  | 'offline'

type WatchRoomCardProps = {
  title: string
  isLive: boolean
  streamHealthStatus?: StreamHealthStatus
  startAt?: string | null
  timezone?: string | null
}

function statusLabel(status: StreamHealthStatus = 'unknown') {
  switch (status) {
    case 'ready':
      return 'Ready'
    case 'testing':
      return 'Testing'
    case 'live':
      return 'Live'
    case 'issue':
      return 'Issue'
    case 'offline':
      return 'Offline'
    default:
      return 'Unknown'
  }
}

function formatEventTime(
  dateString?: string | null,
  timezone?: string | null,
) {
  if (!dateString) return null

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  }).format(new Date(dateString))
}

export function WatchRoomCard({
  title,
  isLive,
  streamHealthStatus = 'unknown',
  startAt,
  timezone,
}: WatchRoomCardProps) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Event Room</h3>

      <p className={styles.copy}>
        {isLive
          ? `${title} is live now. Join the conversation and stay with the stream.`
          : 'This room updates as the stream status changes.'}
      </p>

      <div className={styles.metaStack}>
        <div className={styles.row}>
          <span className={styles.label}>Stream status</span>
          <span className={styles.value}>
            {statusLabel(streamHealthStatus)}
          </span>
        </div>

        {startAt ? (
          <div className={styles.row}>
            <span className={styles.label}>Start time</span>
            <span className={styles.value}>
              {formatEventTime(startAt, timezone)}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  )
}