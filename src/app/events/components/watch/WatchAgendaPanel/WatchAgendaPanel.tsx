import styles from './WatchAgendaPanel.module.css'

type AgendaItem = {
  time: string | null
  title: string | null
  description: string | null
}

type WatchAgendaPanelProps = {
  items: AgendaItem[]
  isLive?: boolean
}

export function WatchAgendaPanel({
  items,
  isLive = false,
}: WatchAgendaPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Agenda</h2>
        {isLive ? (
          <span className={styles.livePill}>HAPPENING NOW</span>
        ) : null}
      </div>

      <div className={styles.stack}>
        {items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className={styles.item}
          >
            {item.time ? (
              <div className={styles.time}>{item.time}</div>
            ) : null}

            <div className={styles.body}>
              {item.title ? (
                <h3 className={styles.itemTitle}>{item.title}</h3>
              ) : null}

              {item.description ? (
                <p className={styles.description}>
                  {item.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}