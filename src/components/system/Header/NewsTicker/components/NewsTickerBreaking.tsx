import Link from 'next/link'
import styles from './NewsTickerBreaking.module.css'
import type { NewsTickerItem } from '../newsTicker.types'
import { isExternalLink } from '../newsTicker.utils'
import { trackNewsTickerClick } from '@/lib/analytics'

interface NewsTickerBreakingProps {
  item: NewsTickerItem
}

export function NewsTickerBreaking({
  item,
}: NewsTickerBreakingProps) {
  const content = (
    <>
      <span className={styles.breakingBadge}>Breaking</span>
      <span className={styles.breakingText}>{item.label}</span>
    </>
  )

  const onClick = () =>
    trackNewsTickerClick({
      id: item.id,
      breaking: true,
      external: isExternalLink(item.href),
    })

  return (
    <div className={styles.breakingHold}>
      {item.href ? (
        isExternalLink(item.href) ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.breakingLink}
            onClick={onClick}
          >
            {content}
          </a>
        ) : (
          <Link
            href={item.href}
            className={styles.breakingLink}
            onClick={onClick}
          >
            {content}
          </Link>
        )
      ) : (
        content
      )}
    </div>
  )
}