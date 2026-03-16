import styles from './EventFAQ.module.css'
import type { PayloadEvent } from '@/lib/payload/getEvents'

type Props = {
  faq?: PayloadEvent['faq']
}

export function EventFAQ({ faq }: Props) {
  if (!faq?.length) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>FAQ</h2>

      <div className={styles.list}>
        {faq.map((item, index) => (
          <details key={item?.id || `${item?.question}-${index}`} className={styles.item}>
            <summary className={styles.question}>{item.question}</summary>
            <div className={styles.answer}>{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  )
}