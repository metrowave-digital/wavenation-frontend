import { ChevronRight } from 'lucide-react'
import styles from './MobileMenuContextBar.module.css'

interface MobileMenuContextBarProps {
  currentLabel: string
  parentLabel?: string
  breadcrumbs: string[]
  depth: number
  canGoBack: boolean
}

export function MobileMenuContextBar({
  currentLabel,
  parentLabel,
  breadcrumbs,
  depth,
  canGoBack,
}: MobileMenuContextBarProps) {
  return (
    <div className={styles.contextBar}>
      <div className={styles.contextText}>
        <span className={styles.contextEyebrow}>
          {canGoBack ? parentLabel ?? 'Section' : 'Browse'}
        </span>

        <h2 className={styles.contextTitle}>{currentLabel}</h2>

        <div className={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`} className={styles.crumb}>
              <span>{crumb}</span>
              {index < breadcrumbs.length - 1 ? (
                <ChevronRight className={styles.separator} aria-hidden />
              ) : null}
            </span>
          ))}
        </div>
      </div>

      {canGoBack ? <span className={styles.depthPill}>{depth}</span> : null}
    </div>
  )
}