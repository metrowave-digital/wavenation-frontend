import styles from './LiveEventNotice.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'

type Props = {
  event: PayloadEvent
}

export function LiveEventNotice({ event }: Props) {
  if (event.status !== 'live') return null

  return (
    <div className={styles.notice}>
      This event is live right now.
      {event.streamEmbedUrl ? ' Watch from the event page below.' : ' Join while the stream is active.'}
    </div>
  )
}