import styles from './EventAgenda.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'

type Props = {
  agenda?: PayloadEvent['agenda']
}

export function EventAgenda({ agenda }: Props) {
  if (!agenda?.length) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Agenda</h2>

      <div className={styles.list}>
        {agenda.map((item, index) => (
          <article key={item?.id || `${item?.title}-${index}`} className={styles.item}>
            {item?.time ? <div className={styles.time}>{item.time}</div> : null}
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              {item.description ? (
                <p className={styles.description}>{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}