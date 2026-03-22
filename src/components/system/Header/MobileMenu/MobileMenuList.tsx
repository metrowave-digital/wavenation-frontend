import type { NavItem } from '../nav/nav.types'
import { getItemKey } from './mobileMenu.utils'
import { MobileMenuItem } from './MobileMenuItem'
import styles from './MobileMenuList.module.css'

interface MobileMenuListProps {
  sectionLabel: string
  items: NavItem[]
  pathname: string
  onOpenChild: (item: NavItem) => void
  onNavigate: () => void
}

export function MobileMenuList({
  sectionLabel,
  items,
  pathname,
  onOpenChild,
  onNavigate,
}: MobileMenuListProps) {
  return (
    <nav className={styles.nav} aria-label="Mobile site navigation">
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li
            key={getItemKey(item, index)}
            className={styles.item}
            style={{ ['--item-index' as string]: index } as React.CSSProperties}
          >
            <MobileMenuItem
              item={item}
              pathname={pathname}
              sectionLabel={sectionLabel}
              onOpenChild={onOpenChild}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}