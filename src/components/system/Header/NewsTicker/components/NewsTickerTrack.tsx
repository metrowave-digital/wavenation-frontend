import Link from 'next/link'
import styles from './NewsTickerTrack.module.css'
import type { NewsTickerItem } from '../newsTicker.types'
import { isExternalLink } from '../newsTicker.utils'
import { trackNewsTickerClick } from '@/lib/analytics'

interface NewsTickerTrackProps {
  items: NewsTickerItem[]
}

export function NewsTickerTrack({
  items,
}: NewsTickerTrackProps) {
  const loopItems =
    items.length <= 1 ? items : [...items, ...items]

  return (
    <>
      <div className={styles.track} aria-hidden="true">
        {loopItems.map((item, index) => {
          const content = (
            <>
              {item.isBreaking && (
                <span className={styles.breakingInline}>
                  Breaking
                </span>
              )}

              {item.category && (
                <span className={styles.categoryTag}>
                  {item.category}
                </span>
              )}

              <span className={styles.text}>{item.label}</span>
            </>
          )

          const onClick = () =>
            trackNewsTickerClick({
              id: item.id,
              breaking: Boolean(item.isBreaking),
              external: isExternalLink(item.href),
            })

          return (
            <div
              key={`${item.id}-${index}`}
              className={styles.item}
              data-category={item.category}
            >
              {item.href ? (
                isExternalLink(item.href) ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClick}
                  >
                    {content}
                  </a>
                ) : (
                  <Link href={item.href} onClick={onClick}>
                    {content}
                  </Link>
                )
              ) : (
                <span className={styles.staticItem}>
                  {content}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Screen reader accessible static list */}
      <ul className={styles.srOnlyList}>
        {items.map(item => (
          <li key={item.id}>
            {item.href ? (
              item.href.startsWith('http') ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </>
  )
}